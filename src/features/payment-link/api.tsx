import { PaymentEndpoints, RequestService } from '@/services';

/**
 * Payment Link Request Interface
 */
export interface CreatePaymentLinkRequest {
  title: string;
  description?: string;
  amount: number;
  currency: string;
  expiresInSec?: number;
  maxUses?: number;
  isOneTime?: boolean;
  redirectSuccessUrl?: string;
  redirectFailureUrl?: string;
}

/**
 * Payment Link Response Interface
 */
export interface PaymentLink {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  status?: 'active' | 'cancelled' | 'expired';
  expiresInSec?: number;
  maxUses?: number;
  isOneTime?: boolean;
  redirectSuccessUrl?: string;
  redirectFailureUrl?: string;
  paymentLinkId?: string;
  link?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface PublicPaymentLinkI {
  amount: number;
  business: {
    _id: string;
    businessCode: string;
    businessName: string;
  };
  currency: string; // NGN
  description: string;
  slug: string;
  title: string;
  status?: 'active' | 'cancelled' | 'expired';
}

/**
 * Payment Link Details Response
 */
export interface PaymentLinkDetailsResponse {
  status: string;
  message: string;
  data?: {
    paymentLink?: PaymentLink;
    transactions?: any[];
    pagination?: {
      page: number;
      pages: number;
      count: number;
    };
    [key: string]: any;
  };
}

interface PaymentLinkDataI {
  page: number;
  pages: number;
  count: number;
  paymentLinks: PaymentLink[];
}

export interface PaymentLinkQueryI {
  pageNumber?: number;
  filteredByStatus?: 'active' | 'cancelled' | 'expired';
  search?: string;
}
class PaymentService {
  /**
   * Get Payment Link Details
   * Fetches details of a specific payment link including transactions
   *
   * Endpoint: GET /pay/payment-links-details/:paymentLinkId
   *
   * @param paymentLinkId - The ID of the payment link
   * @param pageNumber - Page number for transactions
   * @returns Payment link details
   */
  async getPaymentLinkDetails(paymentLinkId: string, pageNumber: number = 1) {
    return RequestService.get<PaymentLinkDetailsResponse>(PaymentEndpoints.getPaymentLinkDetails(paymentLinkId), {
      pageNumber,
    });
  }

  async getPaymentLinkPublic(slug: string) {
    return RequestService.get<{ link: PublicPaymentLinkI }>(PaymentEndpoints.getPublicLink(slug));
  }

  async initiatePayment(slug: string, data: { fullName: string; email: string; phoneNumber: string }) {
    return RequestService.post<{
      checkoutData: {
        accessCode: string;
        checkout: string;
        reference: string;
      };
    }>(PaymentEndpoints.initiatePayment(slug), data, false, false);
  }
}

export default new PaymentService();
