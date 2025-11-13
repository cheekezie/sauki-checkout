import DataTable from "../../components/ui/DataTable";
import type {
  DataTableColumn,
  DataTableAction,
} from "../../interface/ui.interface";
import { useState } from "react";
import { Plus, MoreVertical, Edit, Trash2, Users } from "lucide-react";
import SmartDropdown from "../../components/ui/SmartDropdown";
import ParentModal from "../../components/modals/ParentModal";
import DetailsModal from "../../components/modals/DetailsModal";
import type { Parent } from "../../interface/user.interface";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

type ParentTableRow = Parent & Record<string, unknown>;

const Parents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentTableRow | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingParent, setViewingParent] = useState<ParentTableRow | null>(null);

  const parentData: ParentTableRow[] = [
    {
      id: "1",
      sn: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phoneNumber: "08012345678",
      address: "123 Victoria Island, Lagos",
      occupation: "Software Engineer",
      relationship: "Father",
      wardsCount: 2,
      wards: [
        {
          id: "w1",
          firstName: "Jane",
          lastName: "Doe",
          class: "SS2",
          studentId: "STU001",
          relationship: "Daughter",
        },
        {
          id: "w2",
          firstName: "Mike",
          lastName: "Doe",
          class: "JS3",
          studentId: "STU002",
          relationship: "Son",
        },
      ],
      registrationDate: "2024-01-15",
      lastActive: "2024-01-20",
      status: "active",
    },
    {
      id: "2",
      sn: 2,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phoneNumber: "08023456789",
      address: "456 Ikoyi, Lagos",
      occupation: "Doctor",
      relationship: "Mother",
      wardsCount: 1,
      wards: [
        {
          id: "w3",
          firstName: "Emma",
          lastName: "Johnson",
          class: "SS1",
          studentId: "STU003",
          relationship: "Daughter",
        },
      ],
      registrationDate: "2024-01-10",
      lastActive: "2024-01-19",
      status: "active",
    },
    {
      id: "3",
      sn: 3,
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@email.com",
      phoneNumber: "08034567890",
      address: "789 Lekki, Lagos",
      occupation: "Business Owner",
      relationship: "Father",
      wardsCount: 3,
      wards: [
        {
          id: "w4",
          firstName: "David",
          lastName: "Brown",
          class: "SS3",
          studentId: "STU004",
          relationship: "Son",
        },
        {
          id: "w5",
          firstName: "Lisa",
          lastName: "Brown",
          class: "JS2",
          studentId: "STU005",
          relationship: "Daughter",
        },
        {
          id: "w6",
          firstName: "Tom",
          lastName: "Brown",
          class: "JS1",
          studentId: "STU006",
          relationship: "Son",
        },
      ],
      registrationDate: "2024-01-05",
      lastActive: "2024-01-18",
      status: "active",
    },
    {
      id: "4",
      sn: 4,
      firstName: "Grace",
      lastName: "Wilson",
      email: "grace.wilson@email.com",
      phoneNumber: "08045678901",
      address: "321 Surulere, Lagos",
      occupation: "Teacher",
      relationship: "Guardian",
      wardsCount: 1,
      wards: [
        {
          id: "w7",
          firstName: "Sophie",
          lastName: "Wilson",
          class: "SS2",
          studentId: "STU007",
          relationship: "Ward",
        },
      ],
      registrationDate: "2024-01-12",
      lastActive: "2024-01-17",
      status: "active",
    },
    {
      id: "5",
      sn: 5,
      firstName: "Robert",
      lastName: "Davis",
      email: "robert.davis@email.com",
      phoneNumber: "08056789012",
      address: "654 Yaba, Lagos",
      occupation: "Engineer",
      relationship: "Father",
      wardsCount: 2,
      wards: [
        {
          id: "w8",
          firstName: "Alex",
          lastName: "Davis",
          class: "JS3",
          studentId: "STU008",
          relationship: "Son",
        },
        {
          id: "w9",
          firstName: "Maria",
          lastName: "Davis",
          class: "SS1",
          studentId: "STU009",
          relationship: "Daughter",
        },
      ],
      registrationDate: "2024-01-08",
      lastActive: "2024-01-16",
      status: "inactive",
    },
  ];

  const { confirm, ConfirmModal } = useConfirmModal();

  const handleActionClick = (action: string, parent: ParentTableRow) => {
    switch (action) {
      case "edit":
        setSelectedParent(parent);
        setIsEditModalOpen(true);
        break;
      case "delete":
        confirm({
          title: "Delete Parent",
          message: `Are you sure you want to delete ${parent.firstName} ${parent.lastName}?`,
          confirmText: "Delete",
          cancelText: "Cancel",
          type: "warning",
          onConfirm: () => {
            // Pending API support: wire delete mutation when backend is ready.
          },
        });
        break;
    }
  };

  const DropdownAction = ({ parent }: { parent: ParentTableRow }) => {
    const options = [
      {
        label: "Edit",
        icon: Edit,
        onClick: () => handleActionClick("edit", parent),
      },
      {
        label: "Delete",
        icon: Trash2,
        onClick: () => handleActionClick("delete", parent),
        className: "text-red-600 hover:bg-red-50",
      },
    ];

    return (
      <SmartDropdown
        options={options}
        trigger={
          <button
            className="p-1.5 rounded-md text-gray-600 hover:text-primary hover:bg-primary/10 transition-colors"
            title="Actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        }
      />
    );
  };

  const handleAddParent = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveParent = (_parentData: Partial<Parent>) => {
    setIsEditModalOpen(false);
    setSelectedParent(null);
  };

  const handleAddNewParent = (_parentData: Partial<Parent>) => {
    setIsAddModalOpen(false);
  };

  const columns: DataTableColumn<ParentTableRow>[] = [
    {
      key: "sn",
      title: "S/N",
      sortable: true,
      width: "60px",
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
      render: (_, parent) => `${parent.firstName} ${parent.lastName}`,
    },
    {
      key: "email",
      title: "Email",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search by email",
      width: "200px",
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
      width: "130px",
    },
    {
      key: "occupation",
      title: "Occupation",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search by occupation",
      width: "140px",
    },
    {
      key: "relationship",
      title: "Relationship",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "Father", label: "Father" },
        { value: "Mother", label: "Mother" },
        { value: "Guardian", label: "Guardian" },
      ],
      width: "100px",
      render: (value) => {
        const colors = {
          Father: "bg-blue-100 text-blue-800",
          Mother: "bg-pink-100 text-pink-800",
          Guardian: "bg-purple-100 text-purple-800",
        };
        return (
          <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
              colors[value as keyof typeof colors]
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: "wardsCount",
      title: "Wards",
      sortable: true,
      filterable: true,
      filterType: "number",
      align: "center",
      width: "80px",
      render: (value) => (
        <span className="text-gray-900 font-medium">{value}</span>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
      align: "center",
      width: "80px",
      render: (value) => {
        const statusColors = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
              statusColors[value as keyof typeof statusColors]
            }`}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      },
    },
    {
      key: "registrationDate",
      title: "Registration Date",
      sortable: true,
      filterable: true,
      filterType: "date",
      width: "120px",
      render: (value) => <span className="text-xs font-mono">{value}</span>,
    },
    {
      key: "actions",
      title: "",
      width: "80px",
      align: "center",
      render: (_, parent) => <DropdownAction parent={parent} />,
    },
  ];

  const actions: DataTableAction<ParentTableRow>[] = [];

  return (
    <DashboardPageLayout
      title="Parents"
      description="Manage parent accounts and their wards information"
      actions={
        <button
          onClick={handleAddParent}
          className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600"
        >
          <Plus className="h-4 w-4" />
          <span>Add Parent</span>
        </button>
      }
    >
      <>
        <DataTable<ParentTableRow>
          data={parentData}
          columns={columns}
          actions={actions}
          loading={false}
          searchable
          searchPlaceholder="Search parents by name, email, or phone"
          searchFields={[
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "occupation",
          ]}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: parentData.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `Showing ${range[0]}-${range[1]} of ${total} parents`,
          }}
          onPageChange={(page: number, newPageSize: number) => {
            setCurrentPage(page);
            if (newPageSize !== pageSize) {
              setPageSize(newPageSize);
            }
          }}
          onRowClick={(row: ParentTableRow) => {
            setViewingParent(row);
            setIsDetailsModalOpen(true);
          }}
          selection={{
            selectedRowKeys: selectedParents,
            selectedRows: parentData.filter((p) => selectedParents.includes(p.id)),
            onChange: (keys: string[]) => {
              setSelectedParents(keys);
            },
          }}
          selectionColumnWidth="80px"
          striped
          hoverable
          bordered={false}
          size="small"
          emptyText="No parents found"
          loadingText="Loading parents..."
          exportable
          exportFileName="parents"
          className="text-xs"
          columnManagement
        />

        <ParentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedParent(null);
          }}
          parent={selectedParent || undefined}
          editMode
          onSave={handleSaveParent}
        />

        <ParentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddNewParent}
        />

        {viewingParent && (
          <DetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setViewingParent(null);
            }}
            title="Parent Details"
            subtitle="View parent information"
            icon={<Users className="h-5 w-5 text-primary" />}
            data={viewingParent}
            fields={[
              { key: "firstName", label: "First Name" },
              { key: "lastName", label: "Last Name" },
              { key: "email", label: "Email" },
              { key: "phoneNumber", label: "Phone Number" },
              { key: "address", label: "Address" },
              { key: "occupation", label: "Occupation" },
              { key: "relationship", label: "Relationship" },
              { key: "wardsCount", label: "Wards Count" },
            ]}
          />
        )}
        <ConfirmModal />
      </>
    </DashboardPageLayout>
  );
};

export default Parents;
