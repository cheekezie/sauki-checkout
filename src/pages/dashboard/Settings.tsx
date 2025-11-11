import { useState } from "react";
import DataTable from "../../components/ui/DataTable";
import type { DataTableColumn } from "../../interface/ui.interface";
import { usePaymentGateways, useSimulateTransfer, usePricing } from "../../hooks/usePayment";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import SmartDropdown from "../../components/ui/SmartDropdown";
import { useToast } from "../../hooks/useToast";
import type { PaymentGateway, ProfitSharingAccount } from "../../services/payment.service";
import { ComponentLoading } from "../../components/ui/LoadingSpinner";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

type TabType = "payment-gateway" | "transfer-simulation" | "profit-sharing" | "pricing";

interface GatewayData extends Record<string, unknown> {
  id: string;
  sn: number;
  gateway: string;
  status: string;
  lockStatus: string;
}

interface AccountData extends Record<string, unknown> {
  id: string;
  sn: number;
  name: string;
  accountNumber: string;
  bank: string;
  amount: number;
  status: string;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState<TabType>("payment-gateway");
  const [virtualAccountNumber, setVirtualAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showError } = useToast();
  const { confirm, ConfirmModal } = useConfirmModal();
  const { data: gatewaysData, isLoading: gatewaysLoading } = usePaymentGateways();
  // Pending API support: enable once profit sharing endpoints are available.
  // const { data: accountsData, isLoading: accountsLoading, isError: accountsError } = useProfitSharingAccounts();
  const accountsData = null;
  const accountsLoading = false;
  const { data: pricingData, isLoading: pricingLoading } = usePricing();
  const simulateTransferMutation = useSimulateTransfer();

  // Transform gateways data
  const gatewayData: GatewayData[] = ((gatewaysData as any)?.data || (gatewaysData as any)?.gateways || []).map(
    (gateway: PaymentGateway, index: number) => ({
      id: gateway._id || gateway.id || `gateway_${index}`,
      sn: index + 1,
      gateway: gateway.name || "Unknown Gateway",
      status: gateway.status || "inactive",
      lockStatus: gateway.lockStatus || "unlocked",
    })
  );

  // Transform accounts data
  // Pending API support: enable when profit sharing endpoint is provided.
  const accountData: AccountData[] = accountsData
    ? ((accountsData as any)?.data || (accountsData as any)?.accounts || []).map(
        (account: ProfitSharingAccount, index: number) => ({
          id: account._id || account.id || `account_${index}`,
          sn: index + 1,
          name: account.name || "",
          accountNumber: account.accountNumber || "",
          bank: account.bank || "",
          amount: account.amount || 0,
          status: account.status || "inactive",
        })
      )
    : [];

