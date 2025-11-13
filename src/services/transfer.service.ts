import { RequestService } from './api/client';
import { PaymentEndpoints } from './api/endpoints';
import { logger } from './logger.service';
import type { TransferListResponse } from '@/interface/transfer.interface';

/**
 * Transfer Service
 * Provides high-level transfer/transaction management methods
 */
class TransferService {
  /**
   * Get all transfers with pagination and filters
   * @param params - Query parameters (pageNumber, startDate, endDate, destinationAccountNumber, filterByOrganization, amount, search, filteredByStatus, format)
   * @returns Paginated transfer list response or Blob for file exports
   */
  async getTransfersNew(params?: {
    pageNumber?: number;
    startDate?: string;
    endDate?: string;
    destinationAccountNumber?: string;
    filterByOrganization?: string;
    amount?: number;
    search?: string;
    filteredByStatus?: string;
    format?: 'json' | 'file-export';
  }): Promise<TransferListResponse | Blob> {
    const format = params?.format || 'json';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (params?.pageNumber) {
      queryParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params?.destinationAccountNumber) {
      queryParams.append('destinationAccountNumber', params.destinationAccountNumber);
    }
    if (params?.filterByOrganization) {
      queryParams.append('filterByOrganization', params.filterByOrganization);
    }
    if (params?.amount) {
      queryParams.append('amount', params.amount.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search.trim());
    }
    if (params?.filteredByStatus) {
      queryParams.append('filteredByStatus', params.filteredByStatus);
    }
    
    const queryString = queryParams.toString();
    const url = `${PaymentEndpoints.getTransfersNew(format)}${queryString ? `?${queryString}` : ''}`;
    
    // For file exports, return blob
    if (format === 'file-export') {
      return await RequestService.getBlob(url);
    }
    
    // For JSON responses, return parsed data
    const res = await RequestService.get<TransferListResponse>(url);
    
    logger.debug('TransferService.getTransfersNew - Raw Response', res);
    
    if (res && typeof res === 'object' && 'data' in res) {
      const transferResponse = res as TransferListResponse;
      return transferResponse;
    }
    
    throw new Error('Invalid transfer list response');
  }

  /**
   * Export transfers to file (CSV/Excel)
   * @param params - Query parameters (same as getTransfersNew)
   * @returns Blob file for download
   */
  async exportTransfers(params?: {
    pageNumber?: number;
    startDate?: string;
    endDate?: string;
    destinationAccountNumber?: string;
    filterByOrganization?: string;
    amount?: number;
    search?: string;
    filteredByStatus?: string;
  }): Promise<Blob> {
    return await this.getTransfersNew({
      ...params,
      format: 'file-export',
    }) as Blob;
  }
}

export default new TransferService();

