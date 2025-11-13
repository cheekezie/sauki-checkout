import { ChevronRight, TrendingUp, ArrowUpRight } from "lucide-react";
import DataTable from "../ui/DataTable";
import type {
  DataTableColumn,
  DataTableAction,
} from "../../interface/ui.interface";
import { useState, useMemo } from "react";
import type { LatestTransaction } from "../../services/dashboard.service";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatTableDate } from "@/utils/tableFormatters";

interface RecentTransactionData extends Record<string, unknown> {
  id: string;
  student: string;
  amount: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface RecentTransactionsProps {
  transactions?: LatestTransaction[];
}

const RecentTransactions = ({ transactions = [] }: RecentTransactionsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  const recentTransactionData: RecentTransactionData[] = useMemo(() => {
    return transactions.map((transaction, index) => {
      // Handle date - use dateConfirmed, fallback to dateGenerated, or use empty string
      const transactionDate = transaction.dateConfirmed || transaction.dateGenerated || "";
      
      return {
        id: String(index + 1),
        student: transaction.payer || "—",
        amount: formatCurrency(transaction.amount || 0),
        date: transactionDate,
        status: transaction.status === "approved" ? "completed" as const 
          : transaction.status === "pending" ? "pending" as const 
          : "failed" as const,
      };
    });
  }, [transactions]);

  const columns: DataTableColumn<RecentTransactionData>[] = [
    {
      key: "student",
      title: "Student",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search student...",
      width: "150px",
    },
    {
      key: "amount",
      title: "Amount",
      sortable: true,
      filterable: true,
      filterType: "number",
      align: "right",
      width: "120px",
    },
    {
      key: "date",
      title: "Date",
      sortable: true,
      filterable: true,
      filterType: "date",
      width: "100px",
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
      width: "100px",
      render: (value) => {
        const statusColors: Record<RecentTransactionData["status"], string> = {
          completed: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          failed: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-semibold ${
              statusColors[value as RecentTransactionData["status"]]
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

  const actions: DataTableAction<RecentTransactionData>[] = [
    {
      key: "view",
      title: "View Details",
      icon: TrendingUp,
      onClick: (_row) => {
      },
    },
  ];

  return (
    <div className="bg-bg/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm font-sora">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-dark" />
          <h2 className="text-xl font-semibold text-text">
            Recent Transactions
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button className="w-10 h-10 rounded-full bg-primary/10 text-dark hover:text-primary hover:bg-primary/10 transition-all duration-200 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-primary/10 text-dark hover:text-primary hover:bg-primary/10 transition-all duration-200 flex items-center justify-center">
            <div className="w-5 h-5 flex flex-col items-center justify-center space-y-1">
              <div className="w-1 h-1 bg-dark rounded-full"></div>
              <div className="w-1 h-1 bg-dark rounded-full"></div>
              <div className="w-1 h-1 bg-dark rounded-full"></div>
            </div>
          </button>
        </div>
      </div>

      {/* DataTable - Demonstrating Reusability with Fewer Columns */}
      <DataTable
        data={recentTransactionData}
        columns={columns}
        actions={actions}
        searchable
        exportable={false}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: recentTransactionData.length,
          showSizeChanger: false,
          pageSizeOptions: [5],
          showQuickJumper: false,
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} transactions`,
        }}
        onPageChange={(page, newPageSize) => {
          setCurrentPage(page);
          if (newPageSize !== pageSize) {
            setPageSize(newPageSize);
          }
        }}
        selection={{
          selectedRowKeys: [],
          selectedRows: [],
          onChange: (_keys, _rows) => {
          },
        }}
        onRowClick={(_row) => {
        }}
        striped
        hoverable
        bordered={false}
        size="small"
        emptyText="No recent transactions found"
        loadingText="Loading recent transactions..."
        className="bg-transparent text-xs" 
        headerClassName="bg-offwhite/50"
        bodyClassName="bg-transparent"
        columnManagement={false}
      />

      {/* View All Button */}
      <div className="mt-4">
        <button
          onClick={() => (window.location.href = "/dashboard/transactions")}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary font-medium rounded-xl transition-all duration-200 group"
        >
          <span>View All Transactions</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};

export default RecentTransactions;
