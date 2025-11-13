import { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Users,
  Plus,
} from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { Portal } from "../layout/Portal";
import { useFormValidation } from "../../hooks/useFormValidation";
import {
  parentSchema,
  wardSchema,
  validateObject,
} from "../../schemas/authSchemas";
import type { Parent, Ward } from "../../interface/user.interface";

interface ParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  parent?: Parent | null; // Optional - if provided, it's edit mode
  onSave: (parentData: Partial<Parent>) => void;
  editMode?: boolean; // Explicit edit mode flag (if parent is provided, this is inferred)
  mode?: "create" | "edit"; // Mode for the modal
}

const ParentModal = ({
  isOpen,
  onClose,
  mode = "create",
  parent,
  onSave,
  editMode = false,
}: ParentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = editMode || !!parent;

  const {
    formData,
    errors,
    updateFieldWithValidation,
    validateForm,
    setFormData,
  } = useFormValidation({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    occupation: "",
    relationship: "Father",
    status: "active",
  });

  const [wardsData, setWardsData] = useState<Ward[]>([]);
  const [wardErrors, setWardErrors] = useState<Record<string, string>>({});

  // Load parent data when in edit mode
  useEffect(() => {
    if (isEditMode && parent) {
      setFormData({
        firstName: parent.firstName || "",
        lastName: parent.lastName || "",
        email: parent.email || "",
        phoneNumber: parent.phoneNumber || "",
        address: parent.address || "",
        occupation: parent.occupation || "",
        relationship: parent.relationship || "Father",
        status: parent.status || "active",
      });
      setWardsData(parent.wards || []);
    } else {
      // Reset form for add mode
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        occupation: "",
        relationship: "Father",
        status: "active",
      });
      setWardsData([]);
      setWardErrors({});
    }
  }, [parent, isEditMode, setFormData]);

  const handleInputChange = (field: string, value: string) => {
    updateFieldWithValidation(field, value, parentSchema);
  };

  const handleWardChange = (index: number, field: string, value: string) => {
    setWardsData((prev) =>
      prev.map((ward, i) => (i === index ? { ...ward, [field]: value } : ward))
    );

    // Validate ward field
    const wardKey = `ward_${index}_${field}`;
    const wardData = { ...wardsData[index], [field]: value };
    const validation = validateObject(wardSchema, wardData);

    setWardErrors((prev) => {
      const newErrors = { ...prev };
      if (validation.errors[field as keyof typeof validation.errors]) {
        newErrors[wardKey] =
          validation.errors[field as keyof typeof validation.errors];
      } else {
        delete newErrors[wardKey];
      }
      return newErrors;
    });
  };

  const handleAddWard = () => {
    setWardsData((prev) => [
      ...prev,
      {
        id: `ward_${Date.now()}`,
        firstName: "",
        lastName: "",
        class: "",
        studentId: "",
        relationship: "Son",
      },
    ]);
  };

  const handleRemoveWard = (index: number) => {
    setWardsData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const validation = validateForm(parentSchema);

    if (!validation) {
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        await onSave({ ...formData });
      } else if (mode === "edit" && parent) {
        await onSave({ ...formData });
      }
      onClose();
    } catch (error) {
      // logger.error("Failed to save parent", error); // Assuming logger is defined elsewhere
    }
    setIsSubmitting(false);
  };

  if (!isOpen || (isEditMode && !parent)) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Portal>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={handleBackdropClick}
      >
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[95vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-offwhite flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-dark">
                  {isEditMode ? "Edit Parent Details" : "Add New Parent"}
                </h2>
                <p className="text-sm text-dark/70">
                  {isEditMode
                    ? "Update parent information and ward details"
                    : "Enter parent information and ward details"}
                </p>
              </div>
            </div>
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
            {/* Parent Information */}
            <div className="mb-6">
              <h3 className="text-base font-medium text-dark mb-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-primary" />
                Parent Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  name="firstName"
                  value={(formData.firstName as string) || ""}
                  onChange={(value) => handleInputChange("firstName", value)}
                  placeholder="Enter first name"
                  required
                  error={errors.firstName}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={(formData.lastName as string) || ""}
                  onChange={(value) => handleInputChange("lastName", value)}
                  placeholder="Enter last name"
                  required
                  error={errors.lastName}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={(formData.email as string) || ""}
                  onChange={(value) => handleInputChange("email", value)}
                  placeholder="Enter email address"
                  icon={Mail}
                  required
                  error={errors.email}
                />
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  value={(formData.phoneNumber as string) || ""}
                  onChange={(value) => handleInputChange("phoneNumber", value)}
                  placeholder="Enter phone number"
                  icon={Phone}
                  required
                  error={errors.phoneNumber}
                />
                <Input
                  label="Address"
                  name="address"
                  value={(formData.address as string) || ""}
                  onChange={(value) => handleInputChange("address", value)}
                  placeholder="Enter address"
                  icon={MapPin}
                  error={errors.address}
                />
                <Input
                  label="Occupation"
                  name="occupation"
                  value={(formData.occupation as string) || ""}
                  onChange={(value) => handleInputChange("occupation", value)}
                  placeholder="Enter occupation"
                  icon={Briefcase}
                  error={errors.occupation}
                />
                <Select
                  label="Relationship"
                  name="relationship"
                  value={(formData.relationship as string) || "Father"}
                  onChange={(value) => handleInputChange("relationship", value)}
                  options={[
                    { value: "Father", label: "Father" },
                    { value: "Mother", label: "Mother" },
                    { value: "Guardian", label: "Guardian" },
                  ]}
                  error={errors.relationship}
                />
                <Select
                  label="Status"
                  name="status"
                  value={(formData.status as string) || "active"}
                  onChange={(value) => handleInputChange("status", value)}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  error={errors.status}
                />
              </div>
            </div>

            {/* Wards Information */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-medium text-dark flex items-center">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  Ward Information
                </h3>
                <Button
                  onClick={handleAddWard}
                  fullWidth={false}
                  className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-sm px-3 py-2 rounded-md"
                >
                  <Users className="w-4 h-4" />
                  <span>Add Ward</span>
                </Button>
              </div>

              {wardsData.length === 0 ? (
                <div className="text-center py-6 text-dark/60 bg-offwhite rounded-lg border-2 border-dashed border-primary/20">
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary/40" />
                  <p className="text-sm">No wards added yet</p>
                  <p className="text-xs text-dark/40">
                    Click "Add Ward" to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {wardsData.map((ward, index) => (
                    <div
                      key={ward.id}
                      className="bg-offwhite rounded-lg p-3 border border-primary/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-dark text-sm">
                          Ward {index + 1}
                        </h4>
                        <button
                          onClick={() => handleRemoveWard(index)}
                          className="text-primary hover:text-primary/80 p-1 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        <Input
                          label="First Name"
                          name={`ward_${index}_firstName`}
                          value={ward.firstName}
                          onChange={(value) =>
                            handleWardChange(index, "firstName", value)
                          }
                          placeholder="Enter first name"
                          error={wardErrors[`ward_${index}_firstName`]}
                        />
                        <Input
                          label="Last Name"
                          name={`ward_${index}_lastName`}
                          value={ward.lastName}
                          onChange={(value) =>
                            handleWardChange(index, "lastName", value)
                          }
                          placeholder="Enter last name"
                          error={wardErrors[`ward_${index}_lastName`]}
                        />
                        <Input
                          label="Class"
                          name={`ward_${index}_class`}
                          value={ward.class}
                          onChange={(value) =>
                            handleWardChange(index, "class", value)
                          }
                          placeholder="Enter class"
                          error={wardErrors[`ward_${index}_class`]}
                        />
                        <Input
                          label="Student ID"
                          name={`ward_${index}_studentId`}
                          value={ward.studentId}
                          onChange={(value) =>
                            handleWardChange(index, "studentId", value)
                          }
                          placeholder="Enter student ID"
                          error={wardErrors[`ward_${index}_studentId`]}
                        />
                        <Select
                          label="Relationship"
                          name={`ward_${index}_relationship`}
                          value={ward.relationship}
                          onChange={(value) =>
                            handleWardChange(index, "relationship", value)
                          }
                          options={[
                            { value: "Son", label: "Son" },
                            { value: "Daughter", label: "Daughter" },
                            { value: "Ward", label: "Ward" },
                          ]}
                          error={wardErrors[`ward_${index}_relationship`]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-offwhite flex-shrink-0">
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
              disabled={isSubmitting}
              variant="secondary"
              size="sm"
              fullWidth={false}
              className="flex items-center gap-2"
              onClick={() => handleSubmit()}
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{mode === "create" ? "Add Parent" : "Save Changes"}</span>
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ParentModal;

