import { useState } from "react";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  BookOpen,
} from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import type {
  DataTableAction,
  DataTableColumn,
} from "@/interface/ui.interface";
import SmartDropdown from "@/components/ui/SmartDropdown";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";
import AddSubjectModal from "@/components/modals/AddSubjectModal";
import DetailsModal from "@/components/modals/DetailsModal";
import { STUDENT_CLASS_OPTIONS } from "@/constants/sharedOptions";
import BulkUploadModal from "@/components/modals/BulkUploadModal";

interface SubjectRowData {
  id: string;
  sn: number;
  code: string;
  name: string;
  class: string;
  teacher: string;
  students: number;
  status: "active" | "inactive";
}

type SubjectTableRow = SubjectRowData & Record<string, unknown>;

const Subjects = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectTableRow | null>(
    null
  );
  const [editingSubject, setEditingSubject] = useState<SubjectRowData | null>(
    null
  );

  // Pending API integration: add loading states similar to the commented example.
  // const { data: subjects, isLoading, isFetching, isError, error } = useSubjects();
  // const createMutation = useCreateSubject();
  // const updateMutation = useUpdateSubject();
  // const deleteMutation = useDeleteSubject();
  
  // Then update the DataTable loading prop:
  // loading={isLoading || isFetching || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}

  const subjectData: SubjectTableRow[] = [
    {
      id: "1",
      sn: 1,
      code: "ENG",
      name: "English Language",
      class: "JS1",
      teacher: "Mr. Smith",
      students: 30,
      status: "active",
    },
    {
      id: "2",
      sn: 2,
      code: "MTH",
      name: "Mathematics",
      class: "JS1",
      teacher: "Mrs. Johnson",
      students: 28,
      status: "active",
    },
    {
      id: "3",
      sn: 3,
      code: "BIO",
      name: "Biology",
      class: "SS1",
      teacher: "Dr. Brown",
      students: 32,
      status: "inactive",
    },
  ];

  const columns: DataTableColumn<SubjectTableRow>[] = [
    { key: "sn", title: "S/N", sortable: true, width: "70px", align: "center" },
    {
      key: "code",
      title: "Code",
      sortable: true,
      filterable: true,
      filterType: "text",
      width: "120px",
    },
    {
      key: "name",
      title: "Name",
      sortable: true,
      filterable: true,
      filterType: "text",
      width: "260px",
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

  const handleSaveSubject = (_data: any) => {
    // integrate with API later
  };

  const RowActions = ({ row }: { row: SubjectTableRow }) => {
    const handleEdit = () => {
      setEditingSubject(row);
      setIsAddModalOpen(true);
    };

    const handleDelete = () => {
      // Pending API support: wire delete handler when endpoint is available.
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

  const actions: DataTableAction<SubjectTableRow>[] = [];

  return (
    <DashboardPageLayout
      title="Subjects"
      description="Manage subjects allocations and details"
      actions={
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600"
        >
          <Plus className="h-4 w-4" />
          <span>Add Subject</span>
        </button>
      }
    >
      <>
        <DataTable<SubjectTableRow>
          data={subjectData}
          columns={columns}
          actions={actions}
          loading={false}
          searchable
          searchPlaceholder="Search by code or name"
          searchFields={["code", "name"]}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: subjectData.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `Showing ${range[0]}-${range[1]} of ${total} subjects`,
          }}
          onPageChange={(page: number, newPageSize: number) => {
            setCurrentPage(page);
            if (newPageSize !== pageSize) setPageSize(newPageSize);
          }}
          onRowClick={(row: SubjectTableRow) => {
            setSelectedSubject(row);
            setIsDetailsModalOpen(true);
          }}
          striped={false}
          hoverable
          bordered={false}
          size="medium"
          emptyText="No subjects found"
          loadingText="Loading subjects..."
          className="bg-white rounded-lg shadow-sm border border-gray-200"
          headerClassName="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold py-4"
          bodyClassName="bg-white divide-y divide-gray-200"
          actionColumnTitle=""
          actionColumnWidth="80px"
        />

        {/* Modals */}
        <AddSubjectModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingSubject(null);
          }}
          onSave={handleSaveSubject}
          editMode={!!editingSubject}
          subjectData={
            editingSubject
              ? {
                  subjectName: editingSubject.name,
                  code: editingSubject.code,
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
          templateName="Subjects_Upload"
          downloadTemplate={() => {
            const templateContent = `Subject Name,Code,Assessment Score,Exam Score,Passmark (%),Description
English Language,ENG,30,70,55,English language fundamentals
Mathematics,MTH,30,70,50,Basic mathematics and calculations
Physics,PHY,30,70,50,Physics principles and applications
Chemistry,CHM,30,70,50,Chemistry fundamentals
Biology,BIO,30,70,50,Biological sciences`;

            const blob = new Blob([templateContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "Fees_Subject_Template.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
          confirmationTitle="Upload Successful"
          confirmationMessage="Subjects have been successfully uploaded."
        />
        {selectedSubject && (
          <DetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedSubject(null);
            }}
            title="Subject Details"
            subtitle="View subject information"
            icon={<BookOpen className="w-5 h-5 text-primary" />}
            data={selectedSubject}
            fields={[
              { key: "code", label: "Subject Code" },
              { key: "name", label: "Subject Name" },
              { key: "class", label: "Class" },
            ]}
          />
        )}
      </>
    </DashboardPageLayout>
  );
};

export default Subjects;
