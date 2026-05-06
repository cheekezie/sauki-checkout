import type { CheckoutStatusState } from '@/features/checkout/components/StatusPage';
import { clearTransferCache } from '@/utils/transferCache';
import { object } from 'joi';
import { useNavigate, useParams } from 'react-router-dom';

interface VerificationMeta {
  amount?: number;
  merchant?: string;
  customer?: string;
  redirectUrl?: string;
}

type PaymentStatus = 'success' | 'fail' | 'pending' | string;

interface StatusResponse {
  message: string;
  data: {
    paymentStatus: PaymentStatus;
    redirectUrl?: string;
    [key: string]: any;
  };
}

const parseUrlData = (input: string) => {
  if (!input) {
    return {
      hasValidBaseUrl: false,
      base: null,
      params: {},
    };
  }


  const [base, queryString] = input.split('?');

  // check if base is a valid URL
  let hasValidBaseUrl = false;

  try {
    if (base && base !== 'null') {
      new URL(base);
      hasValidBaseUrl = true;
    }
  } catch {
    hasValidBaseUrl = false;
  }

  // parse query params
  const params = queryString
    ? Object.fromEntries(new URLSearchParams(queryString).entries())
    : {};

  return {
    hasValidBaseUrl,
    base: hasValidBaseUrl ? base : null,
    params,
  };
}

export function usePaymentVerification(meta: VerificationMeta = {}) {
  const navigate = useNavigate();
  const { ref } = useParams<{ ref: string }>();
  const verify = (res: StatusResponse) => {

    const redirectUrl = res.data.redirectUrl ?? '';
    const { params, hasValidBaseUrl } = parseUrlData(redirectUrl);
    const paramStatus = params?.status ?? '';
    const status = (res.data.paymentStatus ?? paramStatus ?? '').toLowerCase();

    if (status === 'success' || status === 'fail') {
      const state: CheckoutStatusState = {
        status,
        amount: meta.amount,
        merchant: meta.merchant,
        customer: meta.customer,
        redirectUrl: hasValidBaseUrl ? redirectUrl : '',
      };
      clearTransferCache(ref ?? '')
      navigate(`/status/${ref}`, { state });
    }

    return status;
  };

  return { verify };
}

// Alternative verification that allows only success to go through to status
export function usePaymentVerificationAlt(meta: VerificationMeta = {}) {
  const navigate = useNavigate();
  const { ref } = useParams<{ ref: string }>();
  const verify = (res: StatusResponse) => {

    const redirectUrl = res.data.redirectUrl ?? '';
    const { params, hasValidBaseUrl } = parseUrlData(redirectUrl);
    const paramStatus = params?.status ?? '';
    const status = (res.data.paymentStatus ?? paramStatus ?? '').toLowerCase();

    if (status.includes('success')) {
      const state: CheckoutStatusState = {
        status: 'success',
        amount: meta.amount,
        merchant: meta.merchant,
        customer: meta.customer,
        redirectUrl: hasValidBaseUrl ? redirectUrl : '',
      };
      navigate(`/status/${ref}`, { state });
    }

    return status;
  };

  return { verify };
}
