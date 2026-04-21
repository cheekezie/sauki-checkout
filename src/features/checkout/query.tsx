import { useMutation, useQuery } from '@tanstack/react-query';
import api, { type UssdPayloadI } from './api';
import { notify } from '@/utils/alert-bridge';

export const useGetCheckoutData = (ref: string) => {
  return useQuery({
    queryKey: ['checkout-data', ref],
    queryFn: async () => api.getCheckoutData(ref),
    select: ({ data }) => data.transaction,
  });
};

export const useGetBankList = () => {
  return useQuery({
    queryKey: ['ussd-bank'],
    queryFn: async () => api.getBankList(),
    select: ({ data }) => data.data,
  });
};

export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: (payload) => api.initiatePayment(payload),
    meta: { toastError: false },
    onSuccess: (res) => {
      const url = res.data.checkoutData.checkout;
      if (url) window.open(url, '_blank');
    },

    onError: (err) => {
      notify.modal({
        type: 'error',
        title: 'Request failed',
        message: err?.message ?? 'Failed to initiate payment',
      });
    },
  });
};

export const useInitiateUssdPayment = () => {
  return useMutation({
    mutationFn: (payload: UssdPayloadI) => api.initiateUssdPayment(payload),
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
