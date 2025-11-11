import {
  X,
  CreditCard,
  User,
  Building,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Portal } from "../layout/Portal";
import type { TransferType } from "@/interface/transfer.interface";

interface TransferDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: TransferType;
}

/**
 * Helper function to format currency
 */
const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(numAmount);
};

/**
 * Helper function to format date
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Helper function to get status icon and color
 */
const getStatusIcon = (status: string) => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === "success") {
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  }
  if (lowerStatus === "failed") {
    return <XCircle className="w-5 h-5 text-red-600" />;
  }
  return <Clock className="w-5 h-5 text-yellow-600" />;
};

const getStatusColor = (status: string): string => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === "success") return "bg-green-100 text-green-800";
  if (lowerStatus === "pending") return "bg-yellow-100 text-yellow-800";
  if (lowerStatus === "failed") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

const TransferDetailsModal = ({
  isOpen,
  onClose,
  transfer,
}: TransferDetailsModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={handleBackdropClick}
      >
        <div
          className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-offwhite flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-dark">
                  Transfer Details
                </h2>
                <p className="text-sm text-dark/70">{transfer.reference}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-dark" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(transfer.status)}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    transfer.status
                  )}`}
                >
                  {transfer.status.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Transaction Amount</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(transfer.transactionAmount)}
                </p>
              </div>
            </div>

            {/* Transfer Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Student Information</span>
                </h3>
                <div className="space-y-3 pl-6">
                  <div>
                    <p className="text-xs text-gray-500">Student Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {transfer.student?.fullName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Student ID</p>
                    <p className="text-sm font-medium text-gray-900">
                      {transfer.student?._id || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Account Information</span>
                </h3>
                <div className="space-y-3 pl-6">
                  <div>
                    <p className="text-xs text-gray-500">Account Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {transfer.virtualAccount?.accountName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bank Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {transfer.virtualAccount?.bankName || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Transaction Details</span>
                </h3>
                <div className="space-y-3 pl-6">
                  <div>
                    <p className="text-xs text-gray-500">Amount Received</p>
                    <p className="text-sm font-medium text-green-600">
                      {formatCurrency(transfer.amountReceived)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Amount Settled</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(transfer.amountSettled)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fee Incurred</p>
                    <p className="text-sm font-medium text-red-600">
                      {formatCurrency(transfer.incurredFee)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transfer Metadata */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Transfer Metadata</span>
                </h3>
                <div className="space-y-3 pl-6">
                  <div>
                    <p className="text-xs text-gray-500">Reference</p>
                    <p className="text-sm font-medium text-gray-900 font-mono">
                      {transfer.reference}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sender Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {transfer.senderName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Provider</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {transfer.provider || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(transfer.date || transfer.day)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default TransferDetailsModal;

