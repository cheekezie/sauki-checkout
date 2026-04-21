/**
 * API Type Definitions
 * Comprehensive TypeScript interfaces for all API request/response types
 */

// ============================================================================
// Common Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  status: 'success' | 'error';
  message: string;
  data: T;
  error?: string;
}

export type ApiSuccessResponse<T = any> = ApiResponse<T> & {
  success: true;
  status: 'success';
};
export type ApiErrorResponse = ApiResponse<never> & {
  success: false;
  status: 'error';
};

// Additional API response formats (from api.interface.ts)
export interface ApiDataResI<T = any> {
  status: string;
  message: string;
  responseCode: number;
  code: number;
  data: T;
}

export interface LoginResponse {
  status: string;
  data: {
    user?: any;
    businesses?: any[];
  };
}

// ============================================================================
// Authentication & Merchant Management
// ============================================================================

/**
 * Merchant Signup Request
 */
export interface MerchantSignupRequest {
  // Personal Information
  fullName: string;
  email: string;
  password: string;
  gender?: string;
  phoneNumber: string;

  // Business Information
  businessType: 'government' | 'individual' | 'corporate' | 'ngo';
  businessCategory: string;
  businessEmail: string;
  businessPhoneNumber: string;
  businessShortName: string;
  businessName: string;
  businessLogo?: string;
  businessAddress?: string;
  state?: string;
  country?: string;
  businessCurrency?: string;
}

/**
 * Encrypted Signup Request
 */
export interface EncryptedSignupRequest {
  data: string; // Encrypted JSON string
}

/**
 * Merchant Signup Response
 */
export interface MerchantSignupResponse extends ApiSuccessResponse {
  message: string;
}

/**
 * Merchant Login Step One Request (Encrypted)
 */
export interface MerchantLoginStepOneRequest {
  data: string; // Encrypted JSON string containing email and password
}

/**
 * Merchant Login Step One Response
 */
export interface MerchantLoginStepOneResponse extends ApiSuccessResponse {
  data: {
    businesses: Array<{
      business: {
        _id: string;
        businessCode: string;
        businessName: string;
      };
      role: string;
      _id: string;
    }>;
  };
}

/**
 * Merchant Login Step Two Request (Encrypted)
 */
export interface MerchantLoginStepTwoRequest {
  data: string; // Encrypted JSON string containing email, businessId, and otp
}

/**
 * Merchant Login Step Two Response
 */
export interface MerchantLoginStepTwoResponse extends ApiSuccessResponse {
  data: {
    data: string; // Encrypted session data
  };
}

/**
 * Merchant Verify Account Request (Encrypted)
 */
export interface MerchantVerifyAccountRequest {
  data: string; // Encrypted JSON string containing email and otp
}

/**
 * Merchant Verify Account Response
 */
export interface MerchantVerifyAccountResponse extends ApiSuccessResponse {
  message: string;
}

/**
 * Merchant Resend OTP Request (Encrypted)
 */
export interface MerchantResendOTPRequest {
  data: string; // Encrypted JSON string containing email
}

/**
 * Merchant Resend OTP Response
 */
export interface MerchantResendOTPResponse extends ApiSuccessResponse {
  message: string;
}

/**
 * Merchant Profile Response
 */
export interface MerchantProfileResponse extends ApiSuccessResponse {
  data: {
    merchant: any;
    admin: any;
    roles?: string[];
    permissions?: string[];
  };
}

/**
 * Merchant Permissions Response
 */
export interface MerchantPermissionsResponse extends ApiSuccessResponse {
  data: {
    permissions?: string[];
    roles?: string[];
    [key: string]: any;
  };
}

/**
 * Merchant Logout Response
 */
export interface MerchantLogoutResponse extends ApiSuccessResponse {
  message: string;
}

/**
 * Password Reset Request Request
 */
export interface RequestPasswordResetRequest {
  email: string;
}

/**
 * Password Reset Request Response
 */
export interface RequestPasswordResetResponse extends ApiSuccessResponse {
  message: string;
}

/**
 * Password Reset Request (Encrypted)
 */
export interface ResetPasswordRequest {
  data: string; // Encrypted JSON string containing email, newPassword, and otp
}

/**
 * Password Reset Response
 */
export interface ResetPasswordResponse extends ApiSuccessResponse {
  message: string;
}

/**
 * Update Merchant Team Request (Encrypted)
 */
export interface UpdateMerchantTeamRequest {
  data: string; // Encrypted JSON string containing merchant team update payload
}

/**
 * Update Merchant Team Response
 */
export interface UpdateMerchantTeamResponse extends ApiSuccessResponse {
  message: string;
}

// ============================================================================
// Business Management
// ============================================================================

/**
 * Business Profile Response
 */
export interface BusinessProfileResponse extends ApiSuccessResponse {
  data: {
    business: any;
    [key: string]: any;
  };
}

/**
 * Switch Business Mode Request (Encrypted)
 */
