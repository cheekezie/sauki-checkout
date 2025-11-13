import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Portal } from "../layout/Portal";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

interface CourseData {
  courseTitle: string;
  courseCode: string;
  creditUnit: number;
  assessment: number;
  exam: number;
  passmark: number;
  description: string;
}

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: CourseData) => void;
  editMode?: boolean;
  courseData?: CourseData;
}

const AddCourseModal = ({
  isOpen,
  onClose,
  onSave,
  editMode = false,
  courseData,
}: AddCourseModalProps) => {
  const [formData, setFormData] = useState<CourseData>({
    courseTitle: "",
    courseCode: "",
    creditUnit: 10,
    assessment: 30,
    exam: 70,
    passmark: 55,
    description: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CourseData, string>>
  >({});

  useEffect(() => {
    if (isOpen) {
      if (editMode && courseData) {
        setFormData(courseData);
      } else {
        setFormData({
          courseTitle: "",
          courseCode: "",
          creditUnit: 10,
          assessment: 30,
          exam: 70,
          passmark: 55,
          description: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, editMode, courseData]);

  const handleInputChange = (field: keyof CourseData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "description" ||
        field === "courseTitle" ||
        field === "courseCode"
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
    const newErrors: Partial<Record<keyof CourseData, string>> = {};

    if (!formData.courseTitle.trim()) {
      newErrors.courseTitle = "Course title is required";
    }

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = "Course code is required";
    }

    if (formData.creditUnit <= 0) {
      newErrors.creditUnit = "Credit unit must be greater than 0";
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
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-in fade-in-0 zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              {editMode ? "Edit Course" : "Add Single Course"}
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
              label="Course Title"
              name="courseTitle"
              value={formData.courseTitle}
              onChange={(value) => handleInputChange("courseTitle", value)}
              placeholder="Product Design"
              required
              error={errors.courseTitle}
            />

            <Input
              label="Course Code"
              name="courseCode"
              value={formData.courseCode}
              onChange={(value) => handleInputChange("courseCode", value)}
              placeholder="PDN-100"
              required
              error={errors.courseCode}
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Credit Unit"
                name="creditUnit"
                type="number"
                value={formData.creditUnit.toString()}
                onChange={(value) => handleInputChange("creditUnit", value)}
                placeholder="10"
                required
                error={errors.creditUnit}
              />

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
              helperText="credit unit, course code & title"
              rows={4}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="sm"
              fullWidth={false}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              variant="secondary"
              size="sm"
              fullWidth={false}
            >
              {editMode ? "Save" : "Add Course"}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default AddCourseModal;
