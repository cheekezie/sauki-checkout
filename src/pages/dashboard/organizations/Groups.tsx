import { useState, useMemo } from "react";
import DataTable from "../../../components/ui/DataTable";
import type {
  DataTableColumn,
  DataTableAction,
} from "../../../interface/ui.interface";
import { Users, Eye, Edit, Trash2, MoreVertical, Plus } from "lucide-react";
import { useGroups } from "../../../hooks/useOrganizations";
import SmartDropdown from "../../../components/ui/SmartDropdown";
import DetailsModal from "../../../components/modals/DetailsModal";
import CreateGroupModal from "../../../components/modals/CreateGroupModal";
import type { MerchantI } from "../../../interface/organization.interface";
import { logger } from "../../../services/logger.service";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/ui/Button";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

interface GroupData extends Record<string, unknown> {
  id: string;
  sn: number;
  name: string;
  category: string;
  schoolType: string;
  managePayment: boolean;
  organizations: number | string;
  orgData: MerchantI;
}

const Groups = () => {
  // Local pagination state for UI (doesn't trigger API calls)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { confirm, ConfirmModal } = useConfirmModal();
  const { showSuccess, showError } = useToast();

  // Fetch ALL data once (without pagination params)
  const { data, isLoading, refetch } = useGroups({
    pageSize: 18,
  });

  const handleCreateGroup = async (groupData: {
    name: string;
    organizationType: string;
    email: string;
    phone: string;
    description?: string;
    managePayment: boolean;
    bankCode?: string;
    accountNumber?: string;
    accountName?: string;
  }) => {
    try {
      // TODO: Implement API call to create group
      // For now, just log the data
      logger.debug("Create group requested", groupData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccess("Group Created", "Group has been created successfully.");
      setIsCreateModalOpen(false);
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.message || "Failed to create group. Please try again.";
      showError("Error", errorMessage);
      throw error;
    }
  };

  const handleActionClick = (action: string, group: GroupData) => {
    switch (action) {
      case "view":
        setSelectedGroup(group);
        setIsViewModalOpen(true);
        break;
      case "edit":
        setSelectedGroup(group);
        setIsEditModalOpen(true);
        break;
      case "delete":
        confirm({
          title: "Delete Group",
          message: `Are you sure you want to delete ${group.name}?`,
          confirmText: "Delete",
          cancelText: "Cancel",
          type: "warning",
          onConfirm: () => {
            // Pending API support: wire delete mutation before enabling this action.
            logger.debug("Delete group requested", { groupId: group.id });
          },
        });
        break;
      default:
        break;
    }
  };

  const DropdownAction = ({ group }: { group: GroupData }) => {
    const options = [
      {
        label: "View",
        icon: Eye,
        onClick: () => handleActionClick("view", group),
      },
      {
        label: "Edit",
        icon: Edit,
        onClick: () => handleActionClick("edit", group),
      },
      {
        label: "Delete",
        icon: Trash2,
        onClick: () => handleActionClick("delete", group),
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

  const groupData: GroupData[] = useMemo(() => {
    const organizations = (data as any)?.data?.organizations || [];
    return organizations.map((org: MerchantI, index: number) => ({
      id: org._id,
      sn: index + 1,
      name: org.organizationName || "Unnamed",
      category: org.organizationCategory || "—",
      schoolType: org.schoolType || "—",
      managePayment: org.manageGroupFees || false,
      organizations: "—", // Placeholder until organization count is available from the API
      orgData: org,
    }));
  }, [data]);

  const columns: DataTableColumn<GroupData>[] = [
    {
      key: "sn",
      title: "S/N",
      sortable: true,
      width: "80px",
      align: "center",
      render: (_value, row: GroupData) => row.sn,
    },
    {
      key: "name",
      title: "Name",
      render: (_value, row: GroupData) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      title: "Category",
      render: (_value, row: GroupData) => (
        <span className="capitalize">{row.category}</span>
      ),
    },
    {
      key: "schoolType",
      title: "School Type",
      render: (_value, row: GroupData) => (
        <span className="capitalize">{row.schoolType}</span>
      ),
    },
    {
      key: "managePayment",
      title: "Manage Payment",
      render: (_value, row: GroupData) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.managePayment
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.managePayment ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "organizations",
      title: "Organizations",
      render: (_value, row: GroupData) => row.organizations,
    },
    {
      key: "actions",
      title: "",
      render: (_value, row: GroupData) => <DropdownAction group={row} />,
    },
  ];

  const actions: DataTableAction<GroupData>[] = [];

  return (
    <DashboardPageLayout
      title="Groups"
      description="Manage organization groups and their permissions"
    >
      <>
        <div className="mb-4 flex justify-end">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6"
            fullWidth={false}
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Create Group
          </Button>
        </div>

        <DataTable<GroupData>
          data={groupData}
          columns={columns}
          actions={actions}
          loading={isLoading}
          searchable
          searchPlaceholder="Search groups..."
          searchFields={["name", "category", "schoolType"]}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: groupData.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `Showing ${range[0]}-${range[1]} of ${total} groups`,
          }}
          onPageChange={(page: number, newPageSize: number) => {
            setCurrentPage(page);
            if (newPageSize !== pageSize) {
              setPageSize(newPageSize);
              setCurrentPage(1);
            }
          }}
          onRowClick={(row: GroupData) => {
            setSelectedGroup(row);
            setIsViewModalOpen(true);
          }}
          striped
          hoverable
          bordered={false}
          size="small"
          emptyText="No groups found"
          loadingText="Loading groups..."
          exportable
          exportFileName="groups"
          className="text-xs"
          columnManagement
        />

        {selectedGroup && (
          <DetailsModal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedGroup(null);
            }}
            title="Group Details"
            subtitle="View group information"
            data={selectedGroup.orgData}
            icon={<Users className="h-5 w-5 text-primary" />}
            fields={[
              { key: "organizationName", label: "Group Name" },
              { key: "organizationCategory", label: "Category" },
              { key: "schoolType", label: "School Type" },
              {
                key: "manageGroupFees",
                label: "Manage Payment",
                render: (value) => (value ? "Yes" : "No"),
              },
              { key: "email", label: "Email" },
              { key: "phoneNumber", label: "Phone Number" },
              { key: "serialNum", label: "Serial Number" },
              { key: "_id", label: "Group ID" },
            ]}
          />
        )}

        {isEditModalOpen && selectedGroup && (
          <div>
            {/* Add edit modal content here once design is finalised */}
          </div>
        )}

        <CreateGroupModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateGroup}
        />

        <ConfirmModal />
      </>
    </DashboardPageLayout>
  );
};

export default Groups;
