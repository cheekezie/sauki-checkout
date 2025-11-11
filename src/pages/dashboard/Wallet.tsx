import { useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DataTable from "../../components/ui/DataTable";
import type { DataTableColumn } from "../../interface/ui.interface";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

interface TransactionData {
  id: string;
  sn: number;
  amount: string;
  type: "Credit" | "Debit";
  source: string;
  description: string;
  date: string;
}

type TransactionTableRow = TransactionData & Record<string, unknown>;

const Wallet = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentName = searchParams.get("studentName");
  const [activeTab, setActiveTab] = useState<"Inflow" | "Outflow">("Inflow");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Mock data for transactions
  const inflowTransactions: TransactionTableRow[] = [
    // Empty for now - will show "No records found" message
  ];

  const outflowTransactions: TransactionTableRow[] = [
    // Empty for now - will show "No records found" message
  ];

  const columns: DataTableColumn<TransactionTableRow>[] = [
    {
      key: "sn",
      title: "S/N",
      width: "80px",
      align: "center",
    },
    {
      key: "amount",
      title: "Amount",
      width: "120px",
      align: "right",
    },
    {
      key: "type",
      title: "Type",
      width: "100px",
      align: "center",
    },
    {
      key: "source",
      title: "Source",
      width: "150px",
    },
    {
      key: "description",
      title: "Description",
      width: "200px",
    },
    {
      key: "date",
      title: "Date",
      width: "120px",
      align: "center",
    },
  ];

  const currentTransactions =
    activeTab === "Inflow" ? inflowTransactions : outflowTransactions;

  return (
    <DashboardPageLayout
      title={`Wallet Overview${studentName ? ` - ${studentName}` : ""}`}
      description="Track inflows and outflows associated with this student account"
      actions={
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      }
    >
      <>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-white shadow-md">
            <div className="text-sm opacity-75">Overall Balance</div>
            <div className="mt-2 text-3xl font-bold">₦0.00</div>
            <div className="mt-4 flex items-center gap-2 text-sm opacity-80">
              <TrendingUp className="h-4 w-4" />
              <span>No inflow recorded yet</span>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Inflow</div>
                <div className="text-xl font-semibold text-gray-900">₦0.00</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              No inflow transactions have been recorded yet.
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Outflow</div>
                <div className="text-xl font-semibold text-gray-900">₦0.00</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              No outflow transactions have been recorded yet.
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab("Inflow");
                setCurrentPage(1);
              }}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "Inflow"
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
              }`}
            >
              Inflow
            </button>
            <button
              onClick={() => {
                setActiveTab("Outflow");
                setCurrentPage(1);
              }}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "Outflow"
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
              }`}
            >
              Outflow
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeTab} Transactions
                </h2>
                <p className="text-sm text-gray-500">
                  Detailed list of all {activeTab.toLowerCase()} transactions
                </p>
              </div>
            </div>
            <div className="p-4">
              <DataTable<TransactionTableRow>
                data={currentTransactions}
                columns={columns}
                loading={false}
                rowKey="id"
                emptyText={`No ${activeTab.toLowerCase()} transactions found`}
                className="text-sm"
                pagination={{
                  current: currentPage,
                  pageSize,
                  total: currentTransactions.length,
                  showSizeChanger: true,
                  pageSizeOptions: [5, 10, 20],
                  showQuickJumper: true,
                  showTotal: (total: number, range: [number, number]) =>
                    `Showing ${range[0]}-${range[1]} of ${total} ${activeTab.toLowerCase()} transactions`,
                }}
                searchable={false}
                striped
                hoverable
                bordered={false}
                onPageChange={(page: number, size: number) => {
                  setCurrentPage(page);
                  if (size !== pageSize) {
                    setPageSize(size);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </>
    </DashboardPageLayout>
  );
};

export default Wallet;
