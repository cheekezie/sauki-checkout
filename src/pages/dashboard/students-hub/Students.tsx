import DataTable from "../../../components/ui/DataTable";
import type {
  DataTableColumn,
  DataTableAction,
} from "../../../interface/ui.interface";
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronDown,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Wallet,
  CreditCard,
} from "lucide-react";
import AddStudentModal from "../../../components/modals/AddStudentModal";
import StudentDetailsModal from "../../../components/modals/StudentDetailsModal";
import SmartDropdown from "../../../components/ui/SmartDropdown";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "../../../hooks/useStudents";
import { useDecodedAuth } from "../../../hooks/useDecodedAuth";
import { useOrg } from "@/hooks/useOrg";
import { useToast } from "../../../hooks/useToast";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import type { StudentType } from "../../../interface/student.interface";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";
import {
  GENDER_OPTIONS,
  STUDENT_CLASS_OPTIONS,
} from "@/constants/sharedOptions";
import StudentService from "@/services/student.service";

interface StudentData {
  id: string;
  sn: number;
  name: string;
  regNumber: string;
  gender: "Male" | "Female";
  class: string;
  schoolName?: string;
  department?: string;
  program?: string;
  addedOn?: string;
  sessionAdded?: string;
  academicHistory?: {
    class: string;
    session: string;
  };
}

/**
 * Helper function to map API StudentType to component StudentData
 */
const mapStudentToComponentData = (
  student: StudentType,
  index: number
): StudentData => {
  // Capitalize first letter of gender (API uses lowercase)
  const capitalizeGender = (gender?: string): "Male" | "Female" => {
    if (!gender) return "Male";
    const lower = gender.toLowerCase();
    return (lower.charAt(0).toUpperCase() + lower.slice(1)) as
      | "Male"
      | "Female";
  };

  // Get class name - try multiple sources
  const getClass = (): string => {
    // Handle class field - could be string, object, or null
    if (student.class) {
      if (typeof student.class === "string") {
        return student.class;
      }
      // If class is an object, try to get name or code property
      if (typeof student.class === "object") {
        const classObj = student.class as any;
        if (classObj?.name && typeof classObj.name === "string") {
          return classObj.name;
        }
        if (classObj?.code && typeof classObj.code === "string") {
          return classObj.code;
        }
      }
    }
    // Handle subClass - could be string, object, or null
    if (student.subClass) {
      if (typeof student.subClass === "string") {
        return student.subClass;
      }
      // If subClass is an object, try to get name or code property
      if (typeof student.subClass === "object") {
        const subClassObj = student.subClass as any;
        if (subClassObj?.name && typeof subClassObj.name === "string") {
          return subClassObj.name;
        }
        if (subClassObj?.code && typeof subClassObj.code === "string") {
          return subClassObj.code;
        }
      }
    }
    // Try to construct from program/department
    if (student.program?.name && student.department?.name) {
      return `${student.program.name} - ${student.department.name}`;
    }
    if (student.program?.name) return student.program.name;
    if (student.department?.name) return student.department.name;
    return "N/A";
  };

  // Get school/organization name
  const getSchoolName = (): string | undefined => {
    return student.organization?.organizationName || student.schoolName;
  };

  // Get session from academic history or sessionAdmitted
  const getSession = (): string | undefined => {
    if (student.sessionAdmitted) return student.sessionAdmitted;
    if (student.academicHistory && student.academicHistory.length > 0) {
      return student.academicHistory[0].session;
    }
    return student.sessionAdded;
  };

  return {
    id: student._id,
    sn: index + 1,
    name: student.fullName || student.name || "",
    regNumber: student.regNumber || student.matricNo || "",
    gender: capitalizeGender(student.gender),
    class: getClass(),
    schoolName: getSchoolName(),
    department: student.department?.name,
    program: student.program?.name,
    addedOn: student.addedOn || student.createdAt,
    sessionAdded: getSession(),
    academicHistory:
      student.academicHistory && student.academicHistory.length > 0
        ? {
            class:
              student.academicHistory[0].subClass ||
              student.academicHistory[0].program?.name ||
              student.academicHistory[0].department?.name ||
              "",
            session: student.academicHistory[0].session,
          }
        : undefined,
  };
};

