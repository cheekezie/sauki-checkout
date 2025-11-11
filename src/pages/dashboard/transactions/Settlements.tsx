import DataTable from "../../../components/ui/DataTable";
import type { DataTableColumn } from "../../../interface/ui.interface";
import { useState } from "react";
import { Banknote } from "lucide-react";
import DetailsModal from "../../../components/modals/DetailsModal";
import { formatTableDate } from "@/utils/tableFormatters";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

interface SettlementData {
  id: string;
  sn: number;
  school: string;
  accountNumber: string;
  bank: string;
  amount: string;
  transactions: number;
  date: string;
  status: "completed" | "pending" | "failed" | "processing";
}

type SettlementTableRow = SettlementData & Record<string, unknown>;

const Settlements = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] =
    useState<SettlementTableRow | null>(null);

  // Pending API integration: replace mock data with useSettlements hook and wire up loading states.
  const settlementData: SettlementTableRow[] = [
    {
      id: "1",
      sn: 1,
      school: "University of Lagos",
      accountNumber: "1234567890",
      bank: "First Bank",
      amount: "₦2,500,000",
      transactions: 45,
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "2",
      sn: 2,
      school: "Ahmadu Bello University",
      accountNumber: "2345678901",
      bank: "GTBank",
      amount: "₦1,800,000",
      transactions: 32,
      date: "2024-01-14",
      status: "pending",
    },
    {
      id: "3",
      sn: 3,
      school: "University of Ibadan",
      accountNumber: "3456789012",
      bank: "Access Bank",
      amount: "₦3,200,000",
      transactions: 67,
      date: "2024-01-13",
      status: "completed",
    },
    {
      id: "4",
      sn: 4,
      school: "Federal University of Technology",
      accountNumber: "4567890123",
      bank: "Zenith Bank",
      amount: "₦950,000",
      transactions: 18,
      date: "2024-01-12",
      status: "failed",
    },
    {
      id: "5",
      sn: 5,
      school: "Covenant University",
      accountNumber: "5678901234",
      bank: "UBA",
      amount: "₦1,500,000",
      transactions: 28,
      date: "2024-01-11",
      status: "processing",
    },
    {
      id: "6",
      sn: 6,
      school: "Babcock University",
      accountNumber: "6789012345",
      bank: "Fidelity Bank",
      amount: "₦2,100,000",
      transactions: 41,
      date: "2024-01-10",
      status: "completed",
    },
    {
      id: "7",
      sn: 7,
      school: "Lagos State University",
      accountNumber: "7890123456",
      bank: "Sterling Bank",
      amount: "₦1,750,000",
      transactions: 35,
      date: "2024-01-09",
      status: "pending",
    },
    {
      id: "8",
      sn: 8,
      school: "Obafemi Awolowo University",
      accountNumber: "8901234567",
      bank: "Union Bank",
      amount: "₦2,800,000",
      transactions: 52,
      date: "2024-01-08",
      status: "completed",
    },
    {
      id: "9",
      sn: 9,
      school: "University of Nigeria",
      accountNumber: "9012345678",
      bank: "Ecobank",
      amount: "₦1,200,000",
      transactions: 24,
      date: "2024-01-07",
      status: "processing",
    },
    {
      id: "10",
      sn: 10,
      school: "Bayero University",
      accountNumber: "0123456789",
      bank: "Keystone Bank",
      amount: "₦1,650,000",
      transactions: 31,
      date: "2024-01-06",
      status: "completed",
    },
  ];

  const columns: DataTableColumn<SettlementTableRow>[] = [
    {
      key: "sn",
      title: "S/N",
      sortable: true,
      width: "60px",
      align: "center",
    },
    {
      key: "school",
      title: "School",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search school...",
      width: "200px",
    },
    {
      key: "accountNumber",
      title: "Account Number",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search account...",
      width: "140px",
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: "bank",
      title: "Bank",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "First Bank", label: "First Bank" },
        { value: "GTBank", label: "GTBank" },
        { value: "Access Bank", label: "Access Bank" },
        { value: "Zenith Bank", label: "Zenith Bank" },
        { value: "UBA", label: "UBA" },
        { value: "Fidelity Bank", label: "Fidelity Bank" },
        { value: "Sterling Bank", label: "Sterling Bank" },
        { value: "Union Bank", label: "Union Bank" },
        { value: "Ecobank", label: "Ecobank" },
        { value: "Keystone Bank", label: "Keystone Bank" },
      ],
      width: "120px",
    },
    {
      key: "amount",
      title: "Amount",
      sortable: true,
      filterable: true,
      filterType: "number",
      align: "left",
      width: "130px",
      render: (value: string) => (
        <span className="font-semibold text-green-600">{value}</span>
      ),
    },
    {
      key: "transactions",
      title: "Transactions",
      sortable: true,
      filterable: true,
      filterType: "number",
      align: "center",
      width: "110px",
      render: (value: number) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      key: "date",
      title: "Date",
      sortable: true,
      filterable: true,
      filterType: "date",
      width: "100px",
      render: (value: string) => (
        <span className="text-xs font-mono">{formatTableDate(value)}</span>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "completed", label: "Completed" },
        { value: "pending", label: "Pending" },
        { value: "failed", label: "Failed" },
        { value: "processing", label: "Processing" },
      ],
      align: "center",
      width: "100px",
      render: (value: SettlementData["status"]) => {
        const statusColors: Record<SettlementData["status"], string> = {
          completed: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          failed: "bg-red-100 text-red-800",
          processing: "bg-blue-100 text-blue-800",
        };
        return (
          <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
              statusColors[value as SettlementData["status"]]
            }`}
          >
            <span className="text-xs font-mono">
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          </span>
        );
      },
    },
  ];

  return (
    <DashboardPageLayout
      title="Settlements"
      description="Manage and track settlement transactions with schools"
    >
      <>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-sm text-gray-600">Total Settlements</div>
              <div className="text-2xl font-bold text-gray-900">
                {settlementData.length}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-sm text-gray-600">Total Amount</div>
              <div className="text-2xl font-bold text-gray-900">
                ₦
                {settlementData
                  .reduce((sum, s) => {
                    const amount = parseInt(s.amount.replace(/[₦,]/g, ""));
                    return sum + amount;
                  }, 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <DataTable<SettlementTableRow>
          data={settlementData}
          columns={columns}
          loading={false}
          searchable
          exportable
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: settlementData.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `Showing ${range[0]}-${range[1]} of ${total} settlements`,
          }}
          onPageChange={(page: number, newPageSize: number) => {
            setCurrentPage(page);
            if (newPageSize !== pageSize) {
              setPageSize(newPageSize);
            }
          }}
          onRowClick={(row: SettlementTableRow) => {
            setSelectedSettlement(row);
            setIsDetailsModalOpen(true);
          }}
          exportFileName="settlements"
          striped
          hoverable
          bordered={false}
          size="small"
          emptyText="No settlements found"
          loadingText="Loading settlements..."
          columnManagement
          className="text-xs"
        />

        {selectedSettlement && (
          <DetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedSettlement(null);
            }}
            title="Settlement Details"
            subtitle="View settlement information"
            icon={<Banknote className="w-5 h-5 text-primary" />}
            data={selectedSettlement}
            fields={[
              { key: "school", label: "School" },
              { key: "accountNumber", label: "Account Number" },
              { key: "bank", label: "Bank" },
              { key: "amount", label: "Amount" },
              { key: "transactions", label: "Transactions" },
              { key: "date", label: "Date" },
              { key: "status", label: "Status" },
            ]}
          />
        )}
      </>
    </DashboardPageLayout>
  );
};

export default Settlements;
