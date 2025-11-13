import { useQuery, useQueryClient } from "@tanstack/react-query";
import TransferService from "@/services/transfer.service";
import type { TransferListResponse } from "@/interface/transfer.interface";
import { useOrg } from "@/hooks/useOrg";
import { isUnauthorizedError } from "@/utils/errorHandler";

/**
 * Hook to fetch all transfers with pagination and filters
 * @param params - Query parameters (pageNumber, startDate, endDate, destinationAccountNumber, filterByOrganization, amount, search, filteredByStatus)
 * @param enabled - Whether to enable the query (default: true)
 * @returns React Query result with paginated transfer data
 */
export function useTransfers(
  params?: {
    pageNumber?: number;
    startDate?: string;
    endDate?: string;
    destinationAccountNumber?: string;
    filterByOrganization?: string;
    amount?: number;
    search?: string;
    filteredByStatus?: string;
  },
  enabled: boolean = true
) {
  const queryClient = useQueryClient();
  const { activeOrgId } = useOrg();

  // Use activeOrgId if filterByOrganization is not provided
  const filterByOrganization = params?.filterByOrganization || (activeOrgId ?? undefined);

  // Include activeOrgId and params in query key so cache is invalidated when org/params change
  // Don't include pageNumber in query key if we want to fetch all transfers for client-side pagination
  const queryKey = [
    "transfers",
    filterByOrganization,
    params?.startDate,
    params?.endDate,
    params?.destinationAccountNumber,
    params?.amount,
    params?.search,
    params?.filteredByStatus,
  ];

  const query = useQuery<TransferListResponse>({
    queryKey,
    queryFn: async () => {
      const response = await TransferService.getTransfersNew({
        ...params,
        filterByOrganization: filterByOrganization,
        format: 'json',
      }) as TransferListResponse;
      
      // Cache the full response
      queryClient.setQueryData(queryKey, response);
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors (unauthorized) - token might need refresh
      if (isUnauthorizedError(error)) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
    enabled: enabled && !!activeOrgId, // Only fetch if org is selected
  });

  // Extract transfers array and pagination info for convenience
  const transfers = query.data?.data?.transfers || [];
  const pagination = query.data?.data ? {
    page: query.data.data.page,
    pages: query.data.data.pages,
    transferCount: query.data.data.transferCount,
    totalAmountReceived: query.data.data.totalAmountReceived,
    totalNetAmount: query.data.data.totalNetAmount,
    totalFeeIncurred: query.data.data.totalFeeIncurred,
  } : undefined;

  // Destructure query to exclude 'data' property, then add our own
  const { data: _, ...restQuery } = query;

  return {
    ...restQuery,
    data: transfers, // Return transfers array for backward compatibility
    transfers, // Also provide as separate property
    pagination, // Provide pagination info
    response: query.data, // Full response for advanced use cases
  };
}

