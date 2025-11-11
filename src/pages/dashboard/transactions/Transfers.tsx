import { useState, useMemo } from "react";
import DataTable from "@/components/ui/DataTable";
import type { DataTableColumn } from "@/interface/ui.interface";
import { useTransfers } from "@/hooks/useTransfers";
import { useOrg } from "@/hooks/useOrg";
import { useToast } from "@/hooks/useToast";
import TransferService from "@/services/transfer.service";
import type { TransferType } from "@/interface/transfer.interface";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";
import TransferDetailsModal from "@/components/modals/TransferDetailsModal";

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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferType | null>(
    null
  );

  // Fetch transfers - don't pass pageNumber to get all transfers, then paginate client-side
  const { transfers, pagination, isLoading, isError, error } = useTransfers(
    {
      // Don't pass pageNumber - API should return all transfers
      filterByOrganization: activeOrgId || undefined,
    },
    !!activeOrgId
  );

  // Map transfers to include flattened properties for filtering
  const transferDataWithFlattenedProps = useMemo(() => {
    return transfers.map((transfer) => ({
      ...transfer,
      // Flatten nested properties for filtering
      studentName: transfer.student?.fullName || "",
      accountName: transfer.virtualAccount?.accountName || "",
      bankName: transfer.virtualAccount?.bankName || "",
    }));
  }, [transfers]);

  // Get unique values for filter options
  const statusOptions = useMemo(() => {
    const uniqueStatuses = Array.from(
      new Set(transfers.map((t) => t.status?.toLowerCase()).filter(Boolean))
    );
    return uniqueStatuses.map((status) => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    }));
  }, [transfers]);

  const providerOptions = useMemo(() => {
    const uniqueProviders = Array.from(
      new Set(transfers.map((t) => t.provider).filter(Boolean))
    );
    return uniqueProviders.map((provider) => ({
      value: provider,
      label: provider.charAt(0).toUpperCase() + provider.slice(1),
    }));
  }, [transfers]);

  const bankOptions = useMemo(() => {
    const uniqueBanks = Array.from(
      new Set(transfers.map((t) => t.virtualAccount?.bankName).filter(Boolean))
    );
    return uniqueBanks.map((bank) => ({
      value: bank,
      label: bank,
    }));
  }, [transfers]);

  // Define columns
  const columns: DataTableColumn<TransferTableData>[] = useMemo(
    () => [
      {
        key: "sn",
        title: "S/N",
        sortable: false,
        width: "80px",
        align: "center",
        render: (_value: any, _record: TransferTableData, index: number) => {
          // Calculate serial number based on current page
          const serialNumber = (currentPage - 1) * pageSize + index + 1;
          return <span className="text-gray-600">{serialNumber}</span>;
        },
      },
      {
        key: "reference",
        title: "Reference",
        sortable: true,
        filterable: true,
        filterType: "text",
        filterPlaceholder: "Search by reference...",
        width: "150px",
      },
      {
        key: "studentName",
        title: "Student",
        sortable: true,
        filterable: true,
        filterType: "text",
        filterPlaceholder: "Search by student name...",
        render: (_value: any, row: TransferTableData) => {
          if (row.student?.fullName) {
            return <span className="font-medium">{row.student.fullName}</span>;
          }
          return <span>-</span>;
        },
      },
      {
        key: "accountName",
        title: "Account Name",
        sortable: false,
        filterable: true,
        filterType: "text",
        filterPlaceholder: "Search by account name...",
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
        filterable: true,
        filterType: "select",
        filterOptions: bankOptions,
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
        filterable: true,
        filterType: "text",
        filterPlaceholder: "Search by sender name...",
      },
      {
        key: "day",
        title: "Date",
        sortable: true,
        filterable: true,
        filterType: "date",
        render: (value: string) => (
          <span className="text-gray-600">{formatDate(value)}</span>
        ),
      },
      {
        key: "status",
        title: "Status",
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: statusOptions,
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
        filterable: true,
        filterType: "select",
        filterOptions: providerOptions,
        render: (value: string) => (
          <span className="text-gray-600 capitalize">{value}</span>
        ),
      },
    ],
    [currentPage, pageSize, statusOptions, providerOptions, bankOptions]
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
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
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
        data={transferDataWithFlattenedProps as TransferTableData[]}
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
          total: pagination?.transferCount || transfers.length,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
          showQuickJumper: true,
          showTotal: (total: number, range: [number, number]) =>
            `Showing ${range[0]}-${range[1]} of ${total} transfers`,
        }}
        onPageChange={handlePageChange}
        exportable={true}
        exportFileName="transfers"
        onExport={handleExport}
        emptyText="No transfers found"
        loadingText="Loading transfers..."
        onRowClick={(row: TransferTableData) => {
          // Find the original transfer from the transfers array
          const transfer = transfers.find((t) => t._id === row._id);
          if (transfer) {
            setSelectedTransfer(transfer);
            setIsDetailsModalOpen(true);
          }
        }}
        hoverable={true}
      />

      {selectedTransfer && (
        <TransferDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedTransfer(null);
          }}
          transfer={selectedTransfer}
        />
      )}
    </DashboardPageLayout>
  );
};

export default Transfers;
