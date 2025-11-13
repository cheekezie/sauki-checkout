import { ChevronRight, FileText, DollarSign, ArrowUpRight } from "lucide-react";
import DataTable from "../ui/DataTable";
import type {
  DataTableColumn,
  DataTableAction,
} from "../../interface/ui.interface";
import { useState, useMemo } from "react";
import type { LatestInvoice } from "../../services/dashboard.service";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatTableDate } from "@/utils/tableFormatters";

interface PaymentData extends Record<string, unknown> {
  id: string;
  invoiceNo: string;
  paymentDate: string;
  amount: string;
  status: "upcoming" | "paid";
}

interface PaymentHistoryProps {
  invoices?: LatestInvoice[];
}

const PaymentHistory = ({ invoices = [] }: PaymentHistoryProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  const paymentData: PaymentData[] = useMemo(() => {
    return invoices.map((invoice, index) => ({
      id: String(index + 1),
      invoiceNo: invoice.regNumber || `INV-${String(index + 1).padStart(6, '0')}`,
      paymentDate: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }) || "—",
      amount: formatCurrency(invoice.amount || 0),
      status: invoice.status === "approved" ? "paid" as const : "upcoming" as const,
    }));
  }, [invoices]);

  const columns: DataTableColumn<PaymentData>[] = [
    {
      key: "invoiceNo",
      title: "Invoice No.",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search invoice...",
      width: "150px",
    },
    {
      key: "paymentDate",
      title: "Payment Date",
      sortable: true,
      filterable: true,
      filterType: "date",
      width: "140px",
      render: (value) => formatTableDate(value),
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
      key: "status",
      title: "Status",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "upcoming", label: "Upcoming" },
        { value: "paid", label: "Paid" },
      ],
      align: "center",
      width: "120px",
      render: (value) => (
        <span
          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${
            value === "upcoming"
              ? "bg-primary/10 text-primary"
              : "bg-primary text-white"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  const actions: DataTableAction<PaymentData>[] = [
    {
      key: "view",
      title: "View Details",
      icon: FileText,
      onClick: (_row) => {
      },
    },
  ];

  return (
    <div className="bg-bg/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm font-sora">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-dark" />
          <h2 className="text-xl font-semibold text-text">Payment History</h2>
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

      {/* DataTable */}
      <DataTable
        data={paymentData}
        columns={columns}
        actions={actions}
        searchable
        exportable
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: paymentData.length,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20],
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} payments`,
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
        exportFileName="payment-history"
        striped
        hoverable
        bordered={false}
        size="medium"
        emptyText="No payment records found"
        loadingText="Loading payment history..."
        className="bg-transparent"
        headerClassName="bg-offwhite/50"
        bodyClassName="bg-transparent"
      />

      {/* View All Button */}
      <div className="mt-4">
        <button
          onClick={() => (window.location.href = "/dashboard/statistics")}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary font-medium rounded-xl transition-all duration-200 group"
        >
          <span>View All Payments</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};

export default PaymentHistory;
