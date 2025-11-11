import DataTable from "../../../components/ui/DataTable";
import type {
  DataTableColumn,
  DataTableAction,
} from "../../../interface/ui.interface";
import { useState } from "react";
import { CreditCard } from "lucide-react";
import DetailsModal from "../../../components/modals/DetailsModal";
import { formatTableDate } from "@/utils/tableFormatters";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

interface TransactionData {
  id: string;
  sn: number;
  student: string;
  fee: string;
  phone: string;
  session: string;
  semester: string;
  amount: string;
  accountType: string;
  date: string;
  status: "completed" | "pending" | "failed";
  settlement: string;
}

type TransactionTableRow = TransactionData & Record<string, unknown>;

const Transactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionTableRow | null>(null);
  const transactionData: TransactionTableRow[] = [
    {
      id: "1",
      sn: 1,
      student: "John Doe",
      fee: "Tuition",
      phone: "08012345678",
      session: "23/24",
      semester: "1st",
      amount: "₦150,000",
      accountType: "Savings",
      date: "2024-01-15",
      status: "completed",
      settlement: "Instant",
    },
    {
      id: "2",
      sn: 2,
      student: "Jane Smith",
      fee: "Library",
      phone: "08087654321",
      session: "23/24",
      semester: "1st",
      amount: "₦25,000",
      accountType: "Current",
      date: "2024-01-14",
      status: "pending",
      settlement: "T+1",
    },
    {
      id: "3",
      sn: 3,
      student: "Mike Johnson",
      fee: "Hostel",
      phone: "08098765432",
      session: "23/24",
      semester: "1st",
      amount: "₦80,000",
      accountType: "Savings",
      date: "2024-01-13",
      status: "completed",
      settlement: "Instant",
    },
    {
      id: "4",
      sn: 4,
      student: "Sarah Wilson",
      fee: "Exam",
      phone: "08054321098",
      session: "23/24",
      semester: "2nd",
      amount: "₦15,000",
      accountType: "Current",
      date: "2024-01-12",
      status: "failed",
      settlement: "T+2",
    },
    {
      id: "5",
      sn: 5,
      student: "David Brown",
      fee: "Transport",
      phone: "08011111111",
      session: "23/24",
      semester: "1st",
      amount: "₦30,000",
      accountType: "Savings",
      date: "2024-01-11",
      status: "completed",
      settlement: "Instant",
    },
    {
      id: "6",
      sn: 6,
      student: "Lisa Davis",
      fee: "Sports",
      phone: "08022222222",
      session: "23/24",
      semester: "2nd",
      amount: "₦10,000",
      accountType: "Current",
      date: "2024-01-10",
      status: "pending",
      settlement: "T+1",
    },
    {
      id: "7",
      sn: 7,
      student: "Tom Wilson",
      fee: "Medical",
      phone: "08033333333",
      session: "23/24",
      semester: "1st",
      amount: "₦20,000",
      accountType: "Savings",
      date: "2024-01-09",
      status: "completed",
      settlement: "Instant",
    },
    {
      id: "8",
      sn: 8,
      student: "Emma Johnson",
      fee: "ICT",
      phone: "08044444444",
      session: "23/24",
      semester: "2nd",
      amount: "₦35,000",
      accountType: "Current",
      date: "2024-01-08",
      status: "failed",
      settlement: "T+2",
    },
  ];

  const columns: DataTableColumn<TransactionTableRow>[] = [
    {
      key: "sn",
      title: "S/N",
      sortable: true,
      width: "50px",
      align: "center",
    },
    {
      key: "student",
      title: "Student",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search student...",
      width: "110px",
    },
    {
      key: "fee",
      title: "Fee Type",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "Tuition", label: "Tuition Fee" },
        { value: "Library", label: "Library Fee" },
        { value: "Hostel", label: "Hostel Fee" },
        { value: "Exam", label: "Exam Fee" },
        { value: "Transport", label: "Transportation Fee" },
        { value: "Sports", label: "Sports Fee" },
        { value: "Medical", label: "Medical Fee" },
        { value: "ICT", label: "ICT Fee" },
      ],
      width: "90px",
    },
    {
      key: "phone",
      title: "Phone Number",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search phone...",
      width: "100px",
    },
    {
      key: "session",
      title: "Session",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "23/24", label: "23/24" },
        { value: "24/25", label: "24/25" },
      ],
      width: "70px",
    },
    {
      key: "semester",
      title: "Semester",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "1st", label: "1st" },
        { value: "2nd", label: "2nd" },
      ],
      width: "70px",
    },
    {
      key: "amount",
      title: "Amount",
      sortable: true,
      filterable: true,
      filterType: "number",
      align: "center",
      width: "90px",
    },
    {
      key: "accountType",
      title: "Account Type",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "Savings", label: "Savings" },
        { value: "Current", label: "Current" },
      ],
      width: "80px",
    },
    {
      key: "date",
      title: "Date",
      sortable: true,
      filterable: true,
      filterType: "date",
      width: "80px",
      render: (value) => (
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
      ],
      align: "center",
      width: "80px",
      render: (value) => {
        const statusColors = {
          completed: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          failed: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-semibold ${
              statusColors[value as keyof typeof statusColors]
            }`}
          >
            <span className="text-xs font-mono">
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          </span>
        );
      },
    },
    {
      key: "settlement",
      title: "Settlement",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "Instant", label: "Instant" },
        { value: "T+1", label: "T+1" },
        { value: "T+2", label: "T+2" },
      ],
      align: "center",
      width: "80px",
    },
  ];

  const actions: DataTableAction<TransactionTableRow>[] = [];

  return (
    <DashboardPageLayout
      title="Transactions"
      description="Manage and track all payment transactions"
    >
      <>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-sm text-gray-600">Total Transactions</div>
              <div className="text-2xl font-bold text-gray-900">
                {transactionData.length}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-sm text-gray-600">Total Amount</div>
              <div className="text-2xl font-bold text-gray-900">
                ₦
                {transactionData
                  .reduce((sum, t) => {
                    const amount = parseInt(t.amount.replace(/[₦,]/g, ""));
                    return sum + amount;
                  }, 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <DataTable<TransactionTableRow>
          data={transactionData}
          columns={columns}
          actions={actions}
          loading={false}
          searchable
          exportable
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: transactionData.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `Showing ${range[0]}-${range[1]} of ${total} transactions`,
          }}
          onPageChange={(page: number, newPageSize: number) => {
            setCurrentPage(page);
            if (newPageSize !== pageSize) {
              setPageSize(newPageSize);
            }
          }}
          onRowClick={(row: TransactionTableRow) => {
            setSelectedTransaction(row);
            setIsDetailsModalOpen(true);
          }}
          exportFileName="transactions"
          striped
          hoverable
          bordered={false}
          size="small"
          emptyText="No transactions found"
          loadingText="Loading transactions..."
          columnManagement
          className="text-xs"
        />

        {selectedTransaction && (
          <DetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedTransaction(null);
            }}
            title="Transaction Details"
            subtitle="View transaction information"
            icon={<CreditCard className="w-5 h-5 text-primary" />}
            data={selectedTransaction}
            fields={[
              { key: "student", label: "Student" },
              { key: "fee", label: "Fee Type" },
              { key: "phone", label: "Phone Number" },
              { key: "session", label: "Session" },
              { key: "semester", label: "Semester" },
              { key: "amount", label: "Amount" },
              { key: "accountType", label: "Account Type" },
              { key: "date", label: "Date" },
              { key: "status", label: "Status" },
              { key: "settlement", label: "Settlement" },
            ]}
          />
        )}
      </>
    </DashboardPageLayout>
  );
};

export default Transactions;
