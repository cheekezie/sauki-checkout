import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OrganizationService, {
  type UpdateKycDocumentsRequest,
} from "@/services/organization.service";
import type {
  GetOrganizationsParams,
  OrganizationListResponse,
  UpdateOrganizationRequest,
} from "@/services/organization.service";
import { useToast } from "./useToast";
import { isUnauthorizedError } from "@/utils/errorHandler";
import { getErrorMessage } from "@/types/error.types";

/**
 * Hook to fetch all organizations (Groups)
 * @param params - Query parameters
 * @returns React Query result with organization list data
 */
export function useGroups(params?: Omit<GetOrganizationsParams, 'organizationType'>) {
  const { showError } = useToast();

  return useQuery<OrganizationListResponse>({
    queryKey: ["organizations", "groups", params],
    queryFn: async () => {
      try {
        return await OrganizationService.getAllOrganizations({
          ...params,
          organizationType: 'group',
          order: params?.order || 'desc',
        });
      } catch (error: unknown) {
        // Don't show toast for 401 errors - global handler will show it
        if (!isUnauthorizedError(error)) {
          const errorMessage = getErrorMessage(error) || "Failed to load groups. Please try again.";
          showError("Error", errorMessage);
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Hook to fetch all organizations (Organizations/Schools)
 * @param params - Query parameters including organizationCategory
 * @returns React Query result with organization list data
 */
export function useOrganizations(params?: GetOrganizationsParams) {
  const { showError } = useToast();

  return useQuery<OrganizationListResponse>({
    queryKey: ["organizations", params],
    queryFn: async () => {
      try {
        return await OrganizationService.getAllOrganizations({
          ...params,
          order: params?.order || 'desc',
        });
      } catch (error: unknown) {
        // Don't show toast for 401 errors - global handler will show it
        if (!isUnauthorizedError(error)) {
          const errorMessage = getErrorMessage(error) || "Failed to load organizations. Please try again.";
          showError("Error", errorMessage);
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Hook to update an organization
 * @returns React Query mutation for updating organizations
 */
export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateOrganizationRequest }) => {
      return await OrganizationService.updateOrganization(id, payload);
    },
    onSuccess: (data) => {
      const message = data.message || "Organization has been successfully updated.";
      showSuccess("Organization Updated", message);
      
      // Invalidate and refetch organizations queries
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error: unknown) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        const errorMessage = getErrorMessage(error) || "Failed to update organization. Please try again.";
        showError("Failed to Update Organization", errorMessage);
      }
    },
  });
}

/**
 * Hook to delete an organization
 * @returns React Query mutation for deleting organizations
 */
export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return await OrganizationService.deleteOrganization(id);
    },
    onSuccess: (data) => {
      const message = data.message || "Organization has been successfully deleted.";
      showSuccess("Organization Deleted", message);
      
      // Invalidate and refetch organizations queries
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error: unknown) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        const errorMessage = getErrorMessage(error) || "Failed to delete organization. Please try again.";
        showError("Failed to Delete Organization", errorMessage);
      }
    },
  });
}

/**
 * Hook to fetch organization profile
 * @param options - Query options including enabled flag
 * @returns React Query result with organization profile data
 */
export function useOrganizationProfile(options?: { enabled?: boolean }) {
  const { showError } = useToast();

  return useQuery({
    queryKey: ["organization", "profile"],
    queryFn: async () => {
      try {
        return await OrganizationService.getOrganizationProfile();
      } catch (error: unknown) {
        // Don't show toast for 401 errors - global handler will show it
        // Also don't show toast for forbidden errors when query is disabled (portalAdmin case)
        if (!isUnauthorizedError(error)) {
          const errorMessage = getErrorMessage(error);
          // Only show error if it's not a forbidden error (which is expected for portalAdmin)
          if (errorMessage && !errorMessage.includes("Only Organization Admin And Their Staff Are Allowed")) {
            showError("Error", errorMessage || "Failed to load organization profile. Please try again.");
          }
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 30,
    enabled: options?.enabled !== false, 
    retry: false,
  });
}

/**
 * Hook to update organization profile (for orgAdmin/groupAdmin editing their own organization)
 * @returns React Query mutation for updating organization profile
 */
export function useUpdateOrganizationProfile() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateOrganizationRequest }) => {
      // ID is passed for consistency but not used in endpoint (uses auth context)
      return await OrganizationService.updateOrganizationProfile(id, payload);
    },
    onSuccess: (data) => {
      const message = data.message || "Organization profile has been successfully updated.";
      showSuccess("Profile Updated", message);
      
      // Invalidate and refetch organization profile
      queryClient.invalidateQueries({ queryKey: ["organization", "profile"] });
    },
    onError: (error: unknown) => {
      if (!isUnauthorizedError(error)) {
        const errorMessage = getErrorMessage(error) || "Failed to update organization profile. Please try again.";
        showError("Failed to Update Profile", errorMessage);
      }
    },
  });
}

/**
 * Hook to update organization KYC documents
 * @returns React Query mutation for updating KYC documents
 */
export function useUpdateKycDocuments() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (payload: UpdateKycDocumentsRequest) => {
      return await OrganizationService.updateKycDocuments(payload);
    },
    onSuccess: (data) => {
      const message = data.message || "KYC documents have been successfully updated.";
      showSuccess("Documents Updated", message);
      queryClient.invalidateQueries({ queryKey: ["organization", "profile"] });
    },
    onError: (error: unknown) => {
      if (!isUnauthorizedError(error)) {
        const errorMessage = getErrorMessage(error) || "Failed to update documents. Please try again.";
        showError("Failed to Update Documents", errorMessage);
      }
    },
  });
}

/**
 * Hook to update organization banner image
 * NOTE: Banner upload is currently not supported by the /api/v2/org/edit endpoint
 * The endpoint only accepts: email, organizationName, phoneNumber, organizationCategory,
 * schoolType, schoolCategoryBoard, state, lga, address, and directors.
 * @returns React Query mutation for updating banner image (disabled)
 */
export function useUpdateBannerImage() {
  const { showError } = useToast();

  return {
    mutateAsync: async (_bannerFile: File) => {
      // Banner upload is not supported by the API endpoint
      showError(
        "Banner Upload Not Supported",
        "Banner image upload is not currently supported by the organization profile update endpoint. Please contact support for assistance."
      );
      throw new Error("Banner upload is not supported by the API endpoint");
    },
    isPending: false,
  };
}

/**
 * Hook to activate/setup organization profile
 * @returns React Query mutation for activating organization
 */
export function useActivateOrganization() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (payload: {
      state: string;
      lga: string;
      address: string;
      tinNumber: string;
      bankDetails: {
        accountNumber: string;
        bankCode: string;
      };
    }) => {
      return await OrganizationService.activateOrganization(payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["organization", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      const message = data.message || "Organization activated successfully";
      showSuccess("Organization Activated", message);
    },
    onError: (error: unknown) => {
      if (!isUnauthorizedError(error)) {
        const errorMessage = getErrorMessage(error) || "Failed to activate organization. Please try again.";
        showError("Activation Failed", errorMessage);
      }
    },
  });
}

/**
 * Hook to add other bank details
 * @returns React Query mutation for adding bank details
 */
export function useAddBankDetails() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (payload: {
      accountNumber: string;
      bankCode: string;
    }) => {
      return await OrganizationService.addBankDetails(payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["organization", "profile"] });
      const message = data.message || "Bank account added successfully";
      showSuccess("Bank Account Added", message);
    },
    onError: (error: unknown) => {
      if (!isUnauthorizedError(error)) {
        const errorMessage = getErrorMessage(error) || "Failed to add bank account. Please try again.";
        showError("Failed to Add Bank Account", errorMessage);
      }
    },
  });
}

/**
 * Hook to assign organization to master account
 * @returns React Query mutation for assigning organization to master account
 */
export function useAssignOrgToMasterAccount() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async ({ 
      orgId, 
      payload 
    }: { 
      orgId: string;
      payload: {
        state: string;
        lga: string;
        address: string;
        tinNumber: string;
        bankDetails: {
          accountNumber: string;
          bankCode: string;
        };
      };
    }) => {
      return await OrganizationService.assignOrgToMasterAccount(orgId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      showSuccess("Success", "Organization assigned to master account successfully");
    },
    onError: (error: unknown) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        const errorMessage = getErrorMessage(error) || "Failed to assign organization to master account. Please try again.";
        showError("Assignment Failed", errorMessage);
      }
    },
  });
}

