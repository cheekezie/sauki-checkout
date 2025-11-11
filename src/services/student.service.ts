import { RequestService } from './api/client';
import { StudentEndpoints } from './api/endpoints';
import { parseArrayResponse, parseObjectResponse } from '@/utils/apiResponseParser';
import type { StudentType, StudentListResponse, StudentResponse } from '@/interface/student.interface';

/**
 * Student Service
 * Provides high-level student management methods that wrap the RequestService
 */
class StudentService {
  /**
   * Get all students with pagination (new endpoint)
   * @param params - Query parameters (pageNumber, search, filteredByClass, filteredByOrg, format)
   * @returns Paginated student list response or Blob for file exports
   */
  async getStudentsNew(params?: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    filteredByClass?: string;
    filteredByOrg?: string;
    format?: 'json' | 'file-export';
  }): Promise<StudentListResponse | Blob> {
    const format = params?.format || 'json';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    // Always include pageNumber (default to 1) to get all results
    // The API will return all students, and we'll paginate client-side
    queryParams.append('pageNumber', '1');
    
    // Don't send pageSize - we want all students from the API
    // Client-side pagination will handle showing 10 per page
    
    if (params?.search) {
      queryParams.append('search', params.search.trim());
    }
    if (params?.filteredByClass) {
      queryParams.append('filteredByClass', params.filteredByClass.trim());
    }
    if (params?.filteredByOrg) {
      queryParams.append('filteredByOrg', params.filteredByOrg.trim());
    }
    
    const queryString = queryParams.toString();
    const url = `${StudentEndpoints.getStudentsNew(format)}${queryString ? `?${queryString}` : ''}`;
    
    // For file exports, return blob
    if (format === 'file-export') {
      return await RequestService.getBlob(url);
    }
    
    // For JSON responses, return parsed data
    const res = await RequestService.get<StudentListResponse>(url);
    
    // Handle paginated response structure
    if (res && typeof res === 'object' && 'data' in res) {
      return res as StudentListResponse;
    }
    
    throw new Error('Invalid student list response');
  }

  /**
   * Export students to file (CSV/Excel)
   * @param params - Query parameters (search, filteredByClass, filteredByOrg, pageNumber)
   * @returns Blob file for download
   */
  async exportStudents(params?: {
    search?: string;
    filteredByClass?: string;
    filteredByOrg?: string;
    pageNumber?: number;
  }): Promise<Blob> {
    const blob = await this.getStudentsNew({
      ...params,
      format: 'file-export',
    });
    return blob as Blob;
  }

  /**
   * Get all students with pagination (alternative endpoint)
   * @param params - Query parameters (pageNumber, search, filteredByClass, filteredBySubclass, filteredByDepartment, filterByOrganization, status)
   * @returns Paginated student list response
   */
  async getStudents(params?: {
    pageNumber?: number;
    search?: string;
    filteredByClass?: string;
    filteredBySubclass?: string;
    filteredByDepartment?: string;
    filterByOrganization?: string;
    status?: string;
  }): Promise<StudentListResponse> {
    const queryParams = new URLSearchParams();
    
    // Always include these parameters
    // Include empty values if not provided to match API expectations
    queryParams.append('search', params?.search?.trim() || '');
    queryParams.append('filteredByClass', params?.filteredByClass?.trim() || '');
    queryParams.append('filteredBySubclass', params?.filteredBySubclass?.trim() || '');
    queryParams.append('filteredByDepartment', params?.filteredByDepartment?.trim() || '');
    queryParams.append('pageNumber', (params?.pageNumber || 1).toString());
    queryParams.append('filterByOrganization', params?.filterByOrganization?.trim() || '');
    queryParams.append('status', params?.status?.trim() || 'active');

    const queryString = queryParams.toString();
    const url = `${StudentEndpoints.getStudents}?${queryString}`;

    const res = await RequestService.get<StudentListResponse>(url);
    
    // Handle paginated response structure
    if (res && typeof res === 'object' && 'data' in res) {
      return res as StudentListResponse;
    }
    
    throw new Error('Invalid student list response');
  }

  /**
   * Get a single student by ID
   * @param id - Student ID
   * @returns Student data
   */
  async getStudentById(id: string): Promise<StudentType> {
    const res = await RequestService.get<StudentResponse | StudentType>(StudentEndpoints.getStudentById(id));
    
    const student = parseObjectResponse<StudentType>(res);
    if (student) {
      return student;
    }
    
    // Fallback: if response is already the student object
    if (res && typeof res === 'object' && '_id' in res) {
      return res as StudentType;
    }
    
    throw new Error('Invalid student response');
  }

  /**
   * Create a new student (single or bulk)
   * @param payload - Student creation data (single or bulk)
   * @returns Created student(s)
   */
  async createStudent(payload: {
    students: Array<{
      studentType?: 'k12' | 'tertiary';
      fullName: string;
      gender: 'male' | 'female';
      classCode?: number;
      subClass?: string;
      regNumber: string;
      sessionAdmitted?: string;
      termAdmitted?: string;
      department?: string;
      program?: string;
      studyYear?: number;
    }>;
    bulk?: boolean;
  }): Promise<{ data: StudentType[]; message: string; status: string }> {
    const res = await RequestService.post<{
      data: StudentType[];
      message: string;
      status: string;
    }>(StudentEndpoints.createStudent, payload);
    
    return res;
  }

  /**
   * Update an existing student
   * @param id - Student ID
   * @param payload - Student update data
   * @returns Updated student
   */
  async updateStudent(
    id: string,
    payload: {
      fullName?: string;
      gender?: 'male' | 'female';
      classCode?: number;
      subClass?: string;
      regNumber?: string;
      sessionAdmitted?: string;
      termAdmitted?: string;
      department?: string;
      program?: string;
      studyYear?: number;
    }
  ): Promise<StudentType> {
    const res = await RequestService.put<StudentResponse | StudentType>(StudentEndpoints.updateStudent(id), payload);
    
    const student = parseObjectResponse<StudentType>(res);
    if (student) {
      return student;
    }
    
    // Fallback: if response is already the student object
    if (res && typeof res === 'object' && '_id' in res) {
      return res as StudentType;
    }
    
    throw new Error('Failed to update student');
  }

  /**
   * Delete a student
   * @param id - Student ID
   * @returns Deletion result
   */
  async deleteStudent(id: string): Promise<{ status: string; message: string }> {
    const res = await RequestService.delete<{ status: string; message: string }>(StudentEndpoints.deleteStudent(id), {});
    return res || { status: 'success', message: 'Student Profile Deleted' };
  }

  /**
   * Change student class (single or bulk)
   * @param payload - Change class data
   * @returns Updated students
   */
  async changeClass(payload: {
    bulk?: boolean;
    regNumbers?: string[];
    classId: string;
  }): Promise<{ data: StudentType[]; message: string; status: string }> {
    const res = await RequestService.patch<{
      data: StudentType[];
      message: string;
      status: string;
    }>(StudentEndpoints.changeClass, payload);
    
    return res;
  }

  /**
   * Undo student graduation (single or bulk)
   * @param payload - Undo graduation data
   * @returns Updated students
   */
  async undoGraduation(payload: {
    bulk?: boolean;
    regNumbers?: string[];
  }): Promise<{ data: StudentType[]; message: string; status: string }> {
    const res = await RequestService.patch<{
      data: StudentType[];
      message: string;
      status: string;
    }>(StudentEndpoints.undoGraduation, payload);
    
    return res;
  }

  /**
   * Search students (legacy method)
   * @param query - Search query string
   * @returns Array of matching students
   */
  async searchStudents(query: string): Promise<StudentType[]> {
    const encodedQuery = encodeURIComponent(query);
    const res = await RequestService.get<StudentListResponse | StudentType[]>(`${StudentEndpoints.searchStudents}?query=${encodedQuery}`);
    
    return parseArrayResponse<StudentType>(res, {
      dataKey: 'data',
      fallbackKeys: ['students', 'result', 'items'],
    });
  }
}

export default new StudentService();

