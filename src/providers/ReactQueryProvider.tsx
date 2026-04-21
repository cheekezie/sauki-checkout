import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { isUnauthorizedError } from '@/utils/errorHandler';
import { notify } from '@/utils/alert-bridge';

let lastErrorMessage: string | null = null;
let lastErrorTime = 0;

const SHOULD_DEDUPE_WITHIN_MS = 3000;

const shouldShowError = (message: string) => {
  const now = Date.now();
  if (message === lastErrorMessage && now - lastErrorTime < SHOULD_DEDUPE_WITHIN_MS) {
    return false;
  }
  lastErrorMessage = message;
  lastErrorTime = now;
  return true;
};

interface ReactQueryProviderProps {
  children: ReactNode;
}

export default function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(() => {
    const showAlert = (payload: { type: 'error' | 'success'; title: string; message: string }) => {
      notify.snackbar({
        type: 'error',
        title: payload.title,
        message: payload.message,
      });
    };

    return new QueryClient({
      queryCache: new QueryCache({
        onError: (error, query) => {
          if (isUnauthorizedError(error)) return;

          const meta: any = query.meta ?? {};
          const toastCfg = meta.toastError ?? true;

          if (toastCfg === false) return;

          const title = typeof toastCfg === 'object' && toastCfg.title ? toastCfg.title : 'Request failed';
          const message = typeof toastCfg === 'object' && toastCfg.message ? toastCfg.message : error.message;

          showAlert({ type: 'error', title, message });
        },
      }),

      mutationCache: new MutationCache({
        onError: (error, _variables, _ctx, mutation) => {
          if (isUnauthorizedError(error)) return;

          const meta: any = mutation.meta ?? {};
          const toastCfg = meta.toastError ?? true;

          if (toastCfg === false) return;

          const title = typeof toastCfg === 'object' && toastCfg.title ? toastCfg.title : 'Request failed';
          const message = typeof toastCfg === 'object' && toastCfg.message ? toastCfg.message : error.message;

          showAlert({ type: 'error', title, message });
        },
      }),

      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 30,
          retry: 2,
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
          refetchOnMount: false,
          throwOnError: false, // ✅ keep false
        },
        mutations: {
          throwOnError: false, // ✅ keep false
        },
      },
    });
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
