import { useEffect, useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Shield,
  Plus,
} from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { Portal } from "../layout/Portal";
import { useFormValidation } from "../../hooks/useFormValidation";
import { logger } from "../../services/logger.service";
import { adminSchema } from "../../schemas/authSchemas";
import type { CreateAdminRequest, UpdateAdminRequest } from "../../services/admin.service";
import { genderOptions, roleOptions } from "@/constants/adminOptions";

interface Permission {
  id: string;
  title: string;
  read: boolean;
  write: boolean;
}

interface AdminData {
  id?: string;
  sn?: number;
  name: string;
  email: string;
  phoneNumber: string;
  role?: string;
  gender: "Male" | "Female" | "--";
  permissions?: Permission[];
  lastLogin?: string;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin?: AdminData | null;
  mode?: "create" | "edit" | "add"; 
  onSave: (adminData: Partial<AdminData>) => void | Promise<void>;
}

const AdminModal = ({
  isOpen,
  onClose,
  admin,
  mode,
  onSave,
}: AdminModalProps) => {
  // Determine mode: explicit mode > admin presence > default to "add"
  const isCreateMode = mode === "create";
  const isEditMode = mode === "edit" || (!!admin && mode !== "add" && mode !== "create");
  const isAddMode = mode === "add" || (!admin && !isCreateMode);

  const {
    formData,
    errors,
    updateFieldWithValidation,
    validateForm,
    setFormData,
  } = useFormValidation({
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
    gender: "Male",
  });

  // Load admin data when in edit mode
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && admin) {
        setFormData({
          name: admin.name || "",
          email: admin.email || "",
          phoneNumber: admin.phoneNumber || "",
          role: admin.role || "",
          gender: admin.gender || "Male",
        });
      } else {
        // Create/Add mode: initialize form
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          role: "",
          gender: "Male",
        });
      }
    }
  }, [isOpen, admin, isEditMode, isCreateMode, setFormData]);

  const handleInputChange = (field: string, value: string) => {
    updateFieldWithValidation(field, value, adminSchema);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    const validation = validateForm(adminSchema);

    if (!validation) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // Edit mode: format data for API - same format as create
        const updatedAdmin: UpdateAdminRequest & { id?: string } = {
          id: admin?.id,
          email: String(formData.email || "").trim(),
          fullName: String(formData.name || "").trim(),
          phoneNumber: String(formData.phoneNumber || "").trim(),
          gender: String(formData.gender || "Male").toLowerCase() as 'male' | 'female',
          role: String(formData.role || "").trim(),
        };
        await onSave(updatedAdmin as unknown as Partial<AdminData>);
        onClose();
      } else if (isCreateMode) {
        // Format data for API - backend handles permissions based on role
        const newAdmin: CreateAdminRequest = {
          email: String(formData.email || "").trim(),
          fullName: String(formData.name || "").trim(),
          phoneNumber: String(formData.phoneNumber || "").trim(),
          gender: String(formData.gender || "Male").toLowerCase() as 'male' | 'female',
          role: String(formData.role || "").trim(),
          // Permissions are NOT sent - backend assigns them based on role
        };
        await onSave(newAdmin as unknown as Partial<AdminData>);
        onClose();
      } else {
        // Add mode: simple admin creation
        const newAdmin: Partial<AdminData> = {
          name: String(formData.name || ""),
          email: String(formData.email || ""),
          phoneNumber: String(formData.phoneNumber || ""),
          gender: String(formData.gender || "Male") as "Male" | "Female" | "--",
          role: String(formData.role || ""),
          id: `admin_${Date.now()}`,
          sn: 0,
          lastLogin: new Date().toISOString().split("T")[0],
        };
        await onSave(newAdmin);
        onClose();
      }
    } catch (error) {
      logger.error("Error saving admin", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || (isEditMode && !admin)) return null;

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium text-dark mb-3 flex items-center">
          <User className="w-4 h-4 mr-2 text-primary" />
          {isCreateMode ? "Basic Information" : "Personal Information"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="Full Name"
            name="name"
            value={String(formData.name || "")}
            onChange={(value) => handleInputChange("name", value)}
            placeholder="Enter full name"
            required
            error={errors.name}
          />
          {isCreateMode && (
            <Select
              label="Role"
              name="role"
              value={String(formData.role || "")}
              onChange={(value) => handleInputChange("role", value)}
              options={roleOptions}
              required
              error={errors.role}
            />
          )}
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={String(formData.email || "")}
            onChange={(value) => handleInputChange("email", value)}
            placeholder="Enter email address"
            icon={Mail}
            required
            error={errors.email}
          />
          <Input
            label="Phone Number"
            name="phoneNumber"
            value={String(formData.phoneNumber || "")}
            onChange={(value) => handleInputChange("phoneNumber", value)}
            placeholder="Enter phone number"
            icon={Phone}
            required
            error={errors.phoneNumber}
          />
          <Select
            label="Gender"
            name="gender"
            value={String(formData.gender || "Male")}
            onChange={(value) => handleInputChange("gender", value)}
            options={genderOptions}
            error={errors.gender}
          />
          {isAddMode && (
            <Select
              label="Role"
              name="role"
              value={String(formData.role || "")}
              onChange={(value) => handleInputChange("role", value)}
              options={roleOptions}
              error={errors.role}
            />
          )}
        </div>
      </div>
    </div>
  );

  // Removed renderStep2 - permissions are handled by backend

  const getTitle = () => {
    if (isCreateMode) return "Create New Admin Staff";
    if (isEditMode) return "Edit Admin Details";
    return "Add Staff Account";
  };

  const getSubtitle = () => {
    if (isCreateMode) return "Create a new staff member account";
    if (isEditMode) return "Update staff user information";
    return "Enter staff account details";
  };

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
          className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[95vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-offwhite flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-dark">
                  {getTitle()}
                </h2>
                <p className="text-sm text-dark/70">
                  {getSubtitle()}
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
            {renderStep1()}
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
              onClick={handleSave}
              disabled={isSubmitting}
              variant="secondary"
              size="sm"
              fullWidth={false}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{mode === "create" ? "Create Admin" : "Save Changes"}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default AdminModal;