const Students = () => {
  const navigate = useNavigate();
  const { hasPermission, isAdmin } = useDecodedAuth();
  const { showWarning, showError } = useToast();

  // Check permissions for student management
  const canWriteStudents = isAdmin || hasPermission("student.write");
  const canReadStudents = isAdmin || hasPermission("student.read");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);

  // Check if organization is selected
  const { activeOrgId } = useOrg();

  // State for search and filters
  const [searchTerm] = useState("");
  const [selectedClassId] = useState<string | undefined>(
    undefined
  );

  // Fetch students from API with pagination
  const {
    students = [], // Students array
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useStudents(
    {
      // Don't pass pageNumber or pageSize - we fetch all students and paginate client-side
      search: searchTerm,
      filteredByClass: selectedClassId,
      filteredByOrg: activeOrgId || undefined,
    },
    canReadStudents
  );

  // Refs to prevent duplicate toasts
  const hasShownOrgWarning = useRef(false);
  const hasShownAccessDenied = useRef(false);

  // Show toast when organization is not selected
  useEffect(() => {
    if (
      !activeOrgId &&
      canReadStudents &&
      !isLoading &&
      !hasShownOrgWarning.current
    ) {
      hasShownOrgWarning.current = true;
      showWarning(
        "Organization Not Selected",
        "Please select an organization to view students."
      );
    }
    // Reset when org is selected
    if (activeOrgId) {
      hasShownOrgWarning.current = false;
    }
  }, [activeOrgId, canReadStudents, isLoading, showWarning]);

  // Show toast when access is denied
  useEffect(() => {
    if (isError && !canReadStudents && !hasShownAccessDenied.current) {
      hasShownAccessDenied.current = true;
      showError("Access Denied", "You don't have permission to view students.");
    }
    // Reset when error is cleared
    if (!isError) {
      hasShownAccessDenied.current = false;
    }
  }, [isError, canReadStudents, showError]);

  // Mutations
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  // Export handler - uses backend API
  const handleExport = async (
    _data: StudentData[],
    format: "csv" | "excel"
  ) => {
    try {
      if (!activeOrgId) {
        showError(
          "Export Failed",
          "Please select an organization to export students."
        );
        return;
      }

      const blob = await StudentService.exportStudents({
        search: searchTerm,
        filteredByClass: selectedClassId,
        filteredByOrg: activeOrgId || undefined,
      });

      // Determine file extension based on format (backend may return different formats)
      const extension = format === "csv" ? "csv" : "xlsx";
      const filename = `${activeTab.toLowerCase()}-students.${extension}`;

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
        error.message || "Failed to export students. Please try again."
      );
    }
  };

  // Map API data to component format and filter by tab
  const filteredStudents = useMemo(() => {
    // Ensure students is always an array
    const studentsArray = Array.isArray(students) ? students : [];

    if (!studentsArray || studentsArray.length === 0) return [];

    // Filter by tab status
    let filtered = studentsArray;
    if (activeTab === "Active") {
      // Active students are those not removed, not graduated, or have no status
      filtered = studentsArray.filter(
        (s) =>
          (s.removed === false && s.graduated === false) ||
          (!s.removed && !s.graduated)
      );
    } else if (activeTab === "Graduated") {
      // Graduated students
      filtered = studentsArray.filter((s) => s.graduated === true);
    } else if (activeTab === "Archive") {
      // Archived/removed students
      filtered = studentsArray.filter((s) => s.removed === true);
    }

    return filtered.map((student, index) =>
      mapStudentToComponentData(student, index)
    );
  }, [students, activeTab]);

  // Update serial numbers for all filtered students
  // DataTable will handle pagination, so we pass all students
  // Serial numbers will be recalculated by DataTable based on current page
  const studentData = useMemo(() => {
    return filteredStudents.map((student, index) => ({
      ...student,
      sn: index + 1, // This will be adjusted by DataTable pagination
    }));
  }, [filteredStudents]);

  const columns: DataTableColumn<StudentData>[] = [
    {
      key: "sn",
      title: "S/N",
      sortable: true,
      width: "80px",
      align: "center",
      render: (_value, _record, index) => {
        // Calculate serial number based on current page
        const serialNumber = (currentPage - 1) * pageSize + index + 1;
        return serialNumber;
      },
    },
    {
      key: "name",
      title: "Name",
      sortable: true,
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Search by name or reg number",
      width: "300px",
      align: "left",
    },
    {
      key: "regNumber",
      title: "Reg Number",
      sortable: true,
      filterable: true,
      filterType: "text",
      width: "180px",
      align: "left",
      render: (value) => (
        <span className="text-blue-600 underline cursor-pointer font-mono text-sm">
          {value}
        </span>
      ),
    },
    {
      key: "gender",
      title: "Gender",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: GENDER_OPTIONS,
      width: "120px",
      align: "left",
    },
    {
      key: "class",
      title: "Class",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: STUDENT_CLASS_OPTIONS,
      width: "120px",
      align: "left",
    },
    {
      key: "actions",
      title: "",
      width: "80px",
      align: "center" as const,
      render: (_: any, row: StudentData) => <DropdownAction row={row} />,
    },
  ];

  const handleActionClick = (action: string, row: StudentData) => {
    if (action === "view") {
      setSelectedStudent(row);
      setIsDetailsModalOpen(true);
    } else if (action === "edit" && canWriteStudents) {
      setSelectedStudent(row);
      setIsEditMode(true);
      setIsModalOpen(true);
    } else if (action === "wallet") {
      navigate(
        `/dashboard/students/wallet?studentId=${
          row.id
        }&studentName=${encodeURIComponent(row.name)}`
      );
    } else if (action === "payment-activity") {
      navigate(
        `/dashboard/students/payment-activity?studentId=${
          row.id
        }&studentName=${encodeURIComponent(row.name)}`
      );
    } else if (action === "delete" && canWriteStudents) {
      handleDeleteStudent(row.id);
    }
  };

  const { confirm, ConfirmModal } = useConfirmModal();

  const handleDeleteStudent = (id: string) => {
    confirm({
      title: "Delete Student",
      message: "Are you sure you want to delete this student?",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "warning",
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          await refetch();
        } catch (error) {
          // Error is handled by the mutation hook
        }
      },
    });
  };

  const handleSaveStudent = async (studentFormData: any) => {
    try {
      if (isEditMode && selectedStudent) {
        // Update existing student
        // Convert class to classCode if needed
        let classCode: number | undefined;
        if (studentFormData.class) {
          // If class is a number, use it directly
          if (typeof studentFormData.class === "number") {
            classCode = studentFormData.class;
          }
          // If class is a string that's a number, parse it
          else if (
            typeof studentFormData.class === "string" &&
            !isNaN(Number(studentFormData.class))
          ) {
            classCode = Number(studentFormData.class);
          }
          // If class is an object with a code property, use it
          else if (
            typeof studentFormData.class === "object" &&
            studentFormData.class.code
          ) {
            classCode =
              typeof studentFormData.class.code === "number"
                ? studentFormData.class.code
                : Number(studentFormData.class.code);
          }
          // If classCode is provided directly, use it
          else if (studentFormData.classCode) {
            classCode =
              typeof studentFormData.classCode === "number"
                ? studentFormData.classCode
                : Number(studentFormData.classCode);
          }
        }

        await updateMutation.mutateAsync({
          id: selectedStudent.id,
          payload: {
            fullName: studentFormData.fullName || studentFormData.name,
            gender:
              studentFormData.gender?.toLowerCase() || studentFormData.gender,
            regNumber: studentFormData.regNumber,
            classCode: classCode,
            subClass: studentFormData.subClass,
            department: studentFormData.department,
            program: studentFormData.program,
            sessionAdmitted: studentFormData.sessionAdmitted,
            termAdmitted: studentFormData.termAdmitted,
            studyYear: studentFormData.studyYear,
          },
        });
      } else {
        // Create new student
        await createMutation.mutateAsync({
          fullName: studentFormData.fullName || studentFormData.name,
          regNumber: studentFormData.regNumber,
          gender:
            studentFormData.gender?.toLowerCase() || studentFormData.gender,
          class: studentFormData.class,
          department: studentFormData.department,
          program: studentFormData.program,
        } as any);
      }
      await refetch();
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedStudent(null);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const DropdownAction = ({ row }: { row: StudentData }) => {
    const options = [
      ...(canWriteStudents
        ? [
            {
              label: "Edit",
              icon: Edit,
              onClick: () => handleActionClick("edit", row),
            },
          ]
        : []),
      {
        label: "View Details",
        icon: Eye,
        onClick: () => handleActionClick("view", row),
      },
      {
        label: "Wallet",
        icon: Wallet,
        onClick: () => handleActionClick("wallet", row),
      },
      {
        label: "Payment Activity",
        icon: CreditCard,
        onClick: () => handleActionClick("payment-activity", row),
      },
      ...(canWriteStudents
        ? [
            {
              label: "Delete",
              icon: Trash2,
              onClick: () => handleActionClick("delete", row),
              className: "text-red-600 hover:bg-red-50",
            },
          ]
        : []),
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

  const actions: DataTableAction<StudentData>[] = [];

  const headerActions = (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <button className="flex items-center justify-center gap-2 rounded-lg border border-pink-500 bg-white px-4 py-2 text-pink-500 transition-colors hover:bg-pink-50">
        <span>Bulk Action</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {canWriteStudents && (
        <button
          onClick={() => {
            setIsEditMode(false);
            setSelectedStudent(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600"
        >
          <Plus className="h-4 w-4" />
          <span>Add Student</span>
        </button>
      )}
    </div>
  );

  const tabs = ["Active", "Graduated", "Archive"];

  return (
    <DashboardPageLayout
      title="Students"
      description="Track student records and manage enrolment details"
      actions={headerActions}
    >
      <>
        <div className="border-b border-gray-200">
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`py-2 text-sm font-medium transition-colors focus:outline-none ${
                  activeTab === tab
                    ? "border-b-2 border-pink-500 text-pink-500"
                    : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <DataTable
          data={studentData}
          columns={columns}
          actions={actions}
          loading={
            !!activeOrgId &&
            (isLoading ||
              isFetching ||
              createMutation.isPending ||
              updateMutation.isPending ||
              deleteMutation.isPending)
          }
          searchable
          searchPlaceholder="Search by name or reg number"
          searchFields={["name", "regNumber"]}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredStudents.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `Showing ${range[0]}-${range[1]} of ${total} students`,
          }}
          onPageChange={(page: number, newPageSize: number) => {
            setCurrentPage(page);
            if (newPageSize !== pageSize) {
              setPageSize(newPageSize);
            }
          }}
          selection={{
            selectedRowKeys: selectedStudents,
            selectedRows: studentData.filter((s) =>
              selectedStudents.includes(s.id)
            ),
            onChange: (keys: string[]) => {
              setSelectedStudents(keys);
            },
          }}
          selectionColumnWidth="80px"
          onRowClick={(row: StudentData) => {
            setSelectedStudent(row);
            setIsDetailsModalOpen(true);
          }}
          striped
          hoverable
          bordered={false}
          size="small"
          emptyText="No students found"
          loadingText="Loading students..."
          exportable
          exportFileName={`${activeTab.toLowerCase()}-students`}
          onExport={handleExport}
          className="text-xs"
          columnManagement
          actionColumnTitle=""
          actionColumnWidth="80px"
        />

        <AddStudentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditMode(false);
            setSelectedStudent(null);
          }}
          onSave={handleSaveStudent}
          editMode={isEditMode}
          studentData={selectedStudent}
        />

        {selectedStudent && (
          <StudentDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedStudent(null);
            }}
            student={{
              id: selectedStudent.id,
              name: selectedStudent.name,
              regNumber: selectedStudent.regNumber,
              gender: selectedStudent.gender,
              class: selectedStudent.class,
              schoolName: selectedStudent.schoolName,
              addedOn: selectedStudent.addedOn,
              sessionAdded: selectedStudent.sessionAdded,
              academicHistory: selectedStudent.academicHistory,
            }}
          />
        )}
        <ConfirmModal />
      </>
    </DashboardPageLayout>
  );
};

export default Students;
