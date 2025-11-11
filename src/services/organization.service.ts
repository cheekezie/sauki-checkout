import { RequestService } from './api/client';
import { OrganizationEndpoints, AuthEndpoints } from './api/endpoints';
import { parseObjectResponse } from '@/utils/apiResponseParser';
import type { OrganizationCategory, SchoolType, SchoolCategoryBoard } from '@/enums/merchant.enum';
import type { MerchantI } from '@/interface/organization.interface';
import type { ActivityListResponse } from '@/interface/activity.interface';
import type { SessionListResponse } from '@/interface/session.interface';

/**
 * Organization Registration Request Interface
 * For dashboard registration (does not include examPortal or phoneNumber)
 */
export interface CreateOrganizationRequest {
  email: string;
  organizationName: string;
  organizationCategory: OrganizationCategory;
  schoolType?: SchoolType;
  schoolCategoryBoard?: SchoolCategoryBoard;
}

/**
 * Organization Registration Response Interface
 */
export interface CreateOrganizationResponse {
  success?: boolean;
  status?: boolean;
  message?: string;
  data?: MerchantI;
  email?: string;
  organizationName?: string;
  organizationCategory?: OrganizationCategory;
  schoolType?: SchoolType;
  schoolCategoryBoard?: SchoolCategoryBoard;
}

export interface GetOrganizationsParams {
  pageNumber?: number;
  pageSize?: number;
  organizationType?: 'group' | 'standalone';
  organizationCategory?: 'school' | 'other';
  schoolCategoryBoard?: string;
  kycDocumentStatus?: string;
  schoolType?: string;
  search?: string;
  bvnStatus?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface OrganizationListResponse {
  status?: string;
  data?: {
    page: number;
    pages: number;
    orgCount?: number;
    organizationCount?: number;
    organizations: MerchantI[];
  };
}

/**
 * Update Organization Request Interface
 * Fields that can be updated for an organization
 */
export interface UpdateOrganizationRequest {
  email?: string;
  organizationName?: string;
  phoneNumber?: string;
  organizationCategory?: OrganizationCategory;
  schoolType?: SchoolType;
  schoolCategoryBoard?: SchoolCategoryBoard;
  state?: string;
  lga?: string;
  address?: string;
  directors?: Array<{
    fullName: string;
    bvn: string;
    dob: string;
  }>;
}

export interface UpdateKycDocumentsRequest {
  cacForm2?: string | null;
  cacForm7?: string | null;
  utilityBill?: string | null;
  businessReg?: string | null;
  memorandum?: string | null;
  identityCard?: string | null;
  mandateLetter?: string | null;
  logo?: string | null;
  banner?: string | null;
}

/**
 * Update Organization Response Interface
 */
export interface UpdateOrganizationResponse {
  status?: string;
  message?: string;
  data?: MerchantI;
}

/**
 * Organization Service
 * Provides high-level organization management methods
 */
class OrganizationService {
  /**
   * Create a new organization from the dashboard
   * @param payload - Organization creation data
   * @returns Created organization data
   */
  async createOrganization(payload: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    const res = await RequestService.post<CreateOrganizationResponse>(
      OrganizationEndpoints.registerOrganizationFromDashboard,
      payload
    );
    
    // Parse response to extract organization data if nested
    const organization = parseObjectResponse<MerchantI>(res);
    
    if (organization) {
      return {
        success: true,
        status: true,
        message: 'Organization created successfully',
        data: organization,
      };
    }
    
    // If response already contains the expected structure
    if (res && typeof res === 'object') {
      return {
        success: res.success ?? res.status ?? true,
        status: res.status ?? res.success ?? true,
        message: res.message || 'Organization created successfully',
        data: res.data,
        ...res,
      };
    }
    
    throw new Error('Invalid response format');
  }

