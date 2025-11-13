import { ComponentLoading } from "@/components/ui/LoadingSpinner";
import { useDecodedAuth } from "@/hooks/useDecodedAuth";
import {
  useOrganizationProfile,
  useAddBankDetails,
} from "@/hooks/useOrganizations";
import { MerchantRoles } from "@/enums/merchant.enum";
import DataTable from "@/components/ui/DataTable";
import type { DataTableColumn } from "@/interface/ui.interface";
import type { OtherBankDetail } from "@/interface/organization.interface";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import AddSubAccountModal from "@/components/modals/AddSubAccountModal";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";
import Button from "@/components/ui/Button";

interface SubAccountData {
  sn: number;
  subAccountCode: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  _id: string;
}

type SubAccountTableRow = SubAccountData & Record<string, unknown>;

const SubAccount = () => {
  const { role, isLoading: authLoading } = useDecodedAuth();
  const isPortalAdmin = role === MerchantRoles.PORTAL_ADMIN;
  const { data, isLoading, refetch } = useOrganizationProfile({
    enabled: !authLoading && !isPortalAdmin,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addBankDetailsMutation = useAddBankDetails();

  // Extract otherBankDetails from organization data
  const organization = data?.data;
  const otherBankDetails: OtherBankDetail[] =
    organization?.otherBankDetails || [];

  // Transform data for table with S/N
  const tableData: SubAccountTableRow[] = useMemo(() => {
    return otherBankDetails.map((bankDetail, index) => ({
      sn: index + 1,
      subAccountCode: bankDetail.subAccountCode || "—",
      bankName: bankDetail.bankName || "—",
      accountName: bankDetail.accountName || "—",
      accountNumber: bankDetail.accountNumber || "—",
      _id: bankDetail._id || `bank-${index}`,
    }));
  }, [otherBankDetails]);

  // Define columns matching the structure used in other pages
  const columns: DataTableColumn<SubAccountTableRow>[] = useMemo(
    () => [
      {
        key: "sn",
        title: "S/N",
        sortable: true,
        width: "80px",
        align: "center",
      },
      {
        key: "subAccountCode",
        title: "Sub Account Code",
        sortable: true,
        width: "200px",
        align: "left",
        render: (_value, row: SubAccountTableRow) => (
          <span className="font-mono text-sm">{row.subAccountCode}</span>
        ),
      },
      {
        key: "bankName",
        title: "Bank Name",
        sortable: true,
        width: "200px",
        align: "left",
        render: (_value, row: SubAccountTableRow) => row.bankName,
      },
      {
        key: "accountName",
        title: "Account Name",
        sortable: true,
        width: "250px",
        align: "left",
        render: (_value, row: SubAccountTableRow) => row.accountName,
      },
      {
        key: "accountNumber",
        title: "Account Number",
        sortable: true,
        width: "180px",
        align: "left",
        render: (_value, row: SubAccountTableRow) => (
          <span className="font-mono text-sm">{row.accountNumber}</span>
        ),
      },
    ],
    []
  );

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ComponentLoading size="lg" />
      </div>
    );
  }

  if (isPortalAdmin || !organization) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-gray-500">
            Sub Account is only available for organizations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardPageLayout
      title="Sub Accounts"
      description="Manage linked bank accounts for this organization"
      actions={
        <Button
          onClick={() => setIsModalOpen(true)}
          fullWidth={false}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Sub Account</span>
        </Button>
      }
    >
      <>
        <DataTable<SubAccountTableRow>
          data={tableData}
          columns={columns}
          loading={isLoading}
          rowKey="_id"
          searchable
          searchPlaceholder="Search by sub account code, bank name, account name, or account number..."
          searchFields={[
            "subAccountCode",
            "bankName",
            "accountName",
            "accountNumber",
          ]}
          pagination={{
            current: 1,
            pageSize: 10,
            total: tableData.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `Showing ${range[0]}-${range[1]} of ${total} sub accounts`,
          }}
          exportable
          exportFileName="sub-accounts"
          emptyText="No sub accounts found"
          striped
          hoverable
          bordered={false}
          size="medium"
        />

        <AddSubAccountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={async (data) => {
            try {
              await addBankDetailsMutation.mutateAsync({
                accountNumber: data.accountNumber,
                bankCode: data.bankCode,
              });
              await refetch();
              setIsModalOpen(false);
            } catch (error: any) {
              // Error is handled by the mutation hook
              throw error;
            }
          }}
        />
      </>
    </DashboardPageLayout>
  );
};

export default SubAccount;