  // Gateway columns
  const gatewayColumns: DataTableColumn<GatewayData>[] = [
    {
      key: "sn",
      title: "S/N",
      render: (_value, row: GatewayData) => row.sn,
    },
    {
      key: "gateway",
      title: "Gateway",
      render: (_value, row: GatewayData) => row.gateway,
    },
    {
      key: "status",
      title: "Status",
      render: (_value, row: GatewayData) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'active' ? 'bg-green-100 text-green-800' :
          row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "lockStatus",
      title: "Lock Status",
      render: (_value, row: GatewayData) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.lockStatus === 'locked' ? 'bg-red-100 text-red-800' :
          'bg-green-100 text-green-800'
        }`}>
          {row.lockStatus}
        </span>
      ),
    },
  ];

  // Account columns
  const accountColumns: DataTableColumn<AccountData>[] = [
    {
      key: "sn",
      title: "S/N",
      render: (_value, row: AccountData) => row.sn,
    },
    {
      key: "name",
      title: "Name",
      render: (_value, row: AccountData) => row.name,
    },
    {
      key: "accountNumber",
      title: "Acct Number",
      render: (_value, row: AccountData) => row.accountNumber,
    },
    {
      key: "bank",
      title: "Bank",
      render: (_value, row: AccountData) => row.bank,
    },
    {
      key: "amount",
      title: "Amount",
      render: (_value, row: AccountData) => `₦${row.amount.toLocaleString()}`,
    },
    {
      key: "status",
      title: "Status",
      render: (_value, row: AccountData) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'active' ? 'bg-green-100 text-green-800' :
          row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      title: "",
      render: (_value, row: AccountData) => (
        <SmartDropdown
          trigger={
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
          }
          options={[
            {
              label: "Delete",
              icon: Trash2,
              onClick: () => handleDeleteAccount(row.id),
              className: "text-red-600 hover:text-red-700",
            },
          ]}
        />
      ),
    },
  ];

  const handleSimulateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!virtualAccountNumber.trim() || !amount.trim()) {
      showError("Error", "Please fill in all fields");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showError("Error", "Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      await simulateTransferMutation.mutateAsync({
        virtualAccountNumber: virtualAccountNumber.trim(),
        amount: amountNum,
      });
      setVirtualAccountNumber("");
      setAmount("");
    } catch {
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async (_id: string) => {
    confirm({
      title: "Delete Account",
      message: "Are you sure you want to delete this account?",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "warning",
      onConfirm: async () => {
        showError("Error", "Delete functionality not yet implemented. API endpoint required.");
        // Pending API support: enable deletion once backend endpoint is live.
        // await deleteAccountMutation.mutateAsync(id);
      },
    });
  };

  const handleAddAccount = () => {
    showError("Error", "Add account functionality not yet implemented. API endpoint required.");
  };

  const handleEditPricing = () => {
    showError("Error", "Edit pricing functionality not yet implemented. API endpoint required.");
  };

  const pricing = (pricingData as any)?.data || (pricingData as any)?.pricing;

  return (
    <DashboardPageLayout
      title="Settings"
      description="Manage platform payment configuration and policies"
    >
      <>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("payment-gateway")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "payment-gateway"
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Payment Gateway
            </button>
            <button
              onClick={() => setActiveTab("transfer-simulation")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "transfer-simulation"
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Transfer Simulation
            </button>
            <button
              onClick={() => setActiveTab("profit-sharing")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "profit-sharing"
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Profit Sharing
            </button>
            <button
              onClick={() => setActiveTab("pricing")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "pricing"
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pricing
            </button>
          </nav>
        </div>

        <div className="space-y-6">
          {activeTab === "payment-gateway" && (
            <>
              {gatewaysLoading ? (
                <div className="flex min-h-[400px] items-center justify-center py-12">
                  <ComponentLoading size="lg" />
                </div>
              ) : (
                <DataTable<GatewayData>
                  data={gatewayData}
                  columns={gatewayColumns}
                  loading={gatewaysLoading}
                  searchable
                  searchPlaceholder="Search gateways..."
                  searchFields={["gateway"]}
                  exportable
                  exportFileName="payment-gateways"
                  columnManagement
                  pagination={{
                    current: 1,
                    pageSize: 10,
                    total: gatewayData.length,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20, 50],
                    showQuickJumper: true,
                    showTotal: (total: number, range: [number, number]) =>
                      `Showing ${range[0]}-${range[1]} of ${total} gateways`,
                  }}
                  striped
                  hoverable
                  bordered={false}
                  size="small"
                  emptyText="No payment gateways found"
                  loadingText="Loading payment gateways..."
                  className="text-xs"
                />
              )}
            </>
          )}

          {activeTab === "transfer-simulation" && (
            <div className="w-full lg:w-1/2">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-semibold text-gray-800">
                  Simulate successful transfer
                </h2>

                <div className="space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Transfer simulation API endpoint is required. Please provide the endpoint to enable this functionality.
                    </p>
                  </div>

                  <form onSubmit={handleSimulateTransfer} className="space-y-4">
                    <Input
                      label="Virtual account number"
                      name="virtualAccountNumber"
                      type="text"
                      value={virtualAccountNumber}
                      onChange={(value) => setVirtualAccountNumber(value)}
                      placeholder="Enter virtual account number"
                      required
                    />
                    <Input
                      label="Amount"
                      name="amount"
                      type="number"
                      value={amount}
                      onChange={(value) => setAmount(value)}
                      placeholder="Enter amount"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting || simulateTransferMutation.isPending}
                      className="w-full"
                    >
                      {isSubmitting || simulateTransferMutation.isPending ? "Submitting..." : "Submit"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profit-sharing" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Accounts</h2>
                <button
                  onClick={handleAddAccount}
                  className="flex items-center justify-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add account</span>
                </button>
              </div>
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Profit sharing accounts API endpoint is required. Please provide the endpoint to enable this functionality.
                </p>
              </div>
              {accountsLoading ? (
                <div className="flex min-h-[400px] items-center justify-center py-12">
                  <ComponentLoading size="lg" />
                </div>
              ) : (
                <DataTable<AccountData>
                  data={accountData}
                  columns={accountColumns}
                  loading={accountsLoading}
                  searchable
                  searchPlaceholder="Search accounts..."
                  searchFields={["name", "accountNumber", "bank"]}
                  exportable
                  exportFileName="profit-sharing-accounts"
                  columnManagement
                  pagination={{
                    current: 1,
                    pageSize: 10,
                    total: accountData.length,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20, 50],
                    showQuickJumper: true,
                    showTotal: (total: number, range: [number, number]) =>
                      `Showing ${range[0]}-${range[1]} of ${total} accounts`,
                  }}
                  striped
                  hoverable
                  bordered={false}
                  size="small"
                  emptyText="No profit sharing accounts found"
                  loadingText="Loading profit sharing accounts..."
                  className="text-xs"
                />
              )}
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="w-full lg:w-1/2">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-semibold text-gray-800">Fixed price</h2>

                {pricingLoading ? (
                  <div className="flex min-h-[400px] items-center justify-center py-12">
                    <ComponentLoading size="lg" />
                  </div>
                ) : (
                  <div className="relative space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6 pr-12">
                    <button
                      onClick={handleEditPricing}
                      className="absolute right-6 top-6 rounded-lg p-2 transition-colors hover:bg-primary/10"
                      title="Edit pricing"
                    >
                      <Edit className="h-5 w-5 text-primary" />
                    </button>

                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-600">Price:</p>
                      <p className="text-xl font-semibold text-gray-900">
                        ₦{pricing?.price?.toLocaleString() || "400"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-600">Min Range:</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {pricing?.minRange || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-600">Max Range:</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {pricing?.maxRange || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <ConfirmModal />
      </>
    </DashboardPageLayout>
  );
};

export default Settings;

