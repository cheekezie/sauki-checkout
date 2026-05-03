import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '@/config/constants';
import type { CheckoutStatusState } from '@/features/checkout/components/StatusPage';

interface TransferVerificationEvent {
  status: boolean;
  message: string;
  redirectUrl: string;
}

interface Meta {
  amount?: number;
  merchant?: string;
  customer?: string;
}

const getSocketUrl = () => {
  try {
    const url = new URL(API_BASE_URL);
    return url.origin;
  } catch {
    return API_BASE_URL;
  }
};

export function useTransferSocket(
  transactionId: string,
  meta: Meta = {},
  onVerified: (state: CheckoutStatusState) => void,
) {
  useEffect(() => {
    if (!transactionId) return;

    const socket = io(getSocketUrl(), { transports: ['polling', 'websocket'] });

    socket.on('connect', () => {
      console.log('[TransferSocket] connected, joining room:', transactionId);
      socket.emit('join', transactionId);
    });

    socket.on('connect_error', (err) => {
      console.error('[TransferSocket] connection error:', err.message);
    });

    socket.on('transfer-payment-verification', (event: TransferVerificationEvent) => {
      console.log('status:', event);

      const status = event.status ? 'success' : 'fail';
      let redirectUrl = '';

      if (event.redirectUrl) {
        try {
          new URL(event.redirectUrl);
          redirectUrl = event.redirectUrl;
        } catch {
          redirectUrl = '';
        }
      }

      onVerified({ status, amount: meta.amount, merchant: meta.merchant, customer: meta.customer, redirectUrl });
    });

    return () => {
      socket.disconnect();
    };
  }, [transactionId]);
}
