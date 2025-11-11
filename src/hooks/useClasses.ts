import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ClassService from "@/services/class.service";
import type {
  ClassListResponse,
  UpdateClassRequest,
  CreateSubClassRequest,
  UpdateSubClassRequest,
  AssignSubClassRequest,
  UnassignSubClassRequest,
  SubClassListResponse,
} from "@/interface/class.interface";
import { useToast } from "./useToast";
import { useOrg } from "@/hooks/useOrg";
import { useDecodedAuth } from "./useDecodedAuth";
import { isUnauthorizedError } from "@/utils/errorHandler";
import { MerchantRoles } from "@/enums/merchant.enum";

/**
 * Hook to fetch all classes
 * @param enabled - Whether to enable the query (default: true)
 * @param _excludeSubClasses - DEPRECATED: No longer needed, new endpoint handles this automatically
 * @returns React Query result with class list data
 */
export function useClasses(enabled: boolean = true, _excludeSubClasses?: boolean) {
  const { activeOrgId } = useOrg();
  const { role } = useDecodedAuth();
  
  // Portal admins can access classes without an organization (they can fetch all classes)
  const isPortalAdmin = role === MerchantRoles.PORTAL_ADMIN;
  // Portal admins can fetch without org, others need org
  const shouldFetch = enabled && (isPortalAdmin || !!activeOrgId);

  const query = useQuery<ClassListResponse>({
    queryKey: ["classes", isPortalAdmin ? (activeOrgId || "all") : activeOrgId],
    queryFn: async () => {
      // Use the endpoint /api/v2/class/all
      // Portal admin: can optionally filter by activeOrgId, or get all classes if no org selected
      // Others: must pass activeOrgId
      // For portal admins: if activeOrgId exists, try filtering by it; if it fails, fall back to all classes
      if (isPortalAdmin && activeOrgId) {
        try {
          // Try filtering by activeOrgId first
          return await ClassService.getAllClasses(activeOrgId);
        } catch (error: any) {
          // If filtering by org fails (e.g., "Organization Not Found"), fall back to all classes
          const errorMessage = (error?.message || error?.response?.data?.message || '').toLowerCase();
          if (errorMessage.includes('organization not found') || 
              errorMessage.includes('organization') ||
              error?.statusCode === 400 ||
              error?.status === 400) {
            // Fall back to fetching all classes
            return await ClassService.getAllClasses(undefined);
          }
          // Re-throw other errors
          throw error;
        }
      }
      
      // Portal admin without org, or regular user: use standard logic
      const filteredByOrg = isPortalAdmin 
        ? undefined // Portal admin without org: get all classes
        : (activeOrgId || undefined); // Others: must have org
      return await ClassService.getAllClasses(filteredByOrg);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors (unauthorized)
      const status = error?.statusCode || error?.status || error?.response?.status;
      if (status === 401) {
        return false;
      }
      
      // Don't retry on 400 errors (bad request) - but allow portal admins to fall back to all classes
      if (status === 400 && isPortalAdmin) {
        // Portal admins can fall back to all classes, so don't retry
        return false;
      }
      
      if (status === 400) {
        return false;
      }
      
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
    enabled: shouldFetch, // Only fetch if organization is selected
  });

  // Extract classes array and count for convenience
  const classes = query.data?.data?.classes || [];
  const classCount = query.data?.data?.classCount || 0;

  // Destructure query to exclude 'data' property, then add our own
  const { data: _, ...restQuery } = query;

  return {
    ...restQuery,
    data: classes, // Return classes array for backward compatibility
    classes, // Also provide as separate property
    classCount, // Provide count info
    response: query.data, // Full response for advanced use cases
  };
}

/**
 * Hook to update a class
 * @returns Mutation function to update class
 */
export function useUpdateClass() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateClassRequest }) => {
      return await ClassService.updateClass(id, payload);
    },
    onSuccess: (data) => {
      // Invalidate and refetch classes list
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      showSuccess(data.message || "Class updated successfully");
    },
    onError: (error: any) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update class. Please try again.";
        showError(errorMessage);
      }
    },
  });
}

/**
 * Hook to create a new subclass
 * @returns Mutation function to create subclass
 */
