import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import { Portal } from "../layout/Portal";
import Button from "../ui/Button";

interface SubjectData {
  subjectName: string;
  code: string;
  assessment: number;
  exam: number;
  passmark: number;
  description: string;
}

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subjectData: SubjectData) => void;
  editMode?: boolean;
  subjectData?: SubjectData;
}

const AddSubjectModal = ({
  isOpen,
  onClose,
  onSave,
  editMode = false,
  subjectData,
}: AddSubjectModalProps) => {
  const [formData, setFormData] = useState<SubjectData>({
    subjectName: "",
    code: "",
    assessment: 30,
    exam: 70,
    passmark: 55,
    description: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SubjectData, string>>
  >({});

  useEffect(() => {
    if (isOpen) {
      if (editMode && subjectData) {
        setFormData(subjectData);
      } else {
        setFormData({
          subjectName: "",
          code: "",
          assessment: 30,
          exam: 70,
          passmark: 55,
          description: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, editMode, subjectData]);

  const handleInputChange = (field: keyof SubjectData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "description"
          ? value
          : field === "subjectName" || field === "code"
          ? value
          : Number(value),
    }));

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SubjectData, string>> = {};

    if (!formData.subjectName.trim()) {
      newErrors.subjectName = "Subject name is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
    }

    if (formData.assessment <= 0) {
      newErrors.assessment = "Assessment score must be greater than 0";
    }

    if (formData.exam <= 0) {
      newErrors.exam = "Exam score must be greater than 0";
    }

    if (formData.passmark <= 0 || formData.passmark > 100) {
      newErrors.passmark = "Passmark must be between 1 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

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
          className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[95vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-offwhite flex-shrink-0">
            <h2 className="text-lg font-semibold text-dark">
              Add Subject
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
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <p className="text-sm text-gray-600 mb-4">
              Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa
              mi. Aliquam in hendrerit urna.
            </p>

            <Input
              label="Subject Name"
              name="subjectName"
              value={formData.subjectName}
              onChange={(value) => handleInputChange("subjectName", value)}
              placeholder="English Language"
              required
              error={errors.subjectName}
            />

            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={(value) => handleInputChange("code", value)}
              placeholder="ENG"
              required
              error={errors.code}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Assessment Max. Score"
                name="assessment"
                type="number"
                value={formData.assessment.toString()}
                onChange={(value) => handleInputChange("assessment", value)}
                placeholder="30"
                required
                error={errors.assessment}
              />

              <Input
                label="Exam Max. Score"
                name="exam"
                type="number"
                value={formData.exam.toString()}
                onChange={(value) => handleInputChange("exam", value)}
                placeholder="70"
                required
                error={errors.exam}
              />
            </div>

            <Input
              label="Passmark (%)"
              name="passmark"
              type="number"
              value={formData.passmark.toString()}
              onChange={(value) => handleInputChange("passmark", value)}
              placeholder="55"
              required
              error={errors.passmark}
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
              placeholder="Enter a random description..."
              rows={4}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-offwhite flex-shrink-0">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="sm"
              fullWidth={false}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              variant="secondary"
              size="sm"
              fullWidth={false}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default AddSubjectModal;
