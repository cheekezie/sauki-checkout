import type { CheckoutStatusState } from '@/features/checkout/components/StatusPage';
import { object } from 'joi';
import { useNavigate, useParams } from 'react-router-dom';

interface VerificationMeta {
  amount?: number;
  merchant?: string;
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
    const status = res.data.paymentStatus;

    const redirectUrl = res.data.redirectUrl ?? '';
    const { params, hasValidBaseUrl } = parseUrlData(redirectUrl);
    const paramStatus = params?.status
    console.log({ params, hasValidBaseUrl, paramStatus });

    const allowed = ['success', 'fail'];
    if (allowed.includes(status) || paramStatus === 'fail') {
      const state: CheckoutStatusState = {
        status: status ?? paramStatus,
        amount: meta.amount,
        merchant: meta.merchant,
        redirectUrl: hasValidBaseUrl ? redirectUrl : '',
      };
      navigate(`/${ref}/status`, { state });
    }

    return status;
  };

  return { verify };
}
