import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DataTable from "../../components/ui/DataTable";
import type { DataTableColumn } from "../../interface/ui.interface";

interface PaymentData extends Record<string, unknown> {
  id: string;
  sn: number;
  amount: string;
  source: string;
  type: string;
  description: string;
  date: string;
}

const PaymentActivity = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("studentId");
  const studentName = searchParams.get("studentName");
  const [activeTab, setActiveTab] = useState<
    "Transactions" | "Paid Invoices (Part & Completed)" | "Other Invoices"
  >("Transactions");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Mock data for payments
  const transactionsData: PaymentData[] = [
    // Empty for now - will show "No records found" message
  ];

  const paidInvoicesData: PaymentData[] = [
    // Empty for now - will show "No records found" message
  ];

  const otherInvoicesData: PaymentData[] = [
    // Empty for now - will show "No records found" message
  ];

  const columns: DataTableColumn<PaymentData>[] = [
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
      key: "source",
      title: "Source",
      width: "150px",
    },
    {
      key: "type",
      title: "Type",
      width: "120px",
      align: "center",
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

  const getCurrentData = () => {
    switch (activeTab) {
      case "Transactions":
        return transactionsData;
      case "Paid Invoices (Part & Completed)":
        return paidInvoicesData;
      case "Other Invoices":
        return otherInvoicesData;
      default:
        return transactionsData;
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Payment Activity{" "}
          {studentName
            ? `- ${studentName}`
            : studentId
            ? `- Student ${studentId}`
            : ""}
        </h1>
      </div>

      {/* Financial Summary Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Total Inflow */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Inflow
              </h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">₦0.00</div>
          </div>

          {/* Wallet Transfer Out */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Wallet Transfer Out
              </h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">₦0.00</div>
          </div>

          {/* Total Invoice Completed */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Invoice Completed
              </h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">₦0.00</div>
          </div>

          {/* Total Part Payments */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Part Payments
              </h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">₦0.00</div>
          </div>

          {/* Wallet Balance */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Wallet Balance
              </h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">₦0.00</div>
          </div>
        </div>

        {/* Transaction Tabs and Table */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {/* Tabs */}
          <div className="px-4 sm:px-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:space-x-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("Transactions")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors text-left sm:text-center ${
                  activeTab === "Transactions"
                    ? "border-pink-500 text-pink-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab("Paid Invoices (Part & Completed)")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors text-left sm:text-center ${
                  activeTab === "Paid Invoices (Part & Completed)"
                    ? "border-pink-500 text-pink-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="block sm:hidden">Paid Invoices</span>
                <span className="hidden sm:block">
                  Paid Invoices (Part & Completed)
                </span>
              </button>
              <button
                onClick={() => setActiveTab("Other Invoices")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors text-left sm:text-center ${
                  activeTab === "Other Invoices"
                    ? "border-pink-500 text-pink-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Other Invoices
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="p-6">
            <DataTable
              data={currentData}
              columns={columns}
              loading={false}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: currentData.length,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50],
                showQuickJumper: true,
                showTotal: (total: number, range: [number, number]) =>
                  `Showing ${range[0]}-${range[1]} of ${total} payments`,
              }}
              onPageChange={(page: number, newPageSize: number) => {
                setCurrentPage(page);
                if (newPageSize !== pageSize) {
                  setPageSize(newPageSize);
                }
              }}
              emptyText="No records found, try again"
              striped={false}
              hoverable={false}
              bordered={false}
              size="medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentActivity;