  /**
   * Get all organizations (Groups or Organizations)
   * @param params - Query parameters for filtering organizations
   * @returns List of organizations with pagination info
   */
  async getAllOrganizations(params?: GetOrganizationsParams): Promise<OrganizationListResponse> {
    const queryParams = new URLSearchParams();
    
    // Always include these parameters
    // Include empty values if not provided to match API expectations
    queryParams.append('pageNumber', (params?.pageNumber || 1).toString());
    
    if (params?.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    
    // Always include organizationCategory (empty if not provided)
    queryParams.append('organizationCategory', params?.organizationCategory?.trim() || '');
    
    // Always include these filter parameters (empty if not provided)
    queryParams.append('schoolCategoryBoard', params?.schoolCategoryBoard?.trim() || '');
    queryParams.append('kycDocumentStatus', params?.kycDocumentStatus?.trim() || '');
    queryParams.append('schoolType', params?.schoolType?.trim() || '');
    queryParams.append('search', params?.search?.trim() || '');
    queryParams.append('bvnStatus', params?.bvnStatus?.trim() || '');
    
    // Optional parameters (only include if provided)
    if (params?.organizationType && params.organizationType.trim()) {
      queryParams.append('organizationType', params.organizationType);
    }
    if (params?.sortBy && params.sortBy.trim()) {
      queryParams.append('sortBy', params.sortBy);
    }
    
    // Always include order (default to 'desc' if not provided)
    queryParams.append('order', params?.order || 'desc');

    const queryString = queryParams.toString();
    const url = `${OrganizationEndpoints.getAllOrganizations}?${queryString}`;

    const response = await RequestService.get<OrganizationListResponse>(url);
    return response;
  }

  /**
   * Update an organization (for portalAdmin editing any organization)
   * @param id - Organization ID
   * @param payload - Organization update data
   * @returns Updated organization data
   */
  async updateOrganization(
    id: string,
    payload: UpdateOrganizationRequest
  ): Promise<UpdateOrganizationResponse> {
    // Portal admin endpoint: /api/v2/org/admin/edit/${id}
    const response = await RequestService.patch<UpdateOrganizationResponse>(
      OrganizationEndpoints.updateOrganization(id),
      payload
    );
    
    // Parse response to extract organization data if nested
    const organization = parseObjectResponse<MerchantI>(response);
    
    if (organization) {
      return {
        status: response.status || 'success',
        message: response.message || 'Organization updated successfully',
        data: organization,
      };
    }
    
    // If response already contains the expected structure
    if (response && typeof response === 'object') {
      return {
        status: response.status || 'success',
        message: response.message || 'Organization updated successfully',
        data: response.data,
        ...response,
      };
    }
    
    throw new Error('Invalid response format');
  }

  /**
   * Update organization profile (for orgAdmin/groupAdmin editing their own organization)
   * @param id - Organization ID (not used in endpoint, kept for interface consistency)
   * @param payload - Organization update data
   * @returns Updated organization data
   */
    async updateOrganizationProfile(
      _id: string,
      payload: UpdateOrganizationRequest
    ): Promise<UpdateOrganizationResponse> {
    // Org admin endpoint: /api/v2/org/edit (no ID needed, uses auth context)
    const response = await RequestService.patch<UpdateOrganizationResponse>(
      OrganizationEndpoints.updateOrganizationProfile,
      payload
    );
    
    // Parse response to extract organization data if nested
    const organization = parseObjectResponse<MerchantI>(response);
    
    if (organization) {
      return {
        status: response.status || 'success',
        message: response.message || 'Organization updated successfully',
        data: organization,
      };
    }
    
    // If response already contains the expected structure
    if (response && typeof response === 'object') {
      return {
        status: response.status || 'success',
        message: response.message || 'Organization updated successfully',
        data: response.data,
        ...response,
      };
    }
    
    throw new Error('Invalid response format');
  }

  /**
   * Activate/Setup Organization Profile
   * @param payload - Activation data (state, lga, address, tinNumber, bankDetails)
   * @returns Updated organization data
   */
  async activateOrganization(payload: {
    state: string;
    lga: string;
    address: string;
    tinNumber: string;
    bankDetails: {
      accountNumber: string;
      bankCode: string;
    };
  }): Promise<UpdateOrganizationResponse> {
    const response = await RequestService.patch<UpdateOrganizationResponse>(
      OrganizationEndpoints.activateOrganization,
      payload
    );
    
    const organization = parseObjectResponse<MerchantI>(response);
    if (organization) {
      return {
        status: response.status || 'success',
        message: response.message || 'Organization activated successfully',
        data: organization,
      };
    }
    
    if (response && typeof response === 'object') {
      return {
        status: response.status || 'success',
        message: response.message || 'Organization activated successfully',
        data: response.data,
        ...response,
      };
    }
    
    throw new Error('Invalid response format');
  }

  /**
   * Add Other Bank Details
   * @param payload - Bank account details (accountNumber, bankCode)
   * @returns Response with bank details
   */
  async addBankDetails(payload: {
    accountNumber: string;
    bankCode: string;
  }): Promise<{ status?: string; message?: string; data?: { primaryBankDetails?: any; otherBankDetails?: any[] } }> {
    const response = await RequestService.patch<{ status?: string; message?: string; data?: { primaryBankDetails?: any; otherBankDetails?: any[] } }>(
      OrganizationEndpoints.addBankDetails,
      payload
    );
    return response;
  }

  /**
   * Assign organization to master account
   * @param orgId - Organization ID
   * @param payload - Organization assignment data (state, lga, address, tinNumber, bankDetails)
   * @returns Promise that resolves when assignment is complete
   */
  async assignOrgToMasterAccount(
    orgId: string,
    payload: {
      state: string;
      lga: string;
      address: string;
      tinNumber: string;
      bankDetails: {
        accountNumber: string;
        bankCode: string;
      };
    }
  ): Promise<void> {
    await RequestService.patch(
      AuthEndpoints.assignOrgToMasterAccount(orgId),
      payload
    );
  }

  /**
   * Delete an organization
   * @param id - Organization ID
   * @returns Response with success message
   */
  async deleteOrganization(id: string): Promise<{ success?: boolean; status?: boolean; message?: string }> {
    const response = await RequestService.delete<{ success?: boolean; status?: boolean; message?: string }>(
      OrganizationEndpoints.deleteOrganization(id),
      {}
    );
    return response;
  }

  /**
   * Update organization KYC documents
   * @param payload - Document URLs to persist
   * @returns Response status
   */
  async updateKycDocuments(
    payload: UpdateKycDocumentsRequest
  ): Promise<{ status?: string; message?: string; data?: MerchantI }> {
    const response = await RequestService.patch<{ status?: string; message?: string; data?: MerchantI }>(
      OrganizationEndpoints.updateKycDocuments,
      payload
    );
    return response;
  }

  /**
   * Get organization profile
   * @returns Organization profile data
   */
  async getOrganizationProfile(): Promise<{ status?: string; data?: MerchantI }> {
    const response = await RequestService.get<{ status?: string; data?: MerchantI }>(
      OrganizationEndpoints.getOrganizationProfile
    );
    return response;
  }

  /**
   * Get activity logs
   * @param params - Query parameters (pageNumber, search)
   * @returns Activity logs response
   */
  async getActivity(params?: { pageNumber?: number; search?: string }): Promise<ActivityListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.pageNumber) {
      queryParams.append('pageNumber', params.pageNumber.toString());
    }
    
    if (params?.search) {
      queryParams.append('search', params.search.trim());
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${OrganizationEndpoints.getActivity}?${queryString}` : OrganizationEndpoints.getActivity;
    
    const response = await RequestService.get<ActivityListResponse>(url);
    
    return response;
  }

  /**
   * Get all sessions
   * @returns Sessions list response
   */
  async getAllSessions(): Promise<SessionListResponse> {
    const response = await RequestService.get<SessionListResponse>(OrganizationEndpoints.getAllSessions);
    return response;
  }

  /**
   * Start a session
   * @param id - Session ID
   * @returns Updated session response
   */
  async startSession(id: string): Promise<{ status: string; message?: string; data?: any }> {
    const response = await RequestService.post<{ status: string; message?: string; data?: any }>(
      OrganizationEndpoints.startSession(id),
      {}
    );
    return response;
  }

}

export default new OrganizationService();

