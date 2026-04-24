import { notify } from '@/utils/alert-bridge';
import { useMutation, useQuery } from '@tanstack/react-query';
import api, { type CardPayloadI, type ChekoutDemoPayloadI, type UssdPayloadI } from './api';

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

export const useProcessCheckoutDemo = () => {
  return useMutation({
    mutationFn: (payload: ChekoutDemoPayloadI) => api.processChekoutDemo(payload),
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

export const useInitiateUssdPayment = () => {
  return useMutation({
    mutationFn: (payload: UssdPayloadI) => api.initiateUssdPayment(payload),
    meta: { toastError: false },
  });
};

export const useInitiateTransferPayment = (transactionId: string) => {
  return useQuery({
    queryKey: ['transfer-init', transactionId],
    queryFn: () => api.initiateTransferPayment(transactionId),
    meta: { toastError: false },
    select: ({ data }) => data,
    enabled: !!transactionId,
    staleTime: Infinity,
    retry: false,
  });
};

export const useInitiateCardPayment = () => {
  return useMutation({
    mutationFn: (payload: CardPayloadI) => api.initiateCardPayment(payload),
    meta: { toastError: false },
  });
};

export const useCheckUssdStatus = () => {
  return useMutation({
    mutationFn: (transID: string) => api.checkUssdStatus(transID),
    meta: { toastError: false },
    onError: (err) => {
      notify.modal({
        type: 'error',
        title: 'Request failed',
        message: err?.message ?? 'Failed to check payment status',
      });
    },
  });
};

export const useCheckTransferStatus = () => {
  return useMutation({
    mutationFn: (transID: string) => api.checkTransferStatus(transID),
    meta: { toastError: false },
    onError: (err) => {
      notify.modal({
        type: 'error',
        title: 'Request failed',
        message: err?.message ?? 'Failed to check payment status',
      });
    },
  });
};

export const useCheckCard3dsStatus = () => {
  return useMutation({
    mutationFn: (data: { transID: string; otp: string }) => api.checkCard3dsStatus(data),
    meta: { toastError: false },
    onError: (err) => {
      notify.modal({
        type: 'error',
        title: 'Request failed',
        message: err?.message ?? 'Failed to check payment status',
      });
    },
  });
};
