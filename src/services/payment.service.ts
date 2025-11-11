import { RequestService } from './api/client';
import { PaymentEndpoints } from './api/endpoints';

/**
 * Payment Gateway Interface
 */
export interface PaymentGateway {
  _id?: string;
  id?: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  lockStatus: 'locked' | 'unlocked';
  [key: string]: any;
}

/**
 * Payment Gateway Response
 */
export interface PaymentGatewayResponse {
  status?: string;
  data?: PaymentGateway[];
  gateways?: PaymentGateway[];
}

/**
 * Transfer Simulation Request
 */
export interface SimulateTransferRequest {
  virtualAccountNumber: string;
  amount: number;
}

/**
 * Transfer Simulation Response
 */
export interface SimulateTransferResponse {
  status?: string;
  message?: string;
  data?: any;
}

/**
 * Profit Sharing Account
 */
export interface ProfitSharingAccount {
  _id?: string;
  id?: string;
  name: string;
  accountNumber: string;
  bank: string;
  amount: number;
  status: 'active' | 'inactive' | 'pending';
  [key: string]: any;
}

/**
 * Profit Sharing Account Response
 */
export interface ProfitSharingAccountResponse {
  status?: string;
  data?: ProfitSharingAccount[];
  accounts?: ProfitSharingAccount[];
}

/**
 * Create Profit Sharing Account Request
 */
export interface CreateProfitSharingAccountRequest {
  name: string;
  accountNumber: string;
  bank: string;
  amount: number;
}

/**
 * Pricing Configuration
 */
export interface PricingConfig {
  _id?: string;
  id?: string;
  type: 'fixed' | 'percentage' | 'range';
  price?: number;
  minRange?: number | null;
  maxRange?: number | null;
  percentage?: number;
  [key: string]: any;
}

/**
 * Pricing Response
 */
export interface PricingResponse {
  status?: string;
  data?: PricingConfig;
  pricing?: PricingConfig;
}

/**
 * Update Pricing Request
 */
export interface UpdatePricingRequest {
  type?: 'fixed' | 'percentage' | 'range';
  price?: number;
  minRange?: number | null;
  maxRange?: number | null;
  percentage?: number;
}

/**
 * Payment Service
 * Provides high-level payment management methods
 */
class PaymentService {
  /**
   * Get all payment gateways
   * @returns List of payment gateways
   */
  async getPaymentGateways(): Promise<PaymentGatewayResponse> {
    const response = await RequestService.get<PaymentGatewayResponse>(
      PaymentEndpoints.getPaymentGateways
    );
    return response;
  }

  /**
   * Simulate a successful transfer
   * @param payload - Transfer simulation data
   * @returns Simulation response
   */
  async simulateTransfer(
    payload: SimulateTransferRequest
  ): Promise<SimulateTransferResponse> {
    const response = await RequestService.post<SimulateTransferResponse>(
      PaymentEndpoints.simulateTransfer,
      payload
    );
    return response;
  }

  /**
   * Get all profit sharing accounts
   * @returns List of profit sharing accounts
   */
  async getProfitSharingAccounts(): Promise<ProfitSharingAccountResponse> {
    const response = await RequestService.get<ProfitSharingAccountResponse>(
      PaymentEndpoints.getProfitSharingAccounts
    );
    return response;
  }

  /**
   * Add a new profit sharing account
   * @param payload - Account data
   * @returns Created account response
   */
  async addProfitSharingAccount(
    payload: CreateProfitSharingAccountRequest
  ): Promise<ProfitSharingAccountResponse> {
    const response = await RequestService.post<ProfitSharingAccountResponse>(
      PaymentEndpoints.addProfitSharingAccount,
      payload
    );
    return response;
  }

  /**
   * Update a profit sharing account
   * @param id - Account ID
   * @param payload - Updated account data
   * @returns Updated account response
   */
  async updateProfitSharingAccount(
    id: string,
    payload: Partial<CreateProfitSharingAccountRequest>
  ): Promise<ProfitSharingAccountResponse> {
    const response = await RequestService.put<ProfitSharingAccountResponse>(
      PaymentEndpoints.updateProfitSharingAccount(id),
      payload
    );
    return response;
  }

  /**
   * Delete a profit sharing account
   * @param id - Account ID
   * @returns Deletion response
   */
  async deleteProfitSharingAccount(id: string): Promise<{ status?: string; message?: string }> {
    const response = await RequestService.delete<{ status?: string; message?: string }>(
      PaymentEndpoints.deleteProfitSharingAccount(id),
      {}
    );
    return response;
  }

  /**
   * Get pricing configuration
   * @param organizationId - Optional organization ID
   * @returns Pricing configuration
   */
  async getPricing(organizationId?: string): Promise<PricingResponse> {
    const response = await RequestService.get<PricingResponse>(
      PaymentEndpoints.getPricing(organizationId)
    );
    return response;
  }

  /**
   * Update pricing configuration
   * @param payload - Updated pricing data
   * @param organizationId - Optional organization ID
   * @returns Updated pricing response
   */
  async updatePricing(
    payload: UpdatePricingRequest,
    organizationId?: string
  ): Promise<PricingResponse> {
    const response = await RequestService.put<PricingResponse>(
      PaymentEndpoints.updatePricing(organizationId),
      payload
    );
    return response;
  }
}

export default new PaymentService();

