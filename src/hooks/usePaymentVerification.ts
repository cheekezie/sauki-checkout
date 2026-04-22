import type { CheckoutStatusState } from '@/features/checkout/components/StatusPage';
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

export function usePaymentVerification(meta: VerificationMeta = {}) {
  const navigate = useNavigate();
  const { ref } = useParams<{ ref: string }>();
  const verify = (res: StatusResponse): PaymentStatus => {
    const status = res.data.paymentStatus;
    if (status === 'success' || status === 'fail') {
      const state: CheckoutStatusState = {
        status,
        amount: meta.amount,
        merchant: meta.merchant,
        redirectUrl: res.data.redirectUrl ?? meta.redirectUrl,
      };
      navigate(`/${ref}/status`, { state });
    }

    return status;
  };

  return { verify };
}
