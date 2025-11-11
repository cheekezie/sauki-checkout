import DataTable from "../../../components/ui/DataTable";
import type { DataTableColumn } from "../../../interface/ui.interface";
import { useState, useMemo } from "react";
import { ArrowLeft, Plus, Layers, MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddSubClassModal from "../../../components/modals/AddSubClassModal";
import DetailsModal from "../../../components/modals/DetailsModal";
import SmartDropdown from "../../../components/ui/SmartDropdown";
import {
  useSubClasses,
  useCreateSubClass,
  useDeleteSubClass,
} from "../../../hooks/useClasses";
import type { SubClassType } from "../../../interface/class.interface";
import { ComponentLoading } from "../../../components/ui/LoadingSpinner";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

interface SubClassData {
  id: string;
  sn: number;
  name: string;
  capacity?: number;
  isActive?: boolean;
}

type SubClassTableRow = SubClassData & Record<string, unknown>;

const SubClass = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingSubClass, setViewingSubClass] = useState<SubClassData | null>(
    null
  );

  const { data: subClassesResponse, isLoading, isError } = useSubClasses();
  const createSubClassMutation = useCreateSubClass();
  const deleteSubClassMutation = useDeleteSubClass();
  const { confirm, ConfirmModal } = useConfirmModal();

  // Transform API data to match component interface
  const subClassData: SubClassTableRow[] = useMemo(() => {
    if (!subClassesResponse?.data?.subClasses) return [];
    return subClassesResponse.data.subClasses.map((subClass: SubClassType, index: number) => ({
      id: subClass._id,
      sn: index + 1,
      name: subClass.name,
      capacity: subClass.capacity,
      isActive: subClass.isActive,
    }));
  }, [subClassesResponse]);

  const columns: DataTableColumn<SubClassTableRow>[] = [
    {
      key: "sn",
      title: "S/N",
      sortable: true,
      width: "80px",
      align: "left",
    },
    {
      key: "name",
      title: "Name",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search subclass name...",
      width: "200px",
      align: "center",
    },
    {
      key: "capacity",
      title: "Capacity",
      sortable: true,
      width: "150px",
      align: "center",
      render: (_: SubClassTableRow, row: SubClassTableRow) => row.capacity || "N/A",
    },
    {
      key: "isActive",
      title: "Status",
      sortable: true,
      width: "120px",
      align: "center",
      render: (_: SubClassTableRow, row: SubClassTableRow) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      width: "80px",
      align: "center",
      render: (_: SubClassTableRow, row: SubClassTableRow) => (
        <DropdownAction subClass={row} />
      ),
    },
  ];

  const handleDeleteSubClass = (subClass: SubClassTableRow) => {
    confirm({
      title: "Delete Subclass",
      message: `Are you sure you want to delete ${subClass.name}?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "warning",
      onConfirm: async () => {
        try {
          await deleteSubClassMutation.mutateAsync(subClass.id);
        } catch {
          // handled in hook
        }
      },
    });
  };

  const DropdownAction = ({ subClass }: { subClass: SubClassTableRow }) => {
    const options = [
      {
        label: "Delete",
        icon: Trash2,
        onClick: () => handleDeleteSubClass(subClass),
        className: "text-red-600 hover:text-red-700",
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

  const handleSaveSubClass = async (subclassName: string, capacity: number) => {
    try {
      await createSubClassMutation.mutateAsync({
        name: subclassName.trim(),
        capacity,
      });
      setIsModalOpen(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  return (
    <DashboardPageLayout
      title="Sub Classes"
      description="Manage subclasses and capacities"
      actions={
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Subclass</span>
          </button>
        </div>
      }
    >
      <>
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <ComponentLoading size="lg" />
          </div>
        )}

        {!isLoading && !isError && (
          <DataTable<SubClassTableRow>
            data={subClassData}
            columns={columns}
            loading={isLoading}
            searchable
            searchPlaceholder="Search subclasses..."
            searchFields={["name"]}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: subClassData.length,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50],
              showQuickJumper: true,
              showTotal: (total: number, range: [number, number]) =>
                `Showing ${range[0]}-${range[1]} of ${total} subclasses`,
            }}
            onPageChange={(page: number, newPageSize: number) => {
              setCurrentPage(page);
              if (newPageSize !== pageSize) {
                setPageSize(newPageSize);
                setCurrentPage(1);
              }
            }}
            onRowClick={(row: SubClassTableRow) => {
              setViewingSubClass(row);
              setIsDetailsModalOpen(true);
            }}
            striped
            hoverable
            bordered={false}
            size="small"
            emptyText="No subclasses found"
            loadingText="Loading subclasses..."
            exportable
            exportFileName="subclasses"
            className="text-xs"
            columnManagement
            actionColumnTitle="Actions"
            actionColumnWidth="80px"
          />
        )}

        <AddSubClassModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSubClass}
          isSubmitting={createSubClassMutation.isPending}
        />

        {viewingSubClass && (
          <DetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setViewingSubClass(null);
            }}
            title="Subclass Details"
            subtitle="View subclass information"
            icon={<Layers className="h-5 w-5 text-primary" />}
            data={viewingSubClass}
            fields={[
              { key: "name", label: "Subclass Name" },
              { key: "capacity", label: "Capacity" },
              { key: "isActive", label: "Status" },
            ]}
          />
        )}

        <ConfirmModal />
      </>
    </DashboardPageLayout>
  );
};

export default SubClass;
