import type { StartLoginResI } from '@/interface/auth.interface';
import { RequestService } from './api/client';
import { AuthEndpoints, OrganizationEndpoints } from './api/endpoints';
import { logger } from './logger.service';

/**
 * Authentication Service
 * Provides high-level authentication methods that wrap the RequestService
 */
class AuthService {
  /**
   * Login with two-step process
   * Handles both single-school and multi-school user flows
   */
  async login(phoneNumber: string, password: string): Promise<StartLoginResI> {
    const requestData = {
      phoneNumber: phoneNumber,
      pin: password
    };
    
        const response = await RequestService.post<StartLoginResI>(AuthEndpoints.loginStepOne, requestData);
    
    // Extract the actual data from the nested response
    const responseData = response.data || response;
    
    // If user has multiple schools, return temp token
    if (responseData.tempToken && responseData.orgs) {
      return responseData;
    }
    
    // If user has single school, set permanent token directly
    if (responseData.token) {
      RequestService.setToken(responseData.token);
      return responseData;
    }
    
    throw new Error('Invalid login response');
  }

  // Select school for multi-school users
  async selectSchool(tempToken: string, schoolId: string): Promise<StartLoginResI> {
    const queryParams = new URLSearchParams({
      tempToken,
      orgId: schoolId
    });
    
    const response = await RequestService.post<StartLoginResI>(`${AuthEndpoints.loginStepTwo}?${queryParams.toString()}`, {});
    
    // Extract the actual data from the nested response
    const responseData = response.data || response;
    
    if (responseData.token) {
      RequestService.setToken(responseData.token);
      return responseData;
    }
    
    throw new Error('School selection failed');
  }

  /**
   * Get a new token for organization switch using current token
   * Decodes current JWT to get phone number, then attempts to get tempToken and new token
   * @param orgId - Organization ID to switch to
   * @returns Updated token and user data
   */
  async getNewTokenForOrg(orgId: string): Promise<StartLoginResI> {
    try {
      const currentToken = RequestService.getToken();
      if (!currentToken) {
        throw new Error('No authentication token found');
      }

      // Decode token to get phone number
      const { jwtDecode } = await import('jwt-decode');
      const decoded: any = jwtDecode(currentToken);
      const adminObj = decoded?.admin;
      const phoneNumber = adminObj?.phoneNumber || adminObj?.phone;

      if (!phoneNumber) {
        throw new Error('Phone number not found in token');
      }

      logger.debug('Getting new token using current token', {
        phoneNumber: phoneNumber.substring(0, 4) + '****',
        orgId: orgId,
      });

      // Try to get tempToken by calling loginStepOne with current token
      // Some backends might accept token in Authorization header for tempToken generation
      try {
        // First, try getting tempToken using current token (if backend supports it)
        const tempTokenResponse = await RequestService.post<StartLoginResI>(
          AuthEndpoints.loginStepOne,
          { phoneNumber }
        );

        const tempData = tempTokenResponse.data || tempTokenResponse;
        
        if (tempData.tempToken) {
          logger.debug('Got tempToken, getting new token for org');

          // Use tempToken to get new token for selected organization
          const newTokenResponse = await this.selectSchool(tempData.tempToken, orgId);
          
          if (newTokenResponse.token) {
            logger.info('Got new token after re-login');
            return newTokenResponse;
          }
        }
      } catch (error: any) {
        logger.warn('Failed to get tempToken with current token', error);
        // This is expected if backend requires PIN for loginStepOne
        // We'll handle it gracefully
      }

      // If we can't get tempToken without PIN, throw error
      throw new Error('Unable to get new token - PIN required');
    } catch (error: any) {
      logger.authError('Token-based re-login', error);
      throw error;
    }
  }

