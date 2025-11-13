import { useEffect, useState, useCallback } from "react";
import { X, Plus, Edit, Trash2, Save, MoreVertical } from "lucide-react";
import { Portal } from "../layout/Portal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SmartDropdown from "../ui/SmartDropdown";
import AddScoreModal from "./AddScoreModal";
import AddGradeModal from "./AddGradeModal";
import Modal from "./Modal";
import Button from "../ui/Button";

interface GradeData {
  id: string;
  subject: string;
  test: string;
  exams: string;
  status: "Pass" | "Failed";
}

interface PsychomotorData {
  id: string;
  title: string;
  score: string;
}

interface ResultFormData {
  studentRegNumber: string;
  examType: string;
  assessmentType: string;
  code: string;
  grades: GradeData[];
}

interface AddResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resultData: ResultFormData) => void;
}

const AddResultModal = ({ isOpen, onClose, onSave }: AddResultModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ResultFormData>({
    studentRegNumber: "987654",
    examType: "Default",
    assessmentType: "Default, Psychomotor etc",
    code: "2024 / 2025 - First Term",
    grades: [],
  });

  const [grades, setGrades] = useState<GradeData[]>([
    {
      id: "1",
      subject: "English Language",
      test: "15 / 30",
      exams: "43 / 70",
      status: "Pass",
    },
    {
      id: "2",
      subject: "Mathematics",
      test: "5 / 30",
      exams: "25 / 70",
      status: "Failed",
    },
    {
      id: "3",
      subject: "Creative arts",
      test: "9 / 30",
      exams: "43 / 70",
      status: "Pass",
    },
    {
      id: "4",
      subject: "Social Studies",
      test: "20 / 30",
      exams: "25 / 70",
      status: "Pass",
    },
  ]);

  const [psychomotorSkills, setPsychomotorSkills] = useState<PsychomotorData[]>(
    [
      { id: "1", title: "Title", score: "" },
      { id: "2", title: "Accuracy", score: "3/5" },
      { id: "3", title: "Physical Activity", score: "5/5" },
      { id: "4", title: "Sports & Game", score: "4/5" },
    ]
  );
  const [isAddScoreModalOpen, setIsAddScoreModalOpen] = useState(false);
  const [isAddGradeModalOpen, setIsAddGradeModalOpen] = useState(false);
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof ResultFormData, string>>
  >({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        studentRegNumber: "987654",
        examType: "Default",
        assessmentType: "Default, Psychomotor etc",
        code: "2024 / 2025 - First Term",
        grades: [],
      });
      setCurrentStep(1);
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof ResultFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ResultFormData, string>> = {};

    if (!formData.studentRegNumber.trim()) {
      newErrors.studentRegNumber = "Student registration number is required";
    }

    if (!formData.examType || formData.examType === "Default") {
      newErrors.examType = "Exam type is required";
    }

    if (!formData.assessmentType) {
      newErrors.assessmentType = "Assessment type is required";
    }

    if (!formData.code) {
      newErrors.code = "Code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = useCallback((): boolean => {
    if (!formData.studentRegNumber.trim()) return false;
    if (!formData.examType) return false;
    if (!formData.assessmentType) return false;
    if (!formData.code) return false;
    return true;
  }, [formData]);

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateForm()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (currentStep === 3) {
      onSave({
        ...formData,
        grades: grades,
      });
      setShowSuccessConfirmation(true);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <Input
        label="Student Registration Number"
        name="studentRegNumber"
        value={formData.studentRegNumber}
        onChange={(value) => handleInputChange("studentRegNumber", value)}
        placeholder="987654"
        required
        error={errors.studentRegNumber}
      />

      <div>
        <Select
          label="Exam type"
          name="examType"
          value={formData.examType}
          onChange={(value) => handleInputChange("examType", value)}
          options={[
            { value: "Default", label: "Default" },
            { value: "Termly", label: "Termly" },
            { value: "Semester", label: "Semester" },
            { value: "POST-UTME", label: "POST-UTME" },
            { value: "Entrance", label: "Entrance" },
          ]}
          placeholder="Select exam type"
          required
          error={errors.examType}
        />
        <p className="text-xs text-gray-500 mt-1">
          NB: Termly, Semester, POST UTME or Entrance examination
        </p>
      </div>

      <Select
        label="Assessment type"
        name="assessmentType"
        value={formData.assessmentType}
        onChange={(value) => handleInputChange("assessmentType", value)}
        options={[
          {
            value: "Default, Psychomotor etc",
            label: "Default, Psychomotor etc",
          },
        ]}
        placeholder="Default, Psychomotor etc"
        required
        error={errors.assessmentType}
      />

      <Select
        label="Code"
        name="code"
        value={formData.code}
        onChange={(value) => handleInputChange("code", value)}
        options={[
          {
            value: "2024 / 2025 - First Term",
            label: "2024 / 2025 - First Term",
          },
        ]}
        placeholder="2024 / 2025 - First Term"
        required
        error={errors.code}
      />
    </div>
  );

  const getStatusIndicator = (status: "Pass" | "Failed") => {
    const color = status === "Pass" ? "bg-green-500" : "bg-red-500";
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <span className={status === "Pass" ? "text-green-600" : "text-red-600"}>
          {status}
        </span>
      </div>
    );
  };

  const DropdownAction = ({ grade }: { grade: GradeData }) => {
    const options = [
      {
        label: "Edit",
        icon: Edit,
        onClick: () => handleActionClick("edit", grade),
      },
      {
        label: "Delete",
        icon: Trash2,
        onClick: () => handleActionClick("delete", grade),
        className: "text-red-600 hover:text-red-700",
      },
    ];

    return (
      <SmartDropdown
        trigger={
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        }
        options={options}
      />
    );
  };

  const renderStep2 = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Result Overview
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth={false}
            className="flex items-center gap-2 w-auto"
            onClick={() => setIsAddGradeModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Add Grading System</span>
          </Button>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 p-3 text-left">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">
                    Subject
                  </th>
                  <th className="p-3 text-right text-sm font-semibold text-gray-700">
                    Test
                  </th>
                  <th className="p-3 text-right text-sm font-semibold text-gray-700">
                    Exams
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="w-12 p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {grades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="p-3 text-sm text-gray-900">
                      {grade.subject}
                    </td>
                    <td className="p-3 text-sm text-gray-600 text-right">
                      {grade.test}
                    </td>
                    <td className="p-3 text-sm text-gray-600 text-right">
                      {grade.exams}
                    </td>
                    <td className="p-3 text-sm">
                      {getStatusIndicator(grade.status)}
                    </td>
                    <td className="p-3">
                      <DropdownAction grade={grade} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const handleActionClick = useCallback((action: string, grade: GradeData) => {
    switch (action) {
      case "edit":
        // Handle edit
        break;
      case "delete":
        setGrades((prev) => prev.filter((g) => g.id !== grade.id));
        break;
      default:
        break;
    }
  }, []);

  const handleAddScore = (scoreData: {
    domain: string;
    score: number;
    totalScore: number;
  }) => {
    setPsychomotorSkills((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        title: scoreData.domain,
        score: `${scoreData.score}/${scoreData.totalScore}`,
      },
    ]);
    setIsAddScoreModalOpen(false);
  };

  const handleAddGrade = (gradeData: {
    subject: string;
    test1: string;
    test2: string;
    test3: string;
    examScore: string;
    totalGradeScore: string;
  }) => {
    // Calculate totals
    const testTotal = (
      parseFloat(gradeData.test1) +
      parseFloat(gradeData.test2) +
      parseFloat(gradeData.test3)
    ).toFixed(1);
    const examsTotal = parseFloat(gradeData.examScore).toFixed(1);

    setGrades((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        subject: gradeData.subject,
        test: `${testTotal} / 30`,
        exams: `${examsTotal} / 70`,
        status: parseFloat(gradeData.totalGradeScore) >= 55 ? "Pass" : "Failed",
      },
    ]);
    setIsAddGradeModalOpen(false);
  };

  const handleRemovePsychomotor = (id: string) => {
    setPsychomotorSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const renderStep3 = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Psychomotor Domain
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth={false}
            className="flex items-center gap-2 w-auto"
            onClick={() => setIsAddScoreModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Add Skills Assessment</span>
          </Button>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 p-3 text-left">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="p-3 text-right text-sm font-semibold text-gray-700">
                    Score
                  </th>
                  <th className="w-12 p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {psychomotorSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="p-3 text-sm text-gray-900">{skill.title}</td>
                    <td className="p-3 text-sm text-gray-600 text-right">
                      {skill.score}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleRemovePsychomotor(skill.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // If showing success confirmation, show only that modal
  if (showSuccessConfirmation) {
    return (
      <Modal
        isOpen={showSuccessConfirmation}
        onClose={() => {
          setShowSuccessConfirmation(false);
          onClose();
        }}
        title="Result uploaded successfully."
        message="Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna."
        type="success"
        autoCloseDelay={2000}
      />
    );
  }

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-offwhite flex-shrink-0">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-dark">
                Add Single Result
              </h2>
              <div className="h-1 w-24 bg-primary"></div>
            </div>
            <div className="text-sm text-dark/70">
              {currentStep === 1 && "Configuration (1/3)"}
              {currentStep === 2 && "Summative Score (2/3)"}
              {currentStep === 3 && "Psychomotor (3/3)"}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto flex-1">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-offwhite flex-shrink-0">
            <Button
              type="button"
              onClick={currentStep === 1 ? onClose : handlePrevious}
              variant="secondary"
              size="sm"
              fullWidth={false}
            >
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                variant="secondary"
                size="sm"
                fullWidth={false}
                className="flex items-center gap-2"
                disabled={currentStep === 1 && !isFormValid()}
              >
                <Save className="w-4 h-4" />
                <span>Next</span>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                variant="secondary"
                size="sm"
                fullWidth={false}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Result</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Add Score Modal */}
      <AddScoreModal
        isOpen={isAddScoreModalOpen}
        onClose={() => setIsAddScoreModalOpen(false)}
        onSave={handleAddScore}
      />

      {/* Add Grade Modal */}
      <AddGradeModal
        isOpen={isAddGradeModalOpen}
        onClose={() => setIsAddGradeModalOpen(false)}
        onSave={handleAddGrade}
      />
    </Portal>
  );
};

export default AddResultModal;
