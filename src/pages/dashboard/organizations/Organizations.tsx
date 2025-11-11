import { useState, useMemo } from "react";
import DataTable from "../../../components/ui/DataTable";
import type { DataTableColumn, DataTableAction } from "../../../interface/ui.interface";
import { Building2, FileText, Trash2, BarChart3, MoreVertical, Edit } from "lucide-react";
import { useOrganizations, useDeleteOrganization } from "../../../hooks/useOrganizations";
import { useConfirmModal } from "../../../hooks/useConfirmModal";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";
import SmartDropdown from "../../../components/ui/SmartDropdown";
import DetailsModal from "../../../components/modals/DetailsModal";
import AddOrganizationModal from "../../../components/modals/AddOrganizationModal";
import type { MerchantI } from "../../../interface/organization.interface";
import { logger } from "../../../services/logger.service";

interface MerchantData extends Record<string, unknown> {
  id: string;
  sn: number;
  name: string;
  businessId: string;
  email: string;
  phoneNumber: string;
  businessCategory: string;
  schoolBoard: string;
  schoolType: string;
  approvalStatus: string;
  bvnStatus: string;
  location: string;
  // Store full org data for actions
  orgData: MerchantI;
}

const Merchants = () => {
  // Local pagination state for UI (doesn't trigger API calls)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"School" | "Others">("School");
  const { confirm, ConfirmModal } = useConfirmModal();
  const deleteOrganizationMutation = useDeleteOrganization();

  // Fetch data based on active tab (filter by organizationCategory from API)
  const { data, isLoading, refetch } = useOrganizations({
    pageNumber: 1,
    pageSize: 18,
    organizationCategory: activeTab === "School" ? "school" : "other",
    order: "desc",
  });

  const handleActionClick = (action: string, merchant: MerchantData) => {
    switch (action) {
      case "details":
        setSelectedMerchant(merchant);
        setIsDetailsModalOpen(true);
        break;
      case "edit":
        setSelectedMerchant(merchant);
        setIsEditModalOpen(true);
        break;
      case "delete":
        confirm({
          title: "Delete Organization",
          message: `Are you sure you want to delete ${merchant.name} from Dashboard?`,
          cancelText: "Cancel",
          confirmText: "Delete",
          type: "warning",
          onConfirm: async () => {
            try {
              await deleteOrganizationMutation.mutateAsync(merchant.id);
              // Refetch the list after successful deletion
              await refetch();
            } catch (error) {
              // Error is handled by the mutation hook
            }
          },
        });
        break;
      case "payment-stats":
        // Pending design review: hook up navigation to payment statistics.
        logger.debug("Payment statistics requested", { merchantId: merchant.id });
        break;
      default:
        break;
    }
  };

  const DropdownAction = ({ merchant }: { merchant: MerchantData }) => {
    const options = [
      {
        label: "Details & Document",
        icon: FileText,
        onClick: () => handleActionClick("details", merchant),
      },
      {
        label: "Edit Organization",
        icon: Edit,
        onClick: () => handleActionClick("edit", merchant),
      },
      {
        label: "Payment Statistics",
        icon: BarChart3,
        onClick: () => handleActionClick("payment-stats", merchant),
      },
      {
        label: "Delete",
        icon: Trash2,
        onClick: () => handleActionClick("delete", merchant),
        className: "text-red-600 hover:text-red-700",
      },
    ];

    return (
      <SmartDropdown
        trigger={
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        }
        options={options}
      />
    );
  };

  // Transform API data to match component interface (API already filters by organizationCategory)
  const merchantData: MerchantData[] = useMemo(() => {
    const organizations = data?.data?.organizations || [];
    return organizations.map((org: MerchantI, index: number) => ({
      id: org._id,
      sn: index + 1,
      name: org.organizationName || "Unnamed",
      businessId: org.serialNum || org._id || "—",
      email: org.email || "—",
      phoneNumber: org.phoneNumber || "—",
      businessCategory: org.organizationCategory || "—",
      schoolBoard: org.schoolCategoryBoard || "—",
      schoolType: org.schoolType || "—",
      approvalStatus: (org.kycDocumentStatus && typeof org.kycDocumentStatus === 'string' && org.kycDocumentStatus.trim()) 
        ? org.kycDocumentStatus 
        : "pending",
      bvnStatus: (org.bvnApprovalStatus && typeof org.bvnApprovalStatus === 'string' && org.bvnApprovalStatus.trim())
        ? org.bvnApprovalStatus
        : (org.bvnApproved === true ? "approved" : "pending"),
      location: org.location || org.address || org.state || "—",
      orgData: org,
    }));
  }, [data]);

  // Define columns based on active tab
  const columns: DataTableColumn<MerchantData>[] = useMemo(() => {
    const baseColumns: DataTableColumn<MerchantData>[] = [
      {
        key: "sn",
        title: "S/N",
        sortable: true,
        width: "80px",
        align: "center",
        render: (_value, row: MerchantData) => row.sn,
      },
      {
        key: "name",
        title: "Name",
        render: (_value, row: MerchantData) => (
          <div className="flex items-center space-x-2">
            <span className="font-medium">{row.name}</span>
          </div>
        ),
      },
      {
        key: "businessId",
        title: "Business Id",
        render: (_value, row: MerchantData) => (
          <span className="font-mono text-sm">{row.businessId}</span>
        ),
      },
      {
        key: "email",
        title: "Email",
        render: (_value, row: MerchantData) => row.email,
      },
      {
        key: "phoneNumber",
        title: "Phone Number",
        render: (_value, row: MerchantData) => row.phoneNumber,
      },
      {
        key: "businessCategory",
        title: "Business Category",
        render: (_value, row: MerchantData) => (
          <span className="capitalize">{row.businessCategory}</span>
        ),
      },
    ];

    // Add School-specific columns only for School tab
    if (activeTab === "School") {
      baseColumns.push(
        {
          key: "schoolBoard",
          title: "School Board",
          render: (_value, row: MerchantData) => (
            <span className="capitalize">{row.schoolBoard}</span>
          ),
        },
        {
          key: "schoolType",
          title: "School Type",
          render: (_value, row: MerchantData) => (
            <span className="capitalize">{row.schoolType}</span>
          ),
        }
      );
    }

    // Add common columns (status columns)
    baseColumns.push(
      {
        key: "approvalStatus",
        title: "Approval Status",
        render: (_value, row: MerchantData) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
            row.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {row.approvalStatus}
          </span>
        ),
      },
      {
        key: "bvnStatus",
        title: "Bvn Status",
        render: (_value, row: MerchantData) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.bvnStatus === 'approved' ? 'bg-green-100 text-green-800' :
            row.bvnStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {row.bvnStatus}
          </span>
        ),
      },
      {
        key: "location",
        title: "Location",
        render: (_value, row: MerchantData) => row.location,
      },
      {
        key: "actions",
        title: "",
        render: (_value, row: MerchantData) => <DropdownAction merchant={row} />,
      }
    );

    return baseColumns;
  }, [activeTab]);

  const actions: DataTableAction<MerchantData>[] = [];

  return (
    <DashboardPageLayout
      title="Organizations"
      description="Manage and review registered organizations"
    >
      <>
        <div className="border-b border-gray-200">
          <nav className="flex gap-6">
            <button
              onClick={() => {
                setActiveTab("School");
                setCurrentPage(1);
              }}
              className={`py-2 text-sm font-medium transition-colors focus:outline-none ${
                activeTab === "School"
                  ? "border-b-2 border-pink-500 text-pink-500"
                  : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              School
            </button>
            <button
              onClick={() => {
                setActiveTab("Others");
                setCurrentPage(1);
              }}
              className={`py-2 text-sm font-medium transition-colors focus:outline-none ${
                activeTab === "Others"
                  ? "border-b-2 border-pink-500 text-pink-500"
                  : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Others
            </button>
          </nav>
        </div>

        <DataTable<MerchantData>
          data={merchantData}
          columns={columns}
          actions={actions}
          loading={isLoading}
          searchable
          searchPlaceholder="Search organizations..."
          searchFields={["name", "email", "phoneNumber", "businessId"]}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: merchantData.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `Showing ${range[0]}-${range[1]} of ${total} organizations`,
          }}
          onPageChange={(page: number, newPageSize: number) => {
            setCurrentPage(page);
            if (newPageSize !== pageSize) {
              setPageSize(newPageSize);
              setCurrentPage(1);
            }
          }}
          onRowClick={(row) => {
            setSelectedMerchant(row);
            setIsDetailsModalOpen(true);
          }}
          striped
          hoverable
          bordered={false}
          size="small"
          emptyText={`No ${activeTab.toLowerCase()} organizations found`}
          loadingText="Loading organizations..."
          exportable
          exportFileName={`${activeTab.toLowerCase()}-organizations`}
          className="text-xs"
          columnManagement
        />

        {selectedMerchant && (
          <DetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedMerchant(null);
            }}
            title="Merchant Details & Documents"
            subtitle="View merchant information and documents"
            data={selectedMerchant.orgData}
            icon={<Building2 className="h-5 w-5 text-primary" />}
            fields={[
              { key: "organizationName", label: "Merchant Name" },
              { key: "serialNum", label: "Business ID" },
              { key: "email", label: "Email" },
              { key: "phoneNumber", label: "Phone Number" },
              { key: "organizationCategory", label: "Business Category" },
              { key: "schoolCategoryBoard", label: "School Board" },
              { key: "schoolType", label: "School Type" },
              { key: "kycDocumentStatus", label: "Approval Status" },
              { key: "bvnApprovalStatus", label: "BVN Status" },
              { key: "location", label: "Location" },
              { key: "address", label: "Address" },
              { key: "state", label: "State" },
              { key: "lga", label: "LGA" },
            ]}
          />
        )}

        {selectedMerchant && (
          <AddOrganizationModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedMerchant(null);
            }}
            onSuccess={async () => {
              await refetch();
              setIsEditModalOpen(false);
              setSelectedMerchant(null);
            }}
            organization={selectedMerchant.orgData}
            mode="edit"
          />
        )}

        <ConfirmModal />
      </>
    </DashboardPageLayout>
  );
};

export default Merchants;