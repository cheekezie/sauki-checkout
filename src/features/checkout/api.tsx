import { RequestService } from '@/services';
import { string } from 'joi';

interface TransactionI {
  transID: string;
  amount: number;
  customer: string;
  environment: string;
  businessName: string;
  businessLogo: string;
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
export interface CardPayloadI {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  pin?: string;
  transID: string;
}
export interface ChekoutDemoPayloadI {
  channel: 'BANK_TRANSFER' | 'USSD' | 'CARD';
  transID: string;
  status: 'FAIL' | 'SUCCESS';
}
interface ProcessChekoutDemoI {
  status: boolean;
  paymentStatus: string;
  channel: string;
  redirectUrl: string;
  supportMessage: string;
}
interface CheckStatusI {
  status: boolean;
  paymentStatus: string;
  transID: string;
  redirectUrl: string;
}

class CheckoutApiService {
  async getCheckoutData(ref: string) {
    return RequestService.get<{ transaction: TransactionI }>('/transaction/checkout/' + ref);
  }

  async getBankList() {
    return RequestService.get<{ data: BankI[] }>('/config/ussd-bank-list-c');
  }

  async initiateUssdPayment(data: UssdPayloadI) {
    return RequestService.post<{
      status: boolean;
      supportMessage: string;
      transID: string;
      ussdCode: string;
      redirectUrl: string;
    }>('/transaction/checkout/ussd-init', data);
  }

  async initiateCardPayment(data: CardPayloadI) {
    return RequestService.post<{
      status: boolean;
      supportMessage: string;
      transID: string;
      ussdCode: string;
      redirectUrl: string;
    }>('/transaction/checkout/card-init', data);
  }

  async initiateTransferPayment(transID: string) {
    return RequestService.post<{
      status: boolean;
      supportMessage: string;
      transID: string;
      ussdCode: string;
      redirectUrl: string;
      bankDetails: {
        accountName: string;
        accountNumber: string;
        bankName: string;
      };
    }>('/transaction/checkout/bank-transfer', { transID });
  }

  async checkUssdStatus(transID: string) {
    return RequestService.post<CheckStatusI>('/transaction/checkout/ussd-verify', { transID });
  }

  async checkTransferStatus(transID: string) {
    return RequestService.post<CheckStatusI>('/transaction/checkout/bank-transfer-verify', { transID });
  }

  async checkCard3dsStatus(payload: { transID: string; otp: string }) {
    return RequestService.post<CheckStatusI>('/transaction/checkout/card-3SD-verify', payload);
  }

  async processChekoutDemo(data: ChekoutDemoPayloadI) {
    return RequestService.post<ProcessChekoutDemoI>('/transaction/checkout/demo', data);
  }
}

export default new CheckoutApiService();
