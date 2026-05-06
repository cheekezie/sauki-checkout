import { notify } from '@/utils/alert-bridge';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from './api';

export function useGetPaymentLinkPublic(slug: string) {
  return useQuery({
    queryKey: ['payment-link-public', slug],
    queryFn: async () => api.getPaymentLinkPublic(slug),
    select: (res) => res.data.link,
    enabled: !!slug,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: any }) => api.initiatePayment(slug, payload),
    meta: { toastError: false },

    onError: (err) => {
      notify.modal({
        type: 'error',
        title: 'Request failed',
        message: err?.message ?? 'Failed to initiate payment',
      });
    },
  });
};
