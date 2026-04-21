import { RequestService } from '@/services';

interface TransactionI {
  transID: string;
  amount: number;
  customer: string;
  environment: string;
  businessName: string;
  paymentMethods: PaymentMethods;
}

interface PaymentMethods {
  cards: boolean;
  transfers: boolean;
  ussd: boolean;
  mobileMoney: boolean;
}

interface BankI {
  name: string;
  code: string;
  cbnCode: string;
}

export interface UssdPayloadI {
  bankCode: string;
  bank: string;
  transID: string;
}

class CheckoutApiService {
  async getCheckoutData(ref: string) {
    return RequestService.get<{ transaction: TransactionI }>('/transaction/checkout/' + ref);
  }

  async getBankList() {
    return RequestService.get<{ data: BankI[] }>('/config/ussd-bank-list-c');
  }

  async initiateUssdPayment(data: UssdPayloadI) {
    return RequestService.post<any>('/transaction/checkout/ussd-init', data);
  }

  async initiatePayment(data: any) {
    return RequestService.post<{
      checkoutData: {
        accessCode: string;
        checkout: string;
        reference: string;
      };
    }>('', data);
  }
}

export default new CheckoutApiService();
