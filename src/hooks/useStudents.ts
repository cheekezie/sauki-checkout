import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StudentService from "@/services/student.service";
import { getCachedData, storeCookie } from "@/utils/cookieStorage";
import type { StudentType, StudentListResponse } from "@/interface/student.interface";
import { useToast } from "./useToast";
import { useOrg } from "@/hooks/useOrg";
import { isUnauthorizedError } from "@/utils/errorHandler";

const COOKIE_NAME_STUDENTS = "_students_list";
const COOKIE_EXPIRY_DAYS = 14;

/**
 * Hook to fetch all students with pagination and cookie caching
 * @param params - Query parameters (pageNumber, search, filteredByClass, filteredByOrg)
 * @param enabled - Whether to enable the query (default: true)
 * @returns React Query result with paginated student data
 */
export function useStudents(
  params?: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    filteredByClass?: string;
    filteredByOrg?: string;
  },
  enabled: boolean = true
) {
  const queryClient = useQueryClient();
  const { activeOrgId } = useOrg();
  const cachedData = getCachedData<StudentType[]>(COOKIE_NAME_STUDENTS);

  // Use activeOrgId if filteredByOrg is not provided
  // Convert null to undefined for TypeScript compatibility
  const filteredByOrg = params?.filteredByOrg || (activeOrgId ?? undefined);

  // Include activeOrgId and params in query key so cache is invalidated when org/params change
  // Don't include pageNumber or pageSize in query key since we fetch all students
  const queryKey = [
    "students", 
    filteredByOrg, 
    params?.search, 
    params?.filteredByClass,
  ];

  const query = useQuery<StudentListResponse>({
    queryKey,
    queryFn: async () => {
      // Use the new endpoint with json format
      // Don't pass pageNumber or pageSize - we want all students from API
      // Client-side pagination will handle showing 10 per page
      const response = await StudentService.getStudentsNew({
        search: params?.search,
        filteredByClass: params?.filteredByClass,
        filteredByOrg: filteredByOrg,
        format: 'json',
      }) as StudentListResponse;
      
      // Extract students array from paginated response
      const studentsArray = response?.data?.students || [];
      
      if (studentsArray && studentsArray.length > 0) {
        storeCookie(COOKIE_NAME_STUDENTS, studentsArray, COOKIE_EXPIRY_DAYS);
        // Also cache the full response
        queryClient.setQueryData(queryKey, response);
      }
      return response;
    },
    initialData: Array.isArray(cachedData) && cachedData.length > 0 ? {
      status: 'success',
      data: {
        page: 1,
        pages: 1,
        studentCount: cachedData.length,
        students: cachedData,
      },
    } as StudentListResponse : undefined,
    staleTime: COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000, // 14 days - matches cookie expiry
    gcTime: COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000, // 14 days - matches cookie expiry
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors (unauthorized) - token might need refresh
      if (error?.statusCode === 401 || error?.status === 401 || error?.response?.status === 401) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
    enabled: enabled && !!activeOrgId, // Only fetch if org is selected
  });

  // Extract students array and pagination info for convenience
  const students = query.data?.data?.students || [];
  const pagination = query.data?.data ? {
    page: query.data.data.page,
    pages: query.data.data.pages,
    studentCount: query.data.data.studentCount,
  } : undefined;

  // Destructure query to exclude 'data' property, then add our own
  const { data: _, ...restQuery } = query;

  return {
    ...restQuery,
    data: students, // Return students array for backward compatibility
    students, // Also provide as separate property
    pagination, // Provide pagination info
    response: query.data, // Full response for advanced use cases
  };
}

/**
 * Hook to fetch a single student by ID
 * @param id - Student ID
 * @param enabled - Whether to enable the query (default: true)
 * @returns React Query result with student data
 */
export function useStudent(id: string | undefined, enabled: boolean = true) {
  return useQuery<StudentType>({
    queryKey: ["student", id],
    queryFn: async () => {
      if (!id) throw new Error("Student ID is required");
      return await StudentService.getStudentById(id);
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes for single student
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });
}

/**
 * Hook to search students
 * @param query - Search query string
 * @param enabled - Whether to enable the query (default: true)
 * @returns React Query result with search results
 */
export function useSearchStudents(query: string, enabled: boolean = true) {
  return useQuery<StudentType[]>({
    queryKey: ["students", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      return await StudentService.searchStudents(query);
    },
    enabled: enabled && query.trim().length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes for search results
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
}

/**
 * Hook to create a new student
 * @returns Mutation function to create student
 */
export function useCreateStudent() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (payload: {
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
    }) => {
      return await StudentService.createStudent(payload);
    },
    onSuccess: (data) => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: ["students"] });
      // Remove cached students list to force refresh
      storeCookie(COOKIE_NAME_STUDENTS, [], 0); // Clear cache
      showSuccess("Student Created", data.message || "Student has been added successfully");
      return data;
    },
    onError: (error: any) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        showError(
          "Create Failed",
          error.message || "Failed to create student. Please try again."
        );
      }
    },
  });
}

/**
 * Hook to update an existing student
 * @returns Mutation function to update student
 */
export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async ({ id, payload }: { 
      id: string; 
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
    }) => {
      return await StudentService.updateStudent(id, payload);
    },
    onSuccess: (data, variables) => {
      // Invalidate students list and specific student cache
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", variables.id] });
      // Remove cached students list to force refresh
      storeCookie(COOKIE_NAME_STUDENTS, [], 0); // Clear cache
      showSuccess("Student Updated", "Student information has been updated successfully");
      return data;
    },
    onError: (error: any) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        showError(
          "Update Failed",
          error.message || "Failed to update student. Please try again."
        );
      }
    },
  });
}

/**
 * Hook to delete a student
 * @returns Mutation function to delete student
 */
export function useDeleteStudent() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return await StudentService.deleteStudent(id);
    },
    onSuccess: () => {
      // Invalidate students list
      queryClient.invalidateQueries({ queryKey: ["students"] });
      // Remove cached students list to force refresh
      storeCookie(COOKIE_NAME_STUDENTS, [], 0); // Clear cache
      showSuccess("Student Deleted", "Student has been removed successfully");
    },
    onError: (error: any) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        showError(
          "Delete Failed",
          error.message || "Failed to delete student. Please try again."
        );
      }
    },
  });
}

