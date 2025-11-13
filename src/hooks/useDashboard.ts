import { useQuery } from "@tanstack/react-query";
import DashboardService, { 
  type DashboardParams, 
  type DashboardResponse,
  type ChartData
} from "@/services/dashboard.service";
import { useToast } from "./useToast";
import { isUnauthorizedError } from "@/utils/errorHandler";
import { getErrorMessage } from "@/types/error.types";
import { useDecodedAuth } from "./useDecodedAuth";
import { MerchantRoles } from "@/enums/merchant.enum";

/**
 * Hook to fetch dashboard data
 * @param params - Query parameters for dashboard data
 * @returns React Query result with dashboard data
 */
export function useDashboard(params?: DashboardParams) {
  const { showError } = useToast();
  const { role } = useDecodedAuth();
  
  // Portal admins may not have organization context
  const isPortalAdmin = role === MerchantRoles.PORTAL_ADMIN;

  return useQuery<DashboardResponse>({
    queryKey: ["dashboard", params],
    queryFn: async () => {
      try {
        return await DashboardService.getDashboard(params);
      } catch (error: unknown) {
        // For portalAdmin, if they get forbidden error, return empty data
        const errorMessage = getErrorMessage(error);
        if (isPortalAdmin && errorMessage?.includes("Only Organization Admin And Their Staff Are Allowed")) {
          return {
            status: "success",
            data: {
              totalReceive: 0,
              totalStudents: 0,
              totalFees: 0,
              chartData: { labels: [], schoolFess: [], otherFees: [] } as ChartData,
              incomingTraffic: [],
              latestTransactions: [],
              latestInvoices: [],
            },
          } as DashboardResponse;
        }
        
        // Don't show toast for 401 errors - global handler will show it
        if (!isUnauthorizedError(error)) {
          const finalErrorMessage = errorMessage || "Failed to load dashboard data. Please try again.";
          showError("Error", finalErrorMessage);
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

