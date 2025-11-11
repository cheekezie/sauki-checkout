import { RequestService } from './api/client';
import { AuthEndpoints } from './api/endpoints';

export interface CreateAdminRequest {
  email: string;
  fullName: string;
  phoneNumber: string;
  gender: 'male' | 'female';
  role: string;
  // Permissions are handled by backend based on role
  permissions?: Record<string, { read: boolean; write: boolean }>;
}

export interface CreateAdminResponse {
  message?: string;
  status?: string;
  data?: any;
}

export interface GetAdminsParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  filterByRole?: string;
}

export interface GetAdminsResponse {
  status?: string;
  data?: {
    page: number;
    pages: number;
    staffCount: number;
    staffs: Array<{
      _id: string;
      fullName?: string;
      email: string;
      phoneNumber: string;
      role: string;
      gender?: 'male' | 'female';
      permissions?: Record<string, { read: boolean; write: boolean }>;
      lastLogin?: string;
      createdAt?: string;
      updatedAt?: string;
      [key: string]: any;
    }>;
  };
}

export interface AddAdminToOrgRequest {
  phoneNumber: string;
  organizationId: string;
}

export interface AddAdminToOrgResponse {
  message?: string;
  status?: string;
  data?: any;
}

export interface UpdateAdminRequest {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  gender?: 'male' | 'female';
  role?: string;
}

export interface UpdateAdminResponse {
  message?: string;
  status?: string;
  data?: any;
}

export interface DeleteAdminResponse {
  message?: string;
  status?: string;
  data?: any;
}

/**
 * Admin Service
 * Provides high-level admin/staff management methods
 */
class AdminService {
  /**
   * Create a new admin/staff member
   * @param payload - Admin creation data
   * @returns Created admin data with response message
   */
  async createAdmin(payload: CreateAdminRequest): Promise<CreateAdminResponse> {
    const response = await RequestService.post<CreateAdminResponse>(
      AuthEndpoints.createAdmin,
      payload
    );
    return response;
  }

  /**
   * Get list of admins/staff members
   * @param params - Query parameters (pageNumber, pageSize, search, filterByRole)
   * @returns List of admins with pagination info
   */
  async getAdmins(params?: GetAdminsParams): Promise<GetAdminsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.filterByRole) queryParams.append('filterByRole', params.filterByRole);

    const queryString = queryParams.toString();
    const url = queryString ? `${AuthEndpoints.getAdmins}?${queryString}` : AuthEndpoints.getAdmins;

    const response = await RequestService.get<GetAdminsResponse>(url);
    return response;
  }

  /**
   * Add an existing admin to an organization
   * @param payload - Admin phone number and organization ID
   * @returns Response with success message
   */
  async addAdminToOrg(payload: AddAdminToOrgRequest): Promise<AddAdminToOrgResponse> {
    const response = await RequestService.patch<AddAdminToOrgResponse>(
      AuthEndpoints.addAdminToOrg,
      payload
    );
    return response;
  }

  /**
   * Update an existing admin/staff member
   * @param id - Admin ID
   * @param payload - Admin update data (partial)
   * @returns Updated admin data with response message
   */
  async updateAdmin(id: string, payload: UpdateAdminRequest): Promise<UpdateAdminResponse> {
    const response = await RequestService.put<UpdateAdminResponse>(
      AuthEndpoints.updateAdmin(id),
      payload
    );
    return response;
  }

  /**
   * Delete an admin/staff member
   * @param id - Admin ID
   * @returns Response with success message
   */
  async deleteAdmin(id: string): Promise<DeleteAdminResponse> {
    const response = await RequestService.delete<DeleteAdminResponse>(
      AuthEndpoints.deleteAdmin(id),
      {}
    );
    return response;
  }
}

export default new AdminService();

