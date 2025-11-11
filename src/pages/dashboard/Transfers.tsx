import { useState, useMemo } from "react";
import DataTable from "@/components/ui/DataTable";
import type { DataTableColumn } from "@/interface/ui.interface";
import { useTransfers } from "@/hooks/useTransfers";
import { useOrg } from "@/hooks/useOrg";
import { useToast } from "@/hooks/useToast";
import TransferService from "@/services/transfer.service";
import type { TransferType } from "@/interface/transfer.interface";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Helper function to get status badge color
 */
const getStatusColor = (status: string): string => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === "success") return "bg-green-100 text-green-800";
  if (lowerStatus === "pending") return "bg-yellow-100 text-yellow-800";
  if (lowerStatus === "failed") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

// Create a type that satisfies Record<string, unknown> constraint
type TransferTableData = TransferType & Record<string, unknown>;

const Transfers = () => {
  const { activeOrgId } = useOrg();
  const { showError, showSuccess } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch transfers - DataTable handles search internally, so we don't need searchTerm state
  const { transfers, pagination, isLoading, isError, error } = useTransfers(
    {
      pageNumber: currentPage,
      filterByOrganization: activeOrgId || undefined,
    },
    !!activeOrgId
  );

  // Define columns
  const columns: DataTableColumn<TransferTableData>[] = useMemo(
    () => [
      {
        key: "reference",
        title: "Reference",
        sortable: true,
        width: "150px",
      },
      {
        key: "student",
        title: "Student",
        sortable: true,
        render: (value: any) => {
          if (typeof value === "object" && value?.fullName) {
            return <span className="font-medium">{value.fullName}</span>;
          }
          return <span>-</span>;
        },
      },
      {
        key: "accountName",
        title: "Account Name",
        sortable: false,
        render: (_value: any, row: TransferTableData) => {
          if (row.virtualAccount?.accountName) {
            return <span>{row.virtualAccount.accountName}</span>;
          }
          return <span>-</span>;
        },
      },
      {
        key: "bankName",
        title: "Bank",
        sortable: false,
        render: (_value: any, row: TransferTableData) => {
          if (row.virtualAccount?.bankName) {
            return (
              <span className="text-gray-600">
                {row.virtualAccount.bankName}
              </span>
            );
          }
          return <span>-</span>;
        },
      },
      {
        key: "transactionAmount",
        title: "Amount",
        sortable: true,
        align: "right",
        render: (value: number) => (
          <span className="font-semibold">{formatCurrency(value)}</span>
        ),
      },
      {
        key: "amountReceived",
        title: "Received",
        sortable: true,
        align: "right",
        render: (value: number) => (
          <span className="text-green-600">{formatCurrency(value)}</span>
        ),
      },
      {
        key: "incurredFee",
        title: "Fee",
        sortable: true,
        align: "right",
        render: (value: number) => (
          <span className="text-red-600">{formatCurrency(value)}</span>
        ),
      },
      {
        key: "senderName",
        title: "Sender",
        sortable: true,
      },
      {
        key: "day",
        title: "Date",
        sortable: true,
        render: (value: string) => (
          <span className="text-gray-600">{formatDate(value)}</span>
        ),
      },
      {
        key: "status",
        title: "Status",
        sortable: true,
        render: (value: string) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              value
            )}`}
          >
            {value.toUpperCase()}
          </span>
        ),
      },
      {
        key: "provider",
        title: "Provider",
        sortable: true,
        render: (value: string) => (
          <span className="text-gray-600 capitalize">{value}</span>
        ),
      },
    ],
    []
  );

  // Handle export
  const handleExport = async (
    _data: TransferTableData[],
    _format: "csv" | "excel"
  ) => {
    try {
      const blob = await TransferService.exportTransfers({
        filterByOrganization: activeOrgId || undefined,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transfers-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccess("Export Successful", "Transfers exported successfully");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to export transfers";
      showError("Export Failed", errorMessage);
    }
  };

  // Handle pagination change
  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  // Show warning if no organization selected
  if (!activeOrgId) {
    return (
      <DashboardPageLayout title="Transfers">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Please select an organization to view transfers.
          </p>
        </div>
      </DashboardPageLayout>
    );
  }

  // Prepare stats for dashboard layout
  const stats = pagination
    ? [
        {
          label: "Total Transfers",
          value: pagination.transferCount.toString(),
        },
        {
          label: "Total Received",
          value: formatCurrency(pagination.totalAmountReceived),
          valueClassName: "text-green-600",
        },
        {
          label: "Total Fees",
          value: formatCurrency(pagination.totalFeeIncurred),
          valueClassName: "text-red-600",
        },
      ]
    : undefined;

  return (
    <DashboardPageLayout
      title="Transfers"
      description="View and manage all payment transfers and transactions"
      stats={stats}
    >
      <DataTable<TransferTableData>
        data={transfers as TransferTableData[]}
        columns={columns}
        loading={isLoading}
        error={
          isError
            ? (error as Error)?.message || "Failed to load transfers"
            : undefined
        }
        rowKey="_id"
        searchable={true}
        searchPlaceholder="Search by reference, student name, sender..."
        searchFields={["reference", "senderName"]}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: pagination?.transferCount || 0,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        onPageChange={handlePageChange}
        exportable={true}
        exportFileName="transfers"
        onExport={handleExport}
        emptyText="No transfers found"
        loadingText="Loading transfers..."
      />
    </DashboardPageLayout>
  );
};

export default Transfers;
