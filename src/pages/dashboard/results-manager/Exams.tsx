import DataTable from "../../../components/ui/DataTable";
import type {
  DataTableColumn,
  DataTableAction,
} from "../../../interface/ui.interface";
import { useState } from "react";
import { Plus, MoreVertical, Edit, Trash2, FileText } from "lucide-react";
import CreateExamModal from "../../../components/modals/CreateExamModal";
import DetailsModal from "../../../components/modals/DetailsModal";
import SmartDropdown from "../../../components/ui/SmartDropdown";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

interface ExamData {
  id: string;
  sn: number;
  title: string;
  term: string;
  session: string;
  date: string;
}

type ExamTableRow = ExamData & Record<string, unknown>;

const Exams = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamTableRow | null>(null);

  // Pending API integration: introduce loading states similar to the commented example.
  // const { data: exams, isLoading, isFetching, isError, error } = useExams();
  // const createMutation = useCreateExam();
  // const updateMutation = useUpdateExam();
  // const deleteMutation = useDeleteExam();
  
  // Then update the DataTable loading prop:
  // loading={isLoading || isFetching || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}

  const examData: ExamTableRow[] = [
    {
      id: "1",
      sn: 1,
      title: "Mid Term",
      term: "First Term",
      session: "2024/2025",
      date: "2024-10-15",
    },
    {
      id: "2",
      sn: 2,
      title: "Finals",
      term: "First Term",
      session: "2024/2025",
      date: "2024-12-01",
    },
  ];

  const columns: DataTableColumn<ExamTableRow>[] = [
    { key: "sn", title: "S/N", sortable: true, width: "70px", align: "center" },
    {
      key: "title",
      title: "Title",
      sortable: true,
      filterable: true,
      filterType: "text",
      width: "220px",
    },
    {
      key: "term",
      title: "Term",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "First Term", label: "First Term" },
        { value: "Second Term", label: "Second Term" },
        { value: "Third Term", label: "Third Term" },
      ],
      width: "160px",
    },
    {
      key: "session",
      title: "Session",
      sortable: true,
      filterable: true,
      filterType: "text",
      width: "140px",
    },
    {
      key: "date",
      title: "Date",
      sortable: true,
      filterable: true,
      filterType: "date",
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

  const handleCreateExam = (_data: any) => {
    // integrate with API later
  };

  const RowActions = ({ row: _row }: { row: ExamTableRow }) => {
    const handleEdit = () => {
      // Pending UI support: enable edit once CreateExamModal is updated.
      setIsCreateModalOpen(true);
    };

    const handleDelete = () => {
      // Pending API support: wire delete handler when endpoint becomes available.
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

  const actions: DataTableAction<ExamTableRow>[] = [];

  return (
    <DashboardPageLayout
      title="Exams"
      description="Plan and monitor examination schedules"
      actions={
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600"
        >
          <Plus className="h-4 w-4" />
          <span>Create Exam</span>
        </button>
      }
    >
      <>
        <DataTable<ExamTableRow>
          data={examData}
          columns={columns}
          actions={actions}
          loading={false}
          searchable
          searchPlaceholder="Search exams"
          searchFields={["title", "term", "session"]}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: examData.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `Showing ${range[0]}-${range[1]} of ${total} exams`,
          }}
          onPageChange={(page: number, newPageSize: number) => {
            setCurrentPage(page);
            if (newPageSize !== pageSize) setPageSize(newPageSize);
          }}
          onRowClick={(row: ExamTableRow) => {
            setSelectedExam(row);
            setIsDetailsModalOpen(true);
          }}
          striped
          hoverable
          bordered={false}
          size="small"
          emptyText="No exams found"
          loadingText="Loading exams..."
          exportable
          exportFileName="exams"
          className="text-xs"
          columnManagement
          actionColumnTitle=""
          actionColumnWidth="80px"
        />

        <CreateExamModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
          }}
          onSave={handleCreateExam}
        />
        {selectedExam && (
          <DetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedExam(null);
            }}
            title="Exam Details"
            subtitle="View exam information"
            icon={<FileText className="h-5 w-5 text-primary" />}
            data={selectedExam}
            fields={[
              { key: "title", label: "Exam Title" },
              { key: "term", label: "Term" },
              { key: "session", label: "Session" },
              { key: "date", label: "Date" },
            ]}
          />
        )}
      </>
    </DashboardPageLayout>
  );
};

export default Exams;
