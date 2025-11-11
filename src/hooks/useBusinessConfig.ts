import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCachedData, storeCookie } from "@/utils/cookieStorage";

/**
 * Example interface for business config data
 * Replace with your actual business config type
 */
interface BusinessConfig {
  id: string;
  name: string;
  settings: {
    [key: string]: unknown;
  };
  // Add more fields as needed
}

const COOKIE_NAME = "_business_config";
const COOKIE_EXPIRY_DAYS = 14;

/**
 * Example service function - replace with your actual service
 * This demonstrates the pattern for creating optimized hooks with cookie caching
 */
async function fetchBusinessConfig(_hostname: string): Promise<BusinessConfig> {
  // Replace with your actual API call
  // const response = await BusinessConfigService.getConfig(_hostname);
  // return response.data;
  
  // Placeholder return
  throw new Error("Business config service not implemented");
}

/**
 * Example optimized hook with cookie caching
 * This serves as a reference pattern for future hooks
 * 
 * Features:
 * - Cookie-based persistence across page refreshes
 * - 14-day expiry with automatic cleanup
 * - React Query cache integration
 * - Prevents unnecessary API calls when valid cached data exists
 * - Type-safe with TypeScript generics
 * 
 * @param hostname - Business identifier (or any query parameter)
 * @returns React Query result with business config data
 */
export function useBusinessConfig(hostname: string) {
  const queryClient = useQueryClient();
  const cachedData = getCachedData<BusinessConfig>(COOKIE_NAME);

  return useQuery<BusinessConfig>({
    queryKey: ["businessConfig", hostname],
    queryFn: async () => {
      const response = await fetchBusinessConfig(hostname);
      if (response) {
        storeCookie(COOKIE_NAME, response, COOKIE_EXPIRY_DAYS);
        queryClient.setQueryData(["businessConfig", hostname], response);
        return response;
      }
      throw new Error("Failed to fetch business config");
    },
    initialData: cachedData || undefined,
    staleTime: COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000, // 14 days - matches cookie expiry
    gcTime: COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000, // 14 days - matches cookie expiry
    retry: 2,
  });
}

