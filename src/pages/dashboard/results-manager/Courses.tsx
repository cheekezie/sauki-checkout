import { useState } from "react";
import {
  Plus,
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  GraduationCap,
} from "lucide-react";
import DataTable from "../../../components/ui/DataTable";
import type {
  DataTableColumn,
  DataTableAction,
} from "../../../interface/ui.interface";
import SmartDropdown from "../../../components/ui/SmartDropdown";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";
import AddCourseModal from "../../../components/modals/AddCourseModal";
import DetailsModal from "../../../components/modals/DetailsModal";
import { STUDENT_CLASS_OPTIONS } from "@/constants/sharedOptions";
import BulkUploadModal from "@/components/modals/BulkUploadModal";

interface CourseRowData {
  id: string;
  sn: number;
  code: string;
  name: string;
  class: string;
}

type CourseTableRow = CourseRowData & Record<string, unknown>;

const Courses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseTableRow | null>(null);
  const [editingCourse, setEditingCourse] = useState<CourseTableRow | null>(null);

  // Pending API integration: add loading states similar to the commented example.
  // const { data: courses, isLoading, isFetching, isError, error } = useCourses();
  // const createMutation = useCreateCourse();
  // const updateMutation = useUpdateCourse();
  // const deleteMutation = useDeleteCourse();
  
  // Then update the DataTable loading prop:
  // loading={isLoading || isFetching || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}

  const courseData: CourseTableRow[] = [
    {
      id: "1",
      sn: 1,
      code: "CRS101",
      name: "Intro to Programming",
      class: "JS1",
    },
    { id: "2", sn: 2, code: "CRS201", name: "Data Structures", class: "SS1" },
    { id: "3", sn: 3, code: "CRS301", name: "Algebra", class: "SS2" },
  ];

  const columns: DataTableColumn<CourseTableRow>[] = [
    { key: "sn", title: "S/N", sortable: true, width: "70px", align: "center" },
    {
      key: "code",
      title: "Code",
      sortable: true,
      filterable: true,
      filterType: "text",
      width: "140px",
    },
    {
      key: "name",
      title: "Name",
      sortable: true,
      filterable: true,
      filterType: "text",
      width: "300px",
      align: "left",
    },
    {
      key: "class",
      title: "Class",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: STUDENT_CLASS_OPTIONS,
      width: "140px",
    },
    {
      key: "actions",
      title: "",
      width: "80px",
      align: "center",
      render: (_value, row) => <RowActions row={row} />,
    },
  ];

  const handleSaveCourse = (_data: any) => {
    // integrate with API later
  };

  const RowActions = ({ row }: { row: CourseTableRow }) => {
    const handleEdit = () => {
      setEditingCourse(row);
      setIsAddModalOpen(true);
    };

    const handleDelete = () => {
      // Pending API support: wire delete handler once endpoint is available.
    };

    const options = [
      {
        label: "Edit",
        icon: Edit,
        onClick: handleEdit,
        className: "",
      },
      {
        label: "Delete",
        icon: Trash2,
        onClick: handleDelete,
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

  const actions: DataTableAction<CourseTableRow>[] = [];

  const headerActions = (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <button
        onClick={() => setIsBulkModalOpen(true)}
        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
      >
        <Upload className="h-4 w-4" />
        <span>Bulk Upload</span>
      </button>
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="flex items-center justify-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600"
      >
        <Plus className="h-4 w-4" />
        <span>Add Course</span>
      </button>
    </div>
  );

  return (
    <DashboardPageLayout
      title="Courses"
      description="Manage courses and syllabi"
      actions={headerActions}
    >
      <>
        <DataTable<CourseTableRow>
          data={courseData}
          columns={columns}
          actions={actions}
          loading={false}
          searchable
          searchPlaceholder="Search by code or name"
          searchFields={["code", "name"]}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: courseData.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `Showing ${range[0]}-${range[1]} of ${total} courses`,
          }}
          onPageChange={(page: number, newPageSize: number) => {
            setCurrentPage(page);
            if (newPageSize !== pageSize) setPageSize(newPageSize);
          }}
          onRowClick={(row: CourseTableRow) => {
            setSelectedCourse(row);
            setIsDetailsModalOpen(true);
          }}
          striped
          hoverable
          bordered={false}
          size="small"
          emptyText="No courses found"
          loadingText="Loading courses..."
          exportable
          exportFileName="courses"
          className="text-xs"
          columnManagement
          actionColumnTitle=""
          actionColumnWidth="80px"
        />

        <AddCourseModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingCourse(null);
          }}
          onSave={handleSaveCourse}
          editMode={!!editingCourse}
          courseData={
            editingCourse
              ? {
                  courseTitle: editingCourse.name,
                  courseCode: editingCourse.code,
                  creditUnit: 0,
                  assessment: 0,
                  exam: 0,
                  passmark: 0,
                  description: "",
                }
              : undefined
          }
        />
        <BulkUploadModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          onSave={() => {}}
          templateName="Courses_Upload"
          downloadTemplate={() => {
            const templateContent = `Course Title,Course Code,Credit Unit,Assessment Max Score,Exam Max Score,Passmark (%),Description
Product Design,PDN-100,10,30,70,55,Product design fundamentals
Computer Programming,CPR-101,4,30,70,50,Programming basics
Database Management,DBM-102,3,30,70,50,Database concepts`;

            const blob = new Blob([templateContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "Fees_Course_Template.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
          confirmationTitle="Upload Successful"
          confirmationMessage="Courses have been successfully uploaded."
        />
        {selectedCourse && (
          <DetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedCourse(null);
            }}
            title="Course Details"
            subtitle="View course information"
            icon={<GraduationCap className="h-5 w-5 text-primary" />}
            data={selectedCourse}
            fields={[
              { key: "code", label: "Course Code" },
              { key: "name", label: "Course Name" },
              { key: "class", label: "Class" },
            ]}
          />
        )}
      </>
    </DashboardPageLayout>
  );
};

export default Courses;
