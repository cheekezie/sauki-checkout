import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";
import { isUnauthorizedError } from "@/utils/errorHandler";

interface ReactQueryProviderProps {
  children: ReactNode;
}

/**
 * Optimized React Query Provider with default configuration
 * - Prevents unnecessary refetches on window focus
 * - Configures appropriate stale and garbage collection times
 * - Reduces API calls by using cache effectively
 * - Filters out 401 errors globally (handled by auth error handler)
 */
export default function ReactQueryProvider({
  children,
}: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data stays fresh for 5 minutes by default
            staleTime: 1000 * 60 * 5, // 5 minutes

            // Cache data for 30 minutes before garbage collection
            gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime in v4)

            // Retry failed requests twice
            retry: 2,

            // Prevent unnecessary refetches on window focus
            refetchOnWindowFocus: false,

            // Refetch on network reconnect (user comes back online)
            refetchOnReconnect: true,

            // Don't refetch if data already exists in cache
            refetchOnMount: false,

            // Don't treat 401 errors as query errors (they're handled globally)
            throwOnError: (error) => {
              // Return false for 401 errors so they don't trigger error state
              // The global auth error handler will handle them
              return !isUnauthorizedError(error);
            },
          },
          mutations: {
            // Don't treat 401 errors as mutation errors (they're handled globally)
            throwOnError: (error) => {
              return !isUnauthorizedError(error);
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}