export interface SwitchBusinessModeRequest {
  data: string; // Encrypted JSON string containing mode and businessId
}

/**
 * Switch Business Mode Response
 */
export interface SwitchBusinessModeResponse extends ApiSuccessResponse {
  data: any;
}

// ============================================================================
// KYC (Know Your Customer)
// ============================================================================

/**
 * Business Info KYC Request (Encrypted)
 */
export interface BusinessInfoKYCRequest {
  data: string; // Encrypted JSON string containing business KYC info
}

/**
 * Business Info KYC Response
 */
export interface BusinessInfoKYCResponse extends ApiSuccessResponse {
  data: any;
}

/**
 * Directors Info KYC Request (Encrypted)
 */
export interface DirectorsInfoKYCRequest {
  data: string; // Encrypted JSON string containing directors array
}

/**
 * Directors Info KYC Response
 */
export interface DirectorsInfoKYCResponse extends ApiSuccessResponse {
  data: any;
}

/**
 * Corporate Doc Info KYC Request (Encrypted)
 */
export interface CorporateDocInfoKYCRequest {
  data: string; // Encrypted JSON string containing corporate documents
}

/**
 * Corporate Doc Info KYC Response
 */
export interface CorporateDocInfoKYCResponse extends ApiSuccessResponse {
  data: any;
}

/**
 * Bank Details Info KYC Request (Encrypted)
 */
export interface BankDetailsInfoKYCRequest {
  data: string; // Encrypted JSON string containing bank details
}

/**
 * Bank Details Info KYC Response
 */
export interface BankDetailsInfoKYCResponse extends ApiSuccessResponse {
  data: any;
}

/**
 * Get Business KYC Response
 */
export interface GetBusinessKYCResponse extends ApiSuccessResponse {
  data: {
    kyc: any;
    [key: string]: any;
  };
}

// ============================================================================
// Role Management
// ============================================================================

/**
 * Create Role Request (Encrypted)
 */
export interface CreateRoleRequest {
  data: string; // Encrypted JSON string containing role details and access configuration
}

/**
 * Create Role Response
 */
export interface CreateRoleResponse extends ApiSuccessResponse {
  data: {
    role: any;
    [key: string]: any;
  };
}

/**
 * Role Interface
 */
export interface Role {
  _id: string;
  roleName: string;
  roleDescription: string;
  accessConfiguration?: {
    [key: string]: {
      write: boolean;
      read: boolean;
    };
  };
  permissions?: {
    [key: string]: {
      write?: boolean;
      read?: boolean;
    };
  };
  status?: 'active' | 'suspended';
  suspendRole?: boolean; // API returns suspendRole: true/false
  createdAt?: string;
  updatedAt?: string;
  business?: string;
  __v?: number;
}

/**
 * GetAll Roles Response
 */
export interface GetAllRolesResponse extends ApiSuccessResponse {
  data: {
    roles: Role[];
    [key: string]: any;
  };
}

/**
 * Suspend/Activate Role Request (Encrypted)
 */
export interface SuspendActivateRoleRequest {
  data: string; // Encrypted JSON string containing roleId and action
}

/**
 * Suspend/Activate Role Response
 */
export interface SuspendActivateRoleResponse extends ApiSuccessResponse {
  message: string;
}

// ============================================================================
// Merchant Team Management
// ============================================================================

/**
 * Add Merchant Team Request (Encrypted)
 */
export interface AddMerchantTeamRequest {
  data: string; // Encrypted JSON string containing team member details
}

/**
 * Add Merchant Team Response
 */
export interface AddMerchantTeamResponse extends ApiSuccessResponse {
  data: {
    merchant: any;
    [key: string]: any;
  };
}

/**
 * Merchant Team Member Interface
 */
export interface MerchantTeamMember {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender?: string;
  role: string;
  status?: 'active' | 'inactive' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Get Merchant Team List Response
 */
export interface GetMerchantTeamListResponse extends ApiSuccessResponse {
  data: {
    team: MerchantTeamMember[];
    [key: string]: any;
  };
}

/**
 * Get Merchant Details Response
 */
export interface GetMerchantDetailsResponse extends ApiSuccessResponse {
  data: {
    merchant: MerchantTeamMember;
    [key: string]: any;
  };
}

// ============================================================================
// File Upload
// ============================================================================

/**
 * Uploaded File Interface
 */
export interface UploadedFile {
  url: string;
  publicId: string;
  name: string;
  mimeType: string;
  fileSize: number;
  fileFormat?: string;
}

/**
 * File Upload Response
 */
export interface FileUploadResponse extends ApiSuccessResponse {
  data: UploadedFile[];
}

// ============================================================================
// Common Request Patterns
// ============================================================================

/**
 * Pagination Parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Query Parameters
 */
export interface QueryParams extends PaginationParams {
  [key: string]: any;
}

/**
 * Path Parameters
 */
export interface PathParams {
  [key: string]: string;
}

export interface PaginationI {

  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

}