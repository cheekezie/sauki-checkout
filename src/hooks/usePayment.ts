import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PaymentService, {
  type PaymentGatewayResponse,
  type SimulateTransferRequest,
  type ProfitSharingAccountResponse,
  type CreateProfitSharingAccountRequest,
  type PricingResponse,
  type UpdatePricingRequest,
} from "@/services/payment.service";
import { useToast } from "./useToast";
import { isUnauthorizedError } from "@/utils/errorHandler";
import { useOrg } from "@/hooks/useOrg";

/**
 * Hook to fetch payment gateways
 * @returns React Query result with payment gateways data
 */
export function usePaymentGateways() {
  const { showError } = useToast();

  return useQuery<PaymentGatewayResponse>({
    queryKey: ["paymentGateways"],
    queryFn: async () => {
      try {
        return await PaymentService.getPaymentGateways();
      } catch (error: any) {
        // Don't show toast for 401 errors - global handler will show it
        if (!isUnauthorizedError(error)) {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to load payment gateways. Please try again.";
          showError("Error", errorMessage);
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to simulate a transfer
 * @returns Mutation function to simulate transfer
 */
export function useSimulateTransfer() {
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (payload: SimulateTransferRequest) => {
      return await PaymentService.simulateTransfer(payload);
    },
    onSuccess: (data) => {
      showSuccess(
        "Transfer Simulated",
        data.message || "Transfer has been successfully simulated."
      );
    },
    onError: (error: any) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to simulate transfer. Please try again.";
        showError("Error", errorMessage);
      }
    },
  });
}

/**
 * Hook to fetch profit sharing accounts
 * NOTE: API endpoint not provided yet - disabled to prevent errors
 * @returns React Query result with profit sharing accounts data
 */
export function useProfitSharingAccounts() {
  return useQuery<ProfitSharingAccountResponse>({
    queryKey: ["profitSharingAccounts"],
    queryFn: async () => {
      // Pending API support: enable once profit sharing endpoint is available.
      throw new Error("Profit sharing API endpoint not provided");
      // try {
      //   return await PaymentService.getProfitSharingAccounts();
      // } catch (error: any) {
      //   // Don't show toast for 401 errors - global handler will show it
      //   if (!isUnauthorizedError(error)) {
      //     const errorMessage =
      //       error?.response?.data?.message ||
      //       error?.message ||
      //       "Failed to load profit sharing accounts. Please try again.";
      //     showError("Error", errorMessage);
      //   }
      //   throw error;
      // }
    },
    enabled: false, // Disabled until endpoint is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to add a profit sharing account
 * @returns Mutation function to add account
 */
export function useAddProfitSharingAccount() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (payload: CreateProfitSharingAccountRequest) => {
      return await PaymentService.addProfitSharingAccount(payload);
    },
    onSuccess: (data) => {
      // Invalidate and refetch profit sharing accounts list
      queryClient.invalidateQueries({ queryKey: ["profitSharingAccounts"] });
      showSuccess(
        "Account Added",
        (data as any).message || "Profit sharing account has been added successfully."
      );
    },
    onError: (error: any) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add profit sharing account. Please try again.";
        showError("Error", errorMessage);
      }
    },
  });
}

/**
 * Hook to delete a profit sharing account
 * @returns Mutation function to delete account
 */
export function useDeleteProfitSharingAccount() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return await PaymentService.deleteProfitSharingAccount(id);
    },
    onSuccess: (data) => {
      // Invalidate and refetch profit sharing accounts list
      queryClient.invalidateQueries({ queryKey: ["profitSharingAccounts"] });
      showSuccess(
        "Account Deleted",
        data.message || "Profit sharing account has been deleted successfully."
      );
    },
    onError: (error: any) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete profit sharing account. Please try again.";
        showError("Error", errorMessage);
      }
    },
  });
}

/**
 * Hook to fetch pricing configuration
 * @returns React Query result with pricing data
 */
export function usePricing(organizationId?: string) {
  const { activeOrgId } = useOrg();
  const orgId = organizationId || activeOrgId;
  const { showError } = useToast();

  return useQuery<PricingResponse>({
    queryKey: ["pricing", orgId],
    queryFn: async () => {
      try {
        return await PaymentService.getPricing(orgId || undefined);
      } catch (error: any) {
        // Don't show toast for 401 errors - global handler will show it
        if (!isUnauthorizedError(error)) {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to load pricing configuration. Please try again.";
          showError("Error", errorMessage);
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!orgId, // Only fetch if organization ID is available
  });
}

/**
 * Hook to update pricing configuration
 * @returns Mutation function to update pricing
 */
export function useUpdatePricing(organizationId?: string) {
  const { activeOrgId } = useOrg();
  const orgId = organizationId || activeOrgId;
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (payload: UpdatePricingRequest) => {
      return await PaymentService.updatePricing(payload, orgId || undefined);
    },
    onSuccess: (data) => {
      // Invalidate and refetch pricing
      queryClient.invalidateQueries({ queryKey: ["pricing", orgId] });
      showSuccess(
        "Pricing Updated",
        (data as any).message || "Pricing configuration has been updated successfully."
      );
    },
    onError: (error: any) => {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update pricing configuration. Please try again.";
        showError("Error", errorMessage);
      }
    },
  });
}