  /**
   * Switch organization for already logged-in users
   * Uses PATCH endpoint with orgId query parameter
   * After successful switch, attempts automatic re-login using current token if no token in response
   * @param orgId - Organization ID to switch to
   * @returns Updated token and user data
   */
  async switchOrganization(orgId: string): Promise<StartLoginResI> {
    const queryParams = new URLSearchParams({
      orgId: orgId
    });
    
    const url = `${AuthEndpoints.switchOrganization}?${queryParams.toString()}`;
    
    // Log request details
    logger.debug('Switching organization', {
      url: url,
      orgId: orgId,
      method: 'PATCH',
      endpoint: AuthEndpoints.switchOrganization,
    });
    
    try {
      const response = await RequestService.patch<StartLoginResI>(url, {});
      
      // Log full response
      logger.debug('Switch organization response', {
        type: typeof response,
        isArray: Array.isArray(response),
        hasData: response && typeof response === 'object' && 'data' in response,
        hasToken: response && typeof response === 'object' && 'token' in response,
      });
      
      // Extract the actual data from the nested response
      const responseData = response.data || response;
      
      logger.debug('Extracted response data', {
        hasToken: responseData && typeof responseData === 'object' && 'token' in responseData,
        tokenExists: !!responseData?.token,
        status: (responseData as any)?.status,
      });
      
      // If token is in response, use it directly
      if (responseData.token) {
        RequestService.setToken(responseData.token);
        logger.info('Token updated successfully');
        return responseData;
      }
      
      // Handle successful switch without token
      const responseDataAny = responseData as any;
      const isSuccess = 
        responseDataAny.status === 'success' || 
        responseDataAny.message === 'Account switched successfully';
      
      if (isSuccess) {
        logger.info('Switch succeeded but no token - current token will work with new org context');
        // Don't attempt automatic re-login - it requires PIN which we don't have
        // The current token is still valid, backend has just switched the org context
        // Return success response - the token stored in RequestService is still valid
        return responseData;
      }
      
      // Log error details before throwing
      logger.error('Switch failed - unexpected response', {
        responseData: responseData,
        availableKeys: responseData && typeof responseData === 'object' ? Object.keys(responseData) : null,
      });
      throw new Error('Organization switch failed: Unexpected response format');
    } catch (error: any) {
      // Log error details
      logger.authError('Switch organization', error);
      throw error;
    }
  }

  // Register new school
  async registerSchool(data: any) {
    const requestData = {
      examPortal: false,
      email: data.contactEmail,
      organizationName: data.schoolName,
      phoneNumber: data.contactPhone,
      organizationCategory: 'school',
      schoolType: data.schoolType,
      schoolCategoryBoard: data.category || 'privateSchool'
    };
    
    return await RequestService.post(OrganizationEndpoints.registerSchool, requestData);
  }

  // Verify email for incomplete signups
  async verifyEmail(data: { email: string }) {
    const requestData = {
      email: data.email
    };
    
    return await RequestService.post(AuthEndpoints.verifyEmail, requestData);
  }

  // Forgot password
  async forgotPassword(email: string) {
    const requestData = {
      email: email
    };
    
    return await RequestService.post(AuthEndpoints.forgotPassword, requestData);
  }

  // Reset password
  async resetPassword(token: string, password: string) {
    const requestData = {
      token: token,
      password: password
    };
    
    return await RequestService.post(AuthEndpoints.resetPassword, requestData);
  }

  // Send Admin OTP
  async sendAdminOTP(phoneNumber: string, pin: string) {
    const requestData = {
      phoneNumber: phoneNumber,
      pin: pin
    };
    
        const response = await RequestService.post(AuthEndpoints.sendAdminOTP, requestData);
    return response;
  }

  // Verify Admin OTP
  async verifyAdminOTP(phoneNumber: string, confirmCode: string) {
    const requestData = {
      phoneNumber: phoneNumber,
      confirmCode: confirmCode
    };
    
        const response = await RequestService.post(AuthEndpoints.verifyAdminOTP, requestData);
    return response;
  }

  // Verify phone number
  async verifyPhone(phoneNumber: string, otp: string) {
    const requestData = {
      phoneNumber: phoneNumber,
      confirmCode: parseInt(otp)
    };
    
        const response = await RequestService.post(AuthEndpoints.verifyPhone, requestData);
    return response;
  }

  // Resend phone OTP
  async resendPhoneOTP(phoneNumber: string) {
    const requestData = {
      phoneNumber: phoneNumber
    };
    
        const response = await RequestService.post(AuthEndpoints.resendPhoneOTP, requestData);
    return response;
  }

  // Verify portal ID
  async verifyPortalId(portalId: string) {
    const requestData = {
      portalId: portalId
    };
    
    return await RequestService.post(AuthEndpoints.verifyPortalId, requestData);
  }

  // Set pass PIN
  async setPassPin(phoneNumber: string, pin: string) {
    const requestData = {
      pin: pin
    };
    
    return await RequestService.patch(`${AuthEndpoints.setPassPin}?phoneNumber=${phoneNumber}`, requestData);
  }

  // Forget PIN
  async forgetPin(phoneNumber: string) {
    const requestData = {
      phoneNumber: phoneNumber
    };
    
    return await RequestService.post(AuthEndpoints.forgetPin, requestData);
  }

  // Reset PIN
  async resetPin(phoneNumber: string, resetCode: string, newPin: string) {
    const requestData = {
      phoneNumber: phoneNumber,
      resetCode: resetCode,
      newPin: newPin
    };
    
    return await RequestService.post(AuthEndpoints.resetPin, requestData);
  }

  // Logout
  async logout() {
    try {
      await RequestService.post(AuthEndpoints.logout, {});
    } catch (error) {
    } finally {
      RequestService.setToken(null);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return RequestService.isAuthenticated();
  }

  // Get current token
  getToken(): string | null {
    return RequestService.getToken();
  }
}

export default new AuthService();
