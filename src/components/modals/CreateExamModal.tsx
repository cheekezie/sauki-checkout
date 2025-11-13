import { useEffect, useState } from "react";
import { X, Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { Portal } from "../layout/Portal";
import AddSubjectToExamModal from "./AddSubjectToExamModal";
import Modal from "./Modal";
import Button from "../ui/Button";

interface ExamSubject {
  id: string;
  name: string;
  totalScore: number;
}

interface ExamData {
  examName: string;
  assessment: string[];
  applyPIN: boolean;
  passmark: number;
  subjects: ExamSubject[];
}

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (examData: ExamData) => void;
}

const CreateExamModal = ({ isOpen, onClose, onSave }: CreateExamModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ExamData>({
    examName: "",
    assessment: [],
    applyPIN: true,
    passmark: 55,
    subjects: [],
  });

  const [newAssessmentItem, setNewAssessmentItem] = useState("");
  const [subjects, setSubjects] = useState<ExamSubject[]>([
    { id: "1", name: "English Language", totalScore: 0 },
    { id: "2", name: "Mathematics", totalScore: 0 },
    { id: "3", name: "Creative arts", totalScore: 0 },
    { id: "4", name: "Social Studies", totalScore: 0 },
  ]);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [showSubjectAddedConfirmation, setShowSubjectAddedConfirmation] =
    useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ExamData, string>>>(
    {}
  );

  useEffect(() => {
    if (isOpen) {
      setFormData({
        examName: "",
        assessment: [],
        applyPIN: true,
        passmark: 55,
        subjects: [],
      });
      setNewAssessmentItem("");
      setCurrentStep(1);
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (
    field: keyof ExamData,
    value: string | boolean | string[]
  ) => {
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

  const handleAddAssessmentItem = () => {
    if (newAssessmentItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        assessment: [...prev.assessment, newAssessmentItem.trim()],
      }));
      setNewAssessmentItem("");
    }
  };

  const handleRemoveAssessmentItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      assessment: prev.assessment.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExamData, string>> = {};

    if (!formData.examName.trim()) {
      newErrors.examName = "Exam name is required";
    }

    if (formData.passmark <= 0 || formData.passmark > 100) {
      newErrors.passmark = "Passmark must be between 1 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateForm()) {
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (currentStep === 2) {
      onSave({
        ...formData,
        subjects: subjects,
      });
    }
  };

  const handleRemoveSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddSubject = (subject: { name: string; totalScore: number }) => {
    setSubjects((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        name: subject.name,
        totalScore: subject.totalScore,
      },
    ]);
    setIsAddSubjectModalOpen(false);
    setShowSubjectAddedConfirmation(true);

    // Close confirmation after 2 seconds
    setTimeout(() => {
      setShowSubjectAddedConfirmation(false);
    }, 2000);
  };

  if (!isOpen) return null;

  const renderStep1 = () => (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 mb-4">
        Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi.
        Aliquam in hendrerit urna.
      </p>

      <div className="border-t border-primary mt-4"></div>

      <Input
        label="Exam Name"
        name="examName"
        value={formData.examName}
        onChange={(value) => handleInputChange("examName", value)}
        placeholder="e.g 2025 JSS 1 Admission Exams"
        required
        error={errors.examName}
      />

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Assessment
        </label>
        {formData.assessment.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.assessment.map((item, index) => (
              <div
                key={index}
                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                <span>{item}</span>
                <button
                  onClick={() => handleRemoveAssessmentItem(index)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newAssessmentItem}
            onChange={(e) => setNewAssessmentItem(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddAssessmentItem();
              }
            }}
            placeholder="Enter assessment item"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleAddAssessmentItem}
            className="flex items-center space-x-1 px-4 py-2 bg-white border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
        <p className="text-xs text-gray-500">
          NB: School can create, POST UTME or Entrance examination
        </p>
      </div>

      <div className="space-y-3">
        <Select
          label="Apply PIN"
          name="applyPIN"
          value={formData.applyPIN ? "Yes" : "No"}
          onChange={(value) => handleInputChange("applyPIN", value === "Yes")}
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          error={errors.applyPIN}
        />
        <p className="text-xs text-gray-500">
          NB: A PIN would be required to check the result of this examination.
        </p>
      </div>

      <Input
        label="Passmark (%)"
        name="passmark"
        type="number"
        value={formData.passmark.toString()}
        onChange={(value) => handleInputChange("passmark", value)}
        placeholder="e.g 95%"
        required
        error={errors.passmark}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Result Overview</h3>
        <Button
          type="button"
          onClick={() => setIsAddSubjectModalOpen(true)}
          variant="secondary"
          size="sm"
          fullWidth={false}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
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
                  Total Obtainable Score
                </th>
                <th className="w-12 p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="p-3 text-sm text-gray-900">{subject.name}</td>
                  <td className="p-3 text-sm text-gray-600 text-right">
                    {subject.totalScore}
                  </td>
                  <td className="p-3">
                    <div className="relative">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <Button
                          type="button"
                          onClick={() => handleRemoveSubject(subject.id)}
                          variant="danger"
                          size="sm"
                          fullWidth={false}
                          className="w-full justify-start gap-2 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

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
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-in fade-in-0 zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              Create Exam
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-dark" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto flex-1">
            {currentStep === 1 ? renderStep1() : renderStep2()}
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
            {currentStep === 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                variant="secondary"
                size="sm"
                fullWidth={false}
              >
                Add Courses / Subjects
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                variant="secondary"
                size="sm"
                fullWidth={false}
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Add Subject Modal */}
      <AddSubjectToExamModal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        onSave={handleAddSubject}
      />

      {/* Subject Added Confirmation */}
      <Modal
        isOpen={showSubjectAddedConfirmation}
        onClose={() => setShowSubjectAddedConfirmation(false)}
        title="Subject(s) Added Successfully."
        message="Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna."
        type="success"
      />
    </Portal>
  );
};

export default CreateExamModal;
