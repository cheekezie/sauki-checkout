import DataTable from "../../components/ui/DataTable";
import type { DataTableColumn } from "../../interface/ui.interface";
import { useState, useEffect, useMemo } from "react";
import { Plus, MoreVertical, Eye, Edit, Trash2, Shield } from "lucide-react";
import SmartDropdown from "../../components/ui/SmartDropdown";
import AdminModal from "../../components/modals/AdminModal";
import DetailsModal from "../../components/modals/DetailsModal";
import AdminService, { type CreateAdminRequest, type UpdateAdminRequest } from "../../services/admin.service";
import { useToast } from "../../hooks/useToast";
import { isUnauthorizedError } from "../../utils/errorHandler";
import { logger } from "../../services/logger.service";
import { getErrorMessage } from "../../types/error.types";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";
import { genderOptions } from "@/constants/adminOptions";

interface AdminData {
  id: string;
  sn: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  gender: "Male" | "Female" | "--";
  permissions?: Array<{
    id: string;
    title: string;
    read: boolean;
    write: boolean;
  }>;
  lastLogin: string;
}

type AdminTableRow = AdminData & Record<string, unknown>;

const AdminAccounts = () => {
  const { showSuccess, showError } = useToast();
  const { confirm, ConfirmModal } = useConfirmModal();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminTableRow | null>(null);
  const [adminData, setAdminData] = useState<AdminTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAdmins, setTotalAdmins] = useState(0);

  const renderPermissionChips = (permissions?: AdminData["permissions"]) => {
    if (!permissions || permissions.length === 0) {
      return "—";
    }

    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {permissions.map((permission) => (
          <div
            key={permission.id}
            className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <span className="text-sm font-semibold text-gray-700">
              {permission.title}
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  permission.read
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                Read
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  permission.write
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                Write
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const adminDetailsFields = useMemo(
    () => [
      { key: "name", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Phone Number" },
      { key: "role", label: "Role" },
      { key: "gender", label: "Gender" },
      { key: "lastLogin", label: "Last Login" },
      {
        key: "permissions",
        label: "Permissions",
        render: (value: AdminData["permissions"]) =>
          renderPermissionChips(value),
        fullWidth: true,
      },
    ],
    []
  );

  const handleActionClick = (action: string, admin: AdminTableRow) => {
    switch (action) {
      case "view":
        setSelectedAdmin(admin);
        setIsViewModalOpen(true);
        break;
      case "edit":
        setSelectedAdmin(admin);
        setIsEditModalOpen(true);
        break;
      case "delete":
        confirm({
          title: "Delete Admin",
          message: `Are you sure you want to delete ${admin.name}?`,
          confirmText: "Delete",
          cancelText: "Cancel",
          type: "warning",
          onConfirm: () => handleDeleteAdmin(admin.id),
        });
        break;
      default:
        break;
    }
  };

  const DropdownAction = ({ admin }: { admin: AdminTableRow }) => {
    const options = [
      {
        label: "View Details",
        icon: Eye,
        onClick: () => handleActionClick("view", admin),
      },
      {
        label: "Edit",
        icon: Edit,
        onClick: () => handleActionClick("edit", admin),
      },
      {
        label: "Delete",
        icon: Trash2,
        onClick: () => handleActionClick("delete", admin),
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

  // Fetch admins from API
  const fetchAdmins = async (page: number = currentPage, searchTerm?: string, roleFilter?: string) => {
    try {
      setIsLoading(true);
      const response = await AdminService.getAdmins({
        pageNumber: page,
        pageSize: pageSize,
        search: searchTerm,
        filterByRole: roleFilter,
      });

      // Extract staffs array from response.data.staffs
      const staffs = response.data?.staffs || [];
      
      // Transform API response to AdminData format
      const transformedAdmins: AdminTableRow[] = staffs.map((admin: any, index: number) => ({
        id: admin._id || admin.id || `admin_${index}`,
        sn: (page - 1) * pageSize + index + 1,
        name: admin.fullName || admin.name || '',
        email: admin.email || '',
        phoneNumber: admin.phoneNumber || '',
        role: admin.role || '',
        gender: admin.gender === 'male' ? 'Male' : admin.gender === 'female' ? 'Female' : '--',
        permissions: admin.permissions 
          ? Object.entries(admin.permissions).map(([id, val]: [string, any]) => ({
              id,
              title: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
              read: val.read || false,
              write: val.write || false,
            }))
          : [],
        lastLogin: admin.lastLogin 
          ? new Date(admin.lastLogin).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })
          : 'Never',
      }));

      setAdminData(transformedAdmins);
      setTotalAdmins(response.data?.staffCount || staffs.length);
    } catch (error: unknown) {
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        const errorMessage = getErrorMessage(error) || "An error occurred while loading admins";
        showError("Failed to Load Admins", errorMessage);
      }
      setAdminData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch admins on mount and when page/pageSize changes
  useEffect(() => {
    fetchAdmins(currentPage);
  }, [currentPage, pageSize]);

  const columns: DataTableColumn<AdminTableRow>[] = [
    {
      key: "sn",
      title: "S/N",
      sortable: true,
      width: "80px",
      align: "center",
    },
    {
      key: "name",
      title: "Name",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search by name",
      width: "200px",
      align: "left",
    },
    {
      key: "role",
      title: "Role",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search by role",
      width: "150px",
      align: "left",
    },
    {
      key: "email",
      title: "Email",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search by email",
      width: "250px",
      align: "left",
      render: (value) => (
        <span className="text-blue-600 underline cursor-pointer font-mono text-sm">
          {value}
        </span>
      ),
    },
    {
      key: "phoneNumber",
      title: "Phone Number",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search by phone",
      width: "150px",
      align: "left",
    },
    {
      key: "gender",
      title: "Gender",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: genderOptions,
      width: "120px",
      align: "left",
    },
    {
      key: "lastLogin",
      title: "Last Login",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search by date",
      width: "200px",
      align: "left",
    },
    {
      key: "actions",
      title: "",
      sortable: false,
      filterable: false,
      width: "80px",
      align: "center",
      render: (_, admin) => <DropdownAction admin={admin} />,
    },
  ];

  const handleCreateAdmin = async (payload: Partial<AdminData>) => {
    try {
      // The AdminModal already formats the data correctly for the API
      // It sends: email, fullName, phoneNumber, gender, role
      const response = await AdminService.createAdmin(payload as unknown as CreateAdminRequest);
      
      // Extract PIN from message if available (development environment)
      const message = response.message || "Admin has been successfully created.";
      
      showSuccess(
        "Admin Created",
        message
      );
      
      setIsCreateModalOpen(false);
      
      // Refresh the admin list
      fetchAdmins(currentPage);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error) || "An error occurred while creating the admin.";
      
      logger.error("Error creating admin", error);
      
      showError(
        "Failed to Create Admin",
        errorMessage
      );
      
      // Don't close modal on error - let user see the error and try again
      // The modal will remain open so user can fix issues and retry
    }
  };

  const handleSaveAdmin = (_adminData: any) => {
    setIsModalOpen(false);
  };

  const handleEditAdmin = async (adminData: Partial<AdminData>) => {
    if (!adminData.id) {
      showError("Failed to Update Admin", "Admin ID is required");
      return;
    }

    try {
      // Format data for API - AdminModal already formats it correctly
      const payload: UpdateAdminRequest = {
        email: adminData.email?.trim(),
        fullName: adminData.name?.trim(), // API uses fullName, form uses name
        phoneNumber: adminData.phoneNumber?.trim(),
        gender: adminData.gender 
          ? (adminData.gender.toLowerCase() as 'male' | 'female')
          : undefined,
        role: adminData.role?.trim(),
      };

      const response = await AdminService.updateAdmin(adminData.id, payload);
      const message = response.message || "Admin has been successfully updated.";

      showSuccess("Admin Updated", message);
      setIsEditModalOpen(false);
      setSelectedAdmin(null);

      // Refresh the admin list
      fetchAdmins(currentPage);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error) || "An error occurred while updating the admin.";

      logger.error("Error updating admin", error);
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        showError("Failed to Update Admin", errorMessage);
      }
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      const response = await AdminService.deleteAdmin(adminId);
      const message = response.message || "Admin has been successfully deleted.";

      showSuccess("Admin Deleted", message);

      // Refresh the admin list
      fetchAdmins(currentPage);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error) || "An error occurred while deleting the admin.";

      logger.error("Error deleting admin", error);
      // Don't show toast for 401 errors - global handler will show it
      if (!isUnauthorizedError(error)) {
        showError("Failed to Delete Admin", errorMessage);
      }
    }
  };

  const headerActions = (
    <button
      onClick={() => setIsCreateModalOpen(true)}
      className="flex items-center justify-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600"
    >
      <Plus className="h-4 w-4" />
      <span>Create Admin Staff</span>
    </button>
  );

  return (
    <DashboardPageLayout
      title="Staff Users"
      description="Manage administrative access and permissions"
      actions={headerActions}
    >
      <>
        <DataTable<AdminTableRow>
          data={adminData}
          columns={columns}
          loading={isLoading}
          searchable
          searchPlaceholder="Search by keyword"
          searchFields={["name", "email", "phoneNumber"]}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalAdmins,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `Showing ${range[0]}-${range[1]} of ${total} staff users`,
          }}
          onPageChange={(page: number, newPageSize: number) => {
            setCurrentPage(page);
            if (newPageSize !== pageSize) {
              setPageSize(newPageSize);
              setCurrentPage(1);
            }
          }}
          selection={{
            selectedRowKeys: selectedAdmins,
            selectedRows: adminData.filter((a) => selectedAdmins.includes(a.id)),
            onChange: (keys: string[]) => {
              setSelectedAdmins(keys);
            },
          }}
          selectionColumnWidth="80px"
          onRowClick={(row: AdminTableRow) => {
            setSelectedAdmin(row);
            setIsViewModalOpen(true);
          }}
          striped
          hoverable
          bordered={false}
          size="small"
          emptyText="No staff users found"
          loadingText="Loading staff users..."
          className="text-xs"
          columnManagement
          exportable
          exportFileName="staff-users"
          actionColumnTitle=""
          actionColumnWidth="80px"
        />

        <AdminModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          mode="create"
          onSave={handleCreateAdmin}
        />

        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="add"
          onSave={handleSaveAdmin}
        />

        {selectedAdmin && (
          <AdminModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedAdmin(null);
            }}
            admin={selectedAdmin}
            mode="edit"
            onSave={handleEditAdmin}
          />
        )}

        {selectedAdmin && (
          <DetailsModal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedAdmin(null);
            }}
            title="Admin Details"
            subtitle="Staff account overview"
            icon={<Shield className="w-5 h-5 text-primary" />}
            data={selectedAdmin}
            fields={adminDetailsFields}
          />
        )}

        <ConfirmModal />
      </>
    </DashboardPageLayout>
  );
};

export default AdminAccounts;
