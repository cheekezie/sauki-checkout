import { RequestService } from './api/client';
import { ClassEndpoints } from './api/endpoints';
import type {
  ClassListResponse,
  ClassResponse,
  SubClassListResponse,
  SubClassResponse,
  CreateSubClassRequest,
  UpdateSubClassRequest,
  UpdateClassRequest,
  AssignSubClassRequest,
  UnassignSubClassRequest,
  AssignSubClassResponse,
} from '@/interface/class.interface';

/**
 * Class Service
 * Provides high-level class and subclass management methods
 */
class ClassService {
  /**
   * Get all classes
   * @param filteredByOrg - Organization ID to filter by (optional, for portal admins)
   * @param excludeSubClasses - If true, attempts to exclude subclasses from response (may help if backend has model issues)
   * @returns List of classes with count
   */
  async getAllClasses(filteredByOrg?: string, excludeSubClasses?: boolean): Promise<ClassListResponse> {
    const queryParams = new URLSearchParams();
    
    // Add organization filter if provided
    if (filteredByOrg) {
      queryParams.append("filteredByOrg", filteredByOrg);
    }
    
    // Add query parameters to exclude subclasses if backend supports it
    if (excludeSubClasses) {
      queryParams.append("populate", "false");
      queryParams.append("includeSubClasses", "false");
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${ClassEndpoints.getAllClasses}?${queryString}` : ClassEndpoints.getAllClasses;

    const res = await RequestService.get<ClassListResponse>(url);

    if (res && typeof res === "object" && "data" in res) {
      return res as ClassListResponse;
    }

    throw new Error("Invalid class list response");
  }

  /**
   * Export classes to file (CSV/Excel)
   * @param params - Query parameters (filteredByOrg)
   * @returns Blob file for download
   * @note Currently returns JSON data as the endpoint doesn't support file export format
   */
  async exportClasses(params?: {
    filteredByOrg?: string;
  }): Promise<Blob> {
    // For now, get JSON data and convert to CSV/Excel on client side
    // TODO: Update when backend supports file export format
    const response = await this.getAllClasses(params?.filteredByOrg);
    
    // Convert JSON to CSV format
    const classes = response.data.classes;
    if (classes.length === 0) {
      throw new Error('No classes to export');
    }
    
    // Create CSV headers
    const headers = ['Name', 'Code', 'Type', 'Organization'];
    const csvRows = [headers.join(',')];
    
    // Add data rows
    classes.forEach((cls) => {
      const row = [
        cls.name || '',
        cls.code?.toString() || '',
        cls.type || '',
        cls.organization || '',
      ];
      csvRows.push(row.map((cell) => `"${cell}"`).join(','));
    });
    
    // Convert to Blob
    const csvContent = csvRows.join('\n');
    return new Blob([csvContent], { type: 'text/csv' });
  }

  /**
   * Update a class
   * @param id - Class ID
   * @param payload - Class update data
   * @returns Updated class data
   */
  async updateClass(id: string, payload: UpdateClassRequest): Promise<ClassResponse> {
    const res = await RequestService.put<ClassResponse>(
      ClassEndpoints.updateClass(id),
      payload
    );
    
    return res;
  }

  /**
   * Create a new subclass
   * @param payload - Subclass creation data
   * @returns Created subclass data
   */
  async createSubClass(payload: CreateSubClassRequest): Promise<SubClassResponse> {
    const res = await RequestService.post<SubClassResponse>(
      ClassEndpoints.createSubClass,
      payload
    );
    
    return res;
  }

  /**
   * Get all subclasses
   * @param filteredByOrg - Organization ID to filter by
   * @returns List of subclasses with count
   */
  async getAllSubClasses(filteredByOrg?: string): Promise<SubClassListResponse> {
    const queryParams = new URLSearchParams();
    if (filteredByOrg) {
      queryParams.append('filteredByOrg', filteredByOrg);
    }

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${ClassEndpoints.getAllSubClasses}?${queryString}` 
      : ClassEndpoints.getAllSubClasses;

    const res = await RequestService.get<SubClassListResponse>(url);
    
    if (res && typeof res === 'object' && 'data' in res) {
      return res as SubClassListResponse;
    }
    
    throw new Error('Invalid subclass list response');
  }

  /**
   * Get assigned subclasses for a class
   * @param classId - Class ID
   * @returns List of assigned subclasses
   */
  async getAssignedSubClasses(classId: string): Promise<SubClassListResponse> {
    const res = await RequestService.get<SubClassListResponse>(
      ClassEndpoints.getAssignedSubClasses(classId)
    );
    
    if (res && typeof res === 'object' && 'data' in res) {
      return res as SubClassListResponse;
    }
    
    throw new Error('Invalid assigned subclass list response');
  }

  /**
   * Update a subclass
   * @param id - Subclass ID
   * @param payload - Subclass update data
   * @returns Update response
   */
  async updateSubClass(
    id: string,
    payload: UpdateSubClassRequest
  ): Promise<{ status: string; message: string }> {
    const res = await RequestService.put<{ status: string; message: string }>(
      ClassEndpoints.updateSubClass(id),
      payload
    );
    
    return res;
  }

  /**
   * Assign subclass to classes
   * @param payload - Assignment data
   * @returns Assignment response with summary
   */
  async assignSubClass(payload: AssignSubClassRequest): Promise<AssignSubClassResponse> {
    const res = await RequestService.patch<AssignSubClassResponse>(
      ClassEndpoints.assignSubClass,
      payload
    );
    
    return res;
  }

  /**
   * Unassign subclass from a class
   * @param payload - Unassignment data
   * @returns Unassignment response
   */
  async unassignSubClass(payload: UnassignSubClassRequest): Promise<{ status: string; message?: string }> {
    const res = await RequestService.patch<{ status: string; message?: string }>(
      ClassEndpoints.unassignSubClass,
      payload
    );
    
    return res || { status: 'success' };
  }

  /**
   * Delete a subclass
   * @param id - Subclass ID
   * @returns Delete response
   */
  async deleteSubClass(id: string): Promise<{ status?: string; message?: string }> {
    const res = await RequestService.delete<{ status?: string; message?: string }>(
      ClassEndpoints.deleteSubClass(id),
      {}
    );

    return res || { status: 'success' };
  }
}

export default new ClassService();

