import { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AuthService from "../services/auth.service";
import { logger } from "../services/logger.service";
import { setGlobalAuthErrorHandler } from "../services/api/client";
import { useToast } from "../hooks/useToast";
import type { MerchantI as School } from "../interface";
import type { User } from "../interface/user.interface";
import type {
  AuthContextType,
  AuthProviderProps,
  AuthState,
} from "../interface/auth.interface";
import { AuthContext } from "./authContext";

type AuthAction =
  | { type: "LOGIN_START" }
  | {
      type: "LOGIN_SUCCESS";
      payload: { user: User; schools: School[]; token: string };
    }
  | {
      type: "LOGIN_TEMP_SUCCESS";
      payload: { schools: School[]; tempToken: string };
    }
  | {
      type: "SCHOOL_SELECTED";
      payload: { user: User; selectedSchool: School; token: string };
    }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  schools: [],
  selectedSchool: null,
  tempToken: null,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        schools: action.payload.schools,
        selectedSchool: action.payload.schools[0] || null,
        tempToken: null,
        error: null,
      };

    case "LOGIN_TEMP_SUCCESS":
      return {
        ...state,
        isLoading: false,
        schools: action.payload.schools,
        tempToken: action.payload.tempToken,
        error: null,
      };

    case "SCHOOL_SELECTED":
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        selectedSchool: action.payload.selectedSchool,
        tempToken: null,
        error: null,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        tempToken: null,
      };

    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  // Set up global authentication error handler
  useEffect(() => {
    let isProcessing = false; // Local flag to prevent multiple simultaneous calls
    let hasShownToast = false; // Flag to prevent showing toast multiple times

    const handleAuthError = async (errorMessage?: string) => {
      // Prevent multiple simultaneous calls
      if (isProcessing) {
        logger.warn('Auth error handler already processing, skipping');
        return;
      }

      // Check if we're already on login page - if so, don't show toast again
      const currentPath = window.location.pathname;
      if (currentPath === '/login' || currentPath === '/') {
        logger.warn('Already on login page, skipping auth error handler');
        return;
      }

      isProcessing = true;
      try {
        logger.warn('Authentication error detected, logging out user', { message: errorMessage });
        
        // Call logout without showing logout toast (we'll show session expired toast instead)
        await AuthService.logout();
        dispatch({ type: "LOGOUT" });
        
        // Only show toast once with API message (don't show logout success toast)
        if (!hasShownToast) {
          hasShownToast = true;
          const toastMessage = errorMessage || "Your session has expired. Please log in again.";
          showError("Session Expired", toastMessage);
        }
        
        // Navigate to login immediately
        navigate("/login", { replace: true });
        
        // Reset flags after a delay
        setTimeout(() => {
          isProcessing = false;
          hasShownToast = false;
        }, 1000);
      } catch (error) {
        logger.warn("Logout API call failed during auth error, logging out locally", error);
        dispatch({ type: "LOGOUT" });
        
        // Only show toast once with API message (don't show logout success toast)
        if (!hasShownToast) {
          hasShownToast = true;
          const toastMessage = errorMessage || "Your session has expired. Please log in again.";
          showError("Session Expired", toastMessage);
        }
        
        // Navigate to login immediately
        navigate("/login", { replace: true });
        
        // Reset flags after a delay
        setTimeout(() => {
          isProcessing = false;
          hasShownToast = false;
        }, 1000);
      }
    };

    setGlobalAuthErrorHandler(handleAuthError);

    // Cleanup on unmount
    return () => {
      setGlobalAuthErrorHandler(() => {});
    };
  }, [navigate, showError]);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const token = AuthService.getToken();
        if (token && AuthService.isAuthenticated()) {
          try {
            // Decode and validate JWT token
            const decoded: any = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            
            // Check if token is expired
            if (decoded.exp && decoded.exp < currentTime) {
              logger.warn('Token expired, logging out');
              AuthService.logout();
              dispatch({ type: "SET_LOADING", payload: false });
              return;
            }

            // Extract user data from token
            const user: User = decoded.admin || decoded.user || {};
            const schools: School[] = decoded.orgs || [];

            // Check if account is disabled
            if (user.disabled === true) {
              logger.warn('Account is disabled, logging out', { userId: user._id || user.id });
              AuthService.logout();
              dispatch({ type: "SET_LOADING", payload: false });
              return;
            }

            // Restore session from validated token
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                user,
                schools,
                token,
              },
            });
            logger.info('Session restored from token', { userId: user._id || user.id });
          } catch (decodeError) {
            logger.error('Failed to decode token', decodeError);
            AuthService.logout();
          }
        }
      } catch (error) {
        logger.authError('checkAuth', error);
        AuthService.logout();
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (phoneNumber: string, password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      logger.userAction('Login attempt', { phoneNumber: phoneNumber.substring(0, 4) + '****' });
      const response = await AuthService.login(phoneNumber, password);

      if (response.tempToken && response.orgs) {
        // Multi-school user - show school selection
        logger.info('Multi-school user login, showing school selection');
        dispatch({
          type: "LOGIN_TEMP_SUCCESS",
          payload: {
            schools: response.orgs,
            tempToken: response.tempToken,
          },
        });
        navigate("/school-selection");
      } else if (response.token) {
        // Single school user - direct login
        const user: User = response.user || ({} as User);
        
        // Check if account is disabled
        if (user.disabled === true) {
          logger.warn('Account is disabled, login blocked', { userId: user._id || user.id });
          dispatch({
            type: "LOGIN_FAILURE",
            payload: "Your account has been disabled. Please contact support.",
          });
          throw new Error("Account disabled");
        }
        
        logger.userAction('Login successful', { userId: user._id || user.id });
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user,
            schools: response.orgs || [],
            token: response.token,
          },
        });
        navigate("/dashboard");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error: any) {
      logger.authError('Login', error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Login failed",
      });
      throw error; // Re-throw so Login page can catch and show toast
    }
  };

  // Select school for multi-school users
  const selectSchool = async (orgId: string) => {
    if (!state.tempToken) {
      throw new Error("No temporary token available");
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      logger.userAction('Selecting school', { orgId });
      const response = await AuthService.selectSchool(state.tempToken, orgId);

      // Log the response to inspect logo field
      logger.debug("School Selection API Response", {
        responseUser: response.user,
        responseOrgs: response.orgs,
        logoFields: response.orgs?.map((org: any) => ({
          _id: org._id,
          organizationName: org.organizationName,
          logo: org.logo,
        })),
      });

      if (response.token) {
        const user: User = response.user || ({} as User);
        
        // Check if account is disabled
        if (user.disabled === true) {
          logger.warn('Account is disabled, school selection blocked', { userId: user._id || user.id });
          dispatch({
            type: "LOGIN_FAILURE",
            payload: "Your account has been disabled. Please contact support.",
          });
          dispatch({ type: "SET_LOADING", payload: false });
          throw new Error("Account disabled");
        }
        
        const selectedSchool = state.schools.find(
          (school) => school._id === orgId
        );
        if (!selectedSchool) {
          throw new Error("Selected school not found");
        }

        dispatch({
          type: "SCHOOL_SELECTED",
          payload: {
            user,
            selectedSchool,
            token: response.token,
          },
        });
        navigate("/dashboard");
      } else {
        throw new Error("School selection failed");
      }
    } catch (error: any) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "School selection failed",
      });
    }
  };

  // Logout function
  const logout = async (showLogoutToast: boolean = true) => {
    try {
      logger.userAction('Logout');
      await AuthService.logout();
      dispatch({ type: "LOGOUT" });
      
      // Show success toast only for manual logout (not from error handler)
      if (showLogoutToast) {
        showSuccess("Logged Out", "You have been successfully logged out.");
      }
      
      navigate("/login");
    } catch (error) {
      logger.warn("Logout API call failed, logging out locally", error);
      // Still logout locally even if API call fails
      dispatch({ type: "LOGOUT" });
      
      // Show success toast only for manual logout (not from error handler)
      if (showLogoutToast) {
        showSuccess("Logged Out", "You have been successfully logged out.");
      }
      
      navigate("/login");
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Register school
  const registerSchool = async (data: any) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await AuthService.registerSchool(data);
      dispatch({ type: "SET_LOADING", payload: false });
      // Navigate to phone verification instead of login
      navigate("/phone-verification", {
        state: {
          phoneNumber: data.contactPhone,
          registrationData: data,
        },
      });
    } catch (error: any) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Registration failed",
      });
      throw error; // Re-throw so RegisterSchool can catch and show toast
    }
  };

  // Verify email
  const verifyEmail = async (email: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await AuthService.verifyEmail({ email });
      dispatch({ type: "SET_LOADING", payload: false });
      // Return success response - let component handle modal
      return { success: true };
    } catch (error: any) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Email verification failed",
      });
      throw error;
    }
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await AuthService.forgotPassword(email);
      dispatch({ type: "SET_LOADING", payload: false });
      // Return success response - let component handle modal
      return { success: true };
    } catch (error: any) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Password reset request failed",
      });
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (token: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await AuthService.resetPassword(token, password);
      dispatch({ type: "SET_LOADING", payload: false });
      // Return success response - let component handle modal
      return { success: true };
    } catch (error: any) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Password reset failed",
      });
      throw error;
    }
  };

  // Send Admin OTP
  const sendAdminOTP = async (phoneNumber: string, pin: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await AuthService.sendAdminOTP(phoneNumber, pin);
      logger.info("Admin OTP sent successfully");
      dispatch({ type: "SET_LOADING", payload: false });
      return response;
    } catch (error: any) {
      logger.authError("Send Admin OTP", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Failed to send OTP",
      });
      throw error;
    }
  };

  // Verify Admin OTP
  const verifyAdminOTP = async (phoneNumber: string, confirmCode: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await AuthService.verifyAdminOTP(
        phoneNumber,
        confirmCode
      );
      logger.info("Admin OTP verified successfully");
      dispatch({ type: "SET_LOADING", payload: false });
      return response;
    } catch (error: any) {
      logger.authError("Verify Admin OTP", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "OTP verification failed",
      });
      throw error;
    }
  };

  // Verify portal ID
  const verifyPortalId = async (portalId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await AuthService.verifyPortalId(portalId);
      dispatch({ type: "SET_LOADING", payload: false });
      return response;
    } catch (error: any) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Portal ID verification failed",
      });
      throw error;
    }
  };

  // Verify phone number
  const verifyPhone = async (phoneNumber: string, otp: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await AuthService.verifyPhone(phoneNumber, otp);
      logger.info("Phone verification successful");
      dispatch({ type: "SET_LOADING", payload: false });
      return response;
    } catch (error: any) {
      logger.authError("Phone Verification", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Phone verification failed",
      });
      throw error;
    }
  };

  // Resend phone OTP
  const resendPhoneOTP = async (phoneNumber: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await AuthService.resendPhoneOTP(phoneNumber);
      logger.info("Phone OTP resent successfully");
      dispatch({ type: "SET_LOADING", payload: false });
      return response;
    } catch (error: any) {
      logger.authError("Resend Phone OTP", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Failed to resend OTP",
      });
      throw error;
    }
  };

  // Set pass PIN
  const setPassPin = async (phoneNumber: string, pin: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await AuthService.setPassPin(phoneNumber, pin);
      logger.userAction("PIN set successfully");
      dispatch({ type: "SET_LOADING", payload: false });
      return response;
    } catch (error: any) {
      logger.authError("Set Pass PIN", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Failed to set PIN",
      });
      throw error;
    }
  };

  // Forget PIN
  const forgetPin = async (phoneNumber: string) => {
    logger.userAction("Forget PIN request", { phoneNumber: phoneNumber.substring(0, 4) + '****' });
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await AuthService.forgetPin(phoneNumber);
      logger.info("Forget PIN request processed successfully");
      dispatch({ type: "SET_LOADING", payload: false });
      return response;
    } catch (error: any) {
      logger.authError("Forget PIN", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Failed to process forget PIN request",
      });
      throw error;
    }
  };

  // Reset PIN
  const resetPin = async (
    phoneNumber: string,
    resetCode: string,
    newPin: string
  ) => {
    logger.userAction("Reset PIN request", {
      phoneNumber: phoneNumber.substring(0, 4) + '****',
      newPinLength: newPin.length,
    });
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await AuthService.resetPin(
        phoneNumber,
        resetCode,
        newPin
      );
      logger.info("PIN reset successfully");
      dispatch({ type: "SET_LOADING", payload: false });

      // Return success response - let component handle modal
      return { success: true, data: response };
    } catch (error: any) {
      logger.authError("Reset PIN", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Failed to reset PIN",
      });
      throw error;
    }
  };

  // Switch organization (for already authenticated users)
  const switchOrganization = async (orgId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      logger.userAction('Switching organization', { orgId });
      
      const response = await AuthService.switchOrganization(orgId);
      
      if (response.token) {
        // New token received - decode and update state
        const decoded: any = jwtDecode(response.token);
        const user: User = decoded.admin || decoded.user || {};
        const schools: School[] = decoded.orgs || response.orgs || [];
        
        // Check if account is disabled
        if (user.disabled === true) {
          logger.warn('Account is disabled, organization switch blocked', { userId: user._id || user.id });
          dispatch({
            type: "LOGIN_FAILURE",
            payload: "Your account has been disabled. Please contact support.",
          });
          throw new Error("Account disabled");
        }
        
        // Find the selected school
        const selectedSchool = schools.find((school) => school._id === orgId) || schools[0];
        
        // Update auth state with new token and user data
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: response.user || user,
            schools: schools,
            token: response.token,
          },
        });
        
        logger.info('Organization switched successfully with new token', { 
          orgId, 
          orgName: selectedSchool?.organizationName 
        });
        
        return { success: true, selectedSchool };
      } else {
        // No token in response, but switch might still have succeeded
        // Check if switch was successful based on status/message
        const responseAny = response as any;
        const isSuccess = 
          responseAny.status === 'success' || 
          responseAny.message === 'Account switched successfully';
        
        if (isSuccess) {
          // Switch succeeded on backend - use current token
          // The token is still valid, backend has just switched the organization context
          const currentToken = AuthService.getToken();
          
          if (!currentToken) {
            throw new Error('No token available - please login again');
          }
          
          try {
            // Decode current token to get user data
            const decoded: any = jwtDecode(currentToken);
            const user: User = decoded.admin || decoded.user || {};
            const schools: School[] = decoded.orgs || [];
            
            // Check if account is disabled
            if (user.disabled === true) {
              logger.warn('Account is disabled, organization switch blocked', { userId: user._id || user.id });
              dispatch({
                type: "LOGIN_FAILURE",
                payload: "Your account has been disabled. Please contact support.",
              });
              throw new Error("Account disabled");
            }
            
            // Find the selected school from organizations
            const selectedSchool = schools.find((school) => school._id === orgId) || schools[0];
            
            // Update auth state with current token
            // The backend has already switched the org context for this token
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                user: response.user || user,
                schools: schools.length > 0 ? schools : (response.orgs || []),
                token: currentToken,
              },
            });
            
            logger.info('Organization switched successfully (using current token)', { 
              orgId, 
              orgName: selectedSchool?.organizationName || 'Unknown',
              tokenStillValid: true,
            });
            
            return { success: true, selectedSchool };
          } catch (decodeError) {
            logger.error('Failed to decode current token after switch', decodeError);
            throw new Error('Failed to refresh authentication after organization switch');
          }
        } else {
          // Switch didn't succeed
          throw new Error('Organization switch failed: ' + (responseAny.message || 'Unknown error'));
        }
      }
    } catch (error: any) {
      logger.authError('Switch organization', error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Failed to switch organization",
      });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const value: AuthContextType = {
    state,
    login,
    selectSchool,
    switchOrganization,
    logout,
    clearError,
    registerSchool,
    verifyEmail,
    forgotPassword,
    resetPassword,
    sendAdminOTP,
    verifyAdminOTP,
    verifyPortalId,
    verifyPhone,
    resendPhoneOTP,
    setPassPin,
    forgetPin,
    resetPin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
