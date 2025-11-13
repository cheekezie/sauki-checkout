import DataTable from "../../../components/ui/DataTable";
import type {
  DataTableColumn,
  DataTableAction,
} from "../../../interface/ui.interface";
import { useState, useMemo, useEffect, useRef } from "react";
import { Settings, MoreVertical, Edit, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SmartDropdown from "../../../components/ui/SmartDropdown";
import CustomizeClassModal from "../../../components/modals/CustomizeClassModal";
import DetailsModal from "../../../components/modals/DetailsModal";
import { useClasses, useUpdateClass } from "../../../hooks/useClasses";
import type { ClassType } from "../../../interface/class.interface";
import { ComponentLoading } from "../../../components/ui/LoadingSpinner";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";
import { useOrg } from "@/hooks/useOrg";
import { useToast } from "@/hooks/useToast";
import { useDecodedAuth } from "@/hooks/useDecodedAuth";
import { MerchantRoles } from "@/enums/merchant.enum";
import ClassService from "@/services/class.service";

interface ClassData {
  id: string;
  sn: number;
  name: string;
  category: string;
  code?: number;
  type?: string;
}

type ClassTableRow = ClassData & Record<string, unknown>;

const Classes = () => {
  const navigate = useNavigate();
  const { activeOrgId } = useOrg();
  const { role } = useDecodedAuth();
  const { showWarning, showError } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassTableRow | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingClass, setViewingClass] = useState<ClassTableRow | null>(null);

  const isPortalAdmin = role === MerchantRoles.PORTAL_ADMIN;
  const { classes, isLoading, isError } = useClasses(true); // New endpoint handles SubClasses schema issue automatically
  const updateClassMutation = useUpdateClass();

  // Ref to prevent duplicate toasts
  const hasShownOrgWarning = useRef(false);

  // Export handler - uses backend API
  const handleExport = async (
    _data: ClassTableRow[],
    format: "csv" | "excel"
  ) => {
    try {
      // Portal admins can export all classes, others need org
      const orgId = isPortalAdmin ? undefined : activeOrgId;
      if (!isPortalAdmin && !orgId) {
        showError(
          "Export Failed",
          "Please select an organization to export classes."
        );
        return;
      }

      const blob = await ClassService.exportClasses({
        filteredByOrg: orgId || undefined,
      });

      // Determine file extension based on format (backend may return different formats)
      const extension = format === "csv" ? "csv" : "xlsx";
      const filename = `classes.${extension}`;

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      showError(
        "Export Failed",
        error.message || "Failed to export classes. Please try again."
      );
    }
  };

  // Show toast when organization is not selected (skip for portal admins)
  useEffect(() => {
    if (
      !isPortalAdmin &&
      !activeOrgId &&
      !isLoading &&
      !hasShownOrgWarning.current
    ) {
      hasShownOrgWarning.current = true;
      showWarning(
        "Organization Not Selected",
        "Please select an organization to view classes."
      );
    }
    // Reset when org is selected
    if (activeOrgId) {
      hasShownOrgWarning.current = false;
    }
  }, [activeOrgId, isLoading, showWarning, isPortalAdmin]);

  // Transform API data to match component interface
  const classData: ClassTableRow[] = useMemo(() => {
    return classes.map((cls: ClassType, index: number) => ({
      id: cls._id,
      sn: index + 1,
      name: cls.name,
      category: cls.type || "Primary",
      code: cls.code,
      type: cls.type,
    }));
  }, [classes]);

  const handleActionClick = (action: string, row: ClassTableRow) => {
    if (action === "customize") {
      setSelectedClass(row);
      setIsCustomizeModalOpen(true);
    }
  };

  const handleSaveClass = async (className: string) => {
    if (selectedClass && className.trim()) {
      try {
        await updateClassMutation.mutateAsync({
          id: selectedClass.id,
          payload: { name: className.trim() },
        });
        setIsCustomizeModalOpen(false);
        setSelectedClass(null);
      } catch (error) {
        // Error is handled by the mutation hook
      }
    }
  };

  const DropdownAction = ({ row }: { row: ClassTableRow }) => {
    const options = [
      {
        label: "Customize",
        icon: Edit,
        onClick: () => handleActionClick("customize", row),
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

  // Get unique categories for filter options
  const categoryOptions = useMemo(() => {
    const categories = Array.from(
      new Set(classData.map((c) => c.category))
    ).filter(Boolean);
    return categories.map((cat) => ({
      value: cat,
      label: cat,
    }));
  }, [classData]);

  const columns: DataTableColumn<ClassTableRow>[] = [
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
      filterPlaceholder: "Search class name...",
      width: "200px",
    },
    {
      key: "category",
      title: "Class Category",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: categoryOptions,
      width: "200px",
    },
    {
      key: "actions",
      title: "Actions",
      width: "80px",
      align: "center",
      render: (_: ClassTableRow, row: ClassTableRow) => (
        <DropdownAction row={row} />
      ),
    },
  ];

  const actions: DataTableAction<ClassTableRow>[] = [];

  return (
    <DashboardPageLayout
      title="Classes"
      description="Customize and manage class configurations"
      actions={
        <button
          onClick={() => navigate("/dashboard/subclass")}
          className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600"
        >
          <Settings className="h-4 w-4" />
          <span>Sub Class</span>
        </button>
      }
    >
      <>
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <ComponentLoading size="lg" />
          </div>
        )}

        {!isPortalAdmin && !activeOrgId && !isLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Please select an organization to view classes.
              </p>
            </div>
          </div>
        )}

        {isError && (isPortalAdmin || activeOrgId) && (
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                Failed to load classes. Please try again or contact support if
                the issue persists.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !isError && (isPortalAdmin || activeOrgId) && (
          <DataTable<ClassTableRow>
            data={classData}
            columns={columns}
            actions={actions}
            loading={isLoading}
            searchable
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: classData.length,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50],
              showQuickJumper: true,
              showTotal: (total: number, range: [number, number]) =>
                `Showing ${range[0]}-${range[1]} of ${total} classes`,
            }}
            onPageChange={(page: number, newPageSize: number) => {
              setCurrentPage(page);
              if (newPageSize !== pageSize) {
                setPageSize(newPageSize);
              }
            }}
            onRowClick={(row: ClassTableRow) => {
              setViewingClass(row);
              setIsDetailsModalOpen(true);
            }}
            striped
            hoverable
            bordered={false}
            size="small"
            emptyText="No classes found"
            loadingText="Loading classes..."
            exportable
            exportFileName="classes"
            onExport={handleExport}
            className="text-xs"
            columnManagement
            actionColumnTitle=""
            actionColumnWidth="80px"
          />
        )}

        {selectedClass && (
          <CustomizeClassModal
            isOpen={isCustomizeModalOpen}
            onClose={() => {
              setIsCustomizeModalOpen(false);
              setSelectedClass(null);
            }}
            onSave={handleSaveClass}
            currentClassName={selectedClass.name}
            classId={selectedClass.id}
            classCode={selectedClass.code}
            classCategory={selectedClass.category}
            isSubmitting={updateClassMutation.isPending}
          />
        )}

        {viewingClass && (
          <DetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setViewingClass(null);
            }}
            title="Class Details"
            subtitle="View class information"
            icon={<GraduationCap className="h-5 w-5 text-primary" />}
            data={viewingClass}
            fields={[
              { key: "name", label: "Class Name" },
              { key: "category", label: "Category" },
            ]}
          />
        )}
      </>
    </DashboardPageLayout>
  );
};

export default Classes;