export function useCreateSubClass() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (payload: CreateSubClassRequest) => {
      return await ClassService.createSubClass(payload);
    },
    onSuccess: (data) => {
      // Invalidate and refetch subclasses list
      queryClient.invalidateQueries({ queryKey: ["subClasses"] });
      showSuccess(data.message || "Subclass created successfully");
    },
    onError: (error: any) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create subclass. Please try again.";
        showError(errorMessage);
      }
    },
  });
}

/**
 * Hook to fetch all subclasses
 * @param enabled - Whether to enable the query (default: true)
 * @returns React Query result with subclass list data
 */
export function useSubClasses(filteredByOrg?: string, enabled: boolean = true) {
  const { activeOrgId } = useOrg();
  const { role } = useDecodedAuth();
  
  const isPortalAdmin = role === MerchantRoles.PORTAL_ADMIN;
  // Portal admins shouldn't pass org filter - pass undefined instead
  const orgId = isPortalAdmin ? undefined : (filteredByOrg || activeOrgId);
  const shouldFetch = isPortalAdmin || !!orgId;

  return useQuery({
    queryKey: ["subClasses", orgId],
    queryFn: async () => {
      return await ClassService.getAllSubClasses(orgId || undefined); // Pass undefined for portal admins and null values
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors (unauthorized) or 400 errors (bad request - backend issues)
      const status = error?.statusCode || error?.status || error?.response?.status;
      if (status === 401 || status === 400) {
        return false;
      }
      return failureCount < 2;
    },
    enabled: enabled && shouldFetch,
  });
}

/**
 * Hook to fetch subclasses assigned to a class
 * @param classId - Class ID
 * @param enabled - Whether query should run
 */
export function useAssignedSubClasses(classId?: string, enabled: boolean = true) {
  return useQuery<SubClassListResponse>({
    queryKey: ["assignedSubClasses", classId],
    queryFn: async () => {
      if (!classId) {
        throw new Error("Class ID is required to fetch assigned subclasses.");
      }
      return await ClassService.getAssignedSubClasses(classId);
    },
    enabled: enabled && Boolean(classId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Hook to update a subclass
 * @returns Mutation function to update subclass
 */
export function useUpdateSubClass() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateSubClassRequest }) => {
      return await ClassService.updateSubClass(id, payload);
    },
    onSuccess: (data) => {
      // Invalidate and refetch subclasses list
      queryClient.invalidateQueries({ queryKey: ["subClasses"] });
      showSuccess(data.message || "Subclass updated successfully");
    },
    onError: (error: any) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update subclass. Please try again.";
        showError(errorMessage);
      }
    },
  });
}

/**
 * Hook to assign subclass to classes
 * @returns Mutation function to assign subclass
 */
export function useAssignSubClass() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (payload: AssignSubClassRequest) => {
      return await ClassService.assignSubClass(payload);
    },
    onSuccess: (data) => {
      // Invalidate and refetch classes and subclasses lists
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["subClasses"] });
      queryClient.invalidateQueries({ queryKey: ["assignedSubClasses"] });
      showSuccess(data.message || "Subclass assigned successfully");
    },
    onError: (error: any) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to assign subclass. Please try again.";
        showError(errorMessage);
      }
    },
  });
}

/**
 * Hook to unassign subclass from a class
 * @returns Mutation function to unassign subclass
 */
export function useUnassignSubClass() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (payload: UnassignSubClassRequest) => {
      return await ClassService.unassignSubClass(payload);
    },
    onSuccess: () => {
      // Invalidate and refetch classes and subclasses lists
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["subClasses"] });
      queryClient.invalidateQueries({ queryKey: ["assignedSubClasses"] });
      showSuccess("Subclass unassigned successfully");
    },
    onError: (error: any) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to unassign subclass. Please try again.";
        showError(errorMessage);
      }
    },
  });
}

/**
 * Hook to delete a subclass
 * @returns Mutation function to delete subclass
 */
export function useDeleteSubClass() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return await ClassService.deleteSubClass(id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subClasses"] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["assignedSubClasses"] });
      const message = data?.message || "Subclass deleted successfully";
      showSuccess(message);
    },
    onError: (error: any) => {
      if (!isUnauthorizedError(error)) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete subclass. Please try again.";
        showError(errorMessage);
      }
    },
  });
}

