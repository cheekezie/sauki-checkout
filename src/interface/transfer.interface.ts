/**
 * Transfer Type
 * Represents a single transfer/transaction record
 */
export interface TransferType {
  _id: string;
  reference: string;
  student: {
    _id: string;
    fullName: string;
  };
  virtualAccount: {
    accountName: string;
    bankName: string;
  };
  transactionAmount: number;
  amountReceived: number;
  amountSettled: number;
  incurredFee: number;
  senderName: string;
  day: string;
  date: string;
  status: string;
  provider: string;
}

/**
 * Transfer List Response
 * API response wrapper for paginated transfer list
 */
export interface TransferListResponse {
  status: string;
  data: {
    page: number;
    pages: number;
    transferCount: number;
    totalAmountReceived: string;
    totalNetAmount: string;
    totalFeeIncurred: string;
    transfers: TransferType[];
  };
}


