import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import FormModal from "./FormModal";
import { useFormValidation } from "../../hooks/useFormValidation";
import { organizationRegistrationSchema } from "../../schemas/organizationSchemas";
import { useToast } from "../../hooks/useToast";
import OrganizationService, { 
  type CreateOrganizationRequest,
  type UpdateOrganizationRequest 
} from "../../services/organization.service";
import type { OrganizationCategory, SchoolType, SchoolCategoryBoard } from "@/enums/merchant.enum";
import type { MerchantI } from "@/interface/organization.interface";
import { 
  TERTIARY_CATEGORY_OPTIONS, 
  PRIMARY_SECONDARY_CATEGORY_OPTIONS 
} from "@/data/school.data";
import { useUpdateOrganization } from "../../hooks/useOrganizations";

interface AddOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  organization?: MerchantI | null; // Optional - if provided, it's edit mode
  mode?: "create" | "edit"; // Explicit mode
}

const AddOrganizationModal: React.FC<AddOrganizationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  organization,
  mode,
}) => {
  const { showError } = useToast();
  const updateOrganizationMutation = useUpdateOrganization();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Determine mode: explicit mode > organization presence > default to "create"
  const isEditMode = mode === "edit" || (!!organization && mode !== "create");

  const {
    formData,
    errors,
    updateFieldWithValidation,
    validateForm,
    setFormData,
    clearErrors,
  } = useFormValidation({
    email: "",
    organizationName: "",
    organizationCategory: "school" as OrganizationCategory,
    schoolType: "primary" as SchoolType,
    schoolCategoryBoard: "privateSchool" as SchoolCategoryBoard,
  });

  // Load organization data when in edit mode or reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && organization) {
        // Edit mode: load existing organization data
        setFormData({
          email: organization.email || "",
          organizationName: organization.organizationName || "",
          organizationCategory: organization.organizationCategory || "school" as OrganizationCategory,
          schoolType: organization.schoolType || "primary" as SchoolType,
          schoolCategoryBoard: organization.schoolCategoryBoard || "privateSchool" as SchoolCategoryBoard,
        });
      } else {
        // Create mode: initialize form
        setFormData({
          email: "",
          organizationName: "",
          organizationCategory: "school" as OrganizationCategory,
          schoolType: "primary" as SchoolType,
          schoolCategoryBoard: "privateSchool" as SchoolCategoryBoard,
        });
      }
      clearErrors();
    }
  }, [isOpen, organization, isEditMode, setFormData, clearErrors]);

  // Reset schoolCategoryBoard when schoolType changes
  useEffect(() => {
    if (formData.organizationCategory === "school" && formData.schoolType) {
      const tertiaryValues = ["university", "polytechnic", "coe"];

      if (formData.schoolType === "tertiary") {
        // Reset to first tertiary option if current value is not valid for tertiary
        const currentBoard = String(formData.schoolCategoryBoard || "");
        if (!tertiaryValues.includes(currentBoard)) {
          setFormData({
            ...formData,
            schoolCategoryBoard: "university" as SchoolCategoryBoard,
          });
        }
      } else {
        // Reset to first primary/secondary option if current value is tertiary
        const currentBoard = String(formData.schoolCategoryBoard || "");
        if (tertiaryValues.includes(currentBoard)) {
          setFormData({
            ...formData,
            schoolCategoryBoard: "privateSchool" as SchoolCategoryBoard,
          });
        }
      }
    }
  }, [formData.schoolType, formData.organizationCategory, setFormData]);

  const organizationCategoryOptions = [
    { value: "school", label: "School" },
    { value: "other", label: "Other" },
  ];

  const schoolTypeOptions = [
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
    { value: "tertiary", label: "Tertiary" },
  ];

  // Get school category board options based on school type
  const getSchoolCategoryBoardOptions = () => {
    if (formData.schoolType === "tertiary") {
      return TERTIARY_CATEGORY_OPTIONS;
    }
    if (formData.schoolType === "primary") {
      // Filter primary-specific options
      return PRIMARY_SECONDARY_CATEGORY_OPTIONS.filter(
        (option) => 
          option.value !== "publicSecondarySchool" && 
          option.value !== "publicTechnicalSchool"
      );
    }
    if (formData.schoolType === "secondary") {
      // Filter secondary-specific options
      return PRIMARY_SECONDARY_CATEGORY_OPTIONS.filter(
        (option) => option.value !== "publicPrimarySchool"
      );
    }
    // Default fallback
    return PRIMARY_SECONDARY_CATEGORY_OPTIONS;
  };

  const schoolCategoryBoardOptions = getSchoolCategoryBoardOptions();

  const handleSubmit = async () => {
    // Validate form
    if (!validateForm(organizationRegistrationSchema)) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && organization) {
        // Edit mode: update organization
        // Portal admin endpoint only accepts: email, organizationName, phoneNumber
        // It does NOT accept: organizationCategory, schoolType, schoolCategoryBoard
        const payload: UpdateOrganizationRequest = {
          email: String(formData.email || "").trim(),
          organizationName: String(formData.organizationName || "").trim(),
          phoneNumber: organization.phoneNumber,
          // These fields cannot be updated via admin endpoint:
          // - organizationCategory
          // - schoolType
          // - schoolCategoryBoard
        };

        await updateOrganizationMutation.mutateAsync({ 
          id: organization._id, 
          payload 
        });
      } else {
        // Create mode: create new organization
        const payload: CreateOrganizationRequest = {
          email: String(formData.email || "").trim(),
          organizationName: String(formData.organizationName || "").trim(),
          organizationCategory: formData.organizationCategory as OrganizationCategory,
          ...(formData.organizationCategory === "school" && {
            schoolType: formData.schoolType as SchoolType,
            schoolCategoryBoard: formData.schoolCategoryBoard as SchoolCategoryBoard,
          }),
        };

        await OrganizationService.createOrganization(payload);
      }

      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : isEditMode 
          ? "An error occurred while updating the organization."
          : "An error occurred while creating the organization.";
      showError(
        isEditMode ? "Failed to Update Organization" : "Failed to Create Organization",
        errorMessage
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      clearErrors();
      onClose();
    }
  };

  const isSchoolCategory = String(formData.organizationCategory || "") === "school";
  const canSubmit = 
    String(formData.email || "").trim() &&
    String(formData.organizationName || "").trim() &&
    (!isSchoolCategory || (formData.schoolType && formData.schoolCategoryBoard));

  const getTitle = () => {
    if (isEditMode) return "Edit Organization";
    return "Add Organization";
  };

  const getSubtitle = () => {
    if (isEditMode) return "Update organization information";
    return "Create a new organization or school";
  };

  const getSaveText = () => {
    if (isSubmitting) {
      return isEditMode ? "Updating..." : "Creating...";
    }
    return isEditMode ? "Update Organization" : "Create Organization";
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      subtitle={getSubtitle()}
      icon={<Building2 className="w-5 h-5 text-primary" />}
      onSave={handleSubmit}
      onCancel={handleCancel}
      saveText={getSaveText()}
      cancelText="Cancel"
      maxWidth="max-w-md"
      saveDisabled={!canSubmit || isSubmitting}
    >
      <div className="space-y-4">
        {/* Email */}
        <Input
          label="Email"
          name="email"
          type="email"
          value={String(formData.email || "")}
          onChange={(value) =>
            updateFieldWithValidation(
              "email",
              value,
              organizationRegistrationSchema
            )
          }
          placeholder="organization@example.com"
          error={errors.email}
          disabled={isSubmitting}
          required
        />

        {/* Organization Name */}
        <Input
          label="Organization Name"
          name="organizationName"
          type="text"
          value={String(formData.organizationName || "")}
          onChange={(value) =>
            updateFieldWithValidation(
              "organizationName",
              value,
              organizationRegistrationSchema
            )
          }
          placeholder="Enter organization name"
          error={errors.organizationName}
          disabled={isSubmitting}
          required
        />

        {/* Organization Category */}
        <Select
          name="organizationCategory"
          label="Organization Category"
          value={String(formData.organizationCategory || "")}
          onChange={(value) =>
            updateFieldWithValidation(
              "organizationCategory",
              value,
              organizationRegistrationSchema
            )
          }
          options={organizationCategoryOptions}
          error={errors.organizationCategory}
          disabled={isSubmitting || isEditMode}
          required
        />

        {/* School Type - Only show if category is "school" */}
        {isSchoolCategory && (
          <Select
            name="schoolType"
            label="School Type"
            value={String(formData.schoolType || "")}
            onChange={(value) =>
              updateFieldWithValidation(
                "schoolType",
                value,
                organizationRegistrationSchema
              )
            }
            options={schoolTypeOptions}
            error={errors.schoolType}
            disabled={isSubmitting || isEditMode}
            required
          />
        )}

        {/* School Category Board - Only show if category is "school" */}
        {isSchoolCategory && (
          <Select
            name="schoolCategoryBoard"
            label={formData.schoolType === "tertiary" ? "Institution Type" : "School Category Board"}
            value={String(formData.schoolCategoryBoard || "")}
            onChange={(value) =>
              updateFieldWithValidation(
                "schoolCategoryBoard",
                value,
                organizationRegistrationSchema
              )
            }
            options={schoolCategoryBoardOptions}
            error={errors.schoolCategoryBoard}
            disabled={isSubmitting || isEditMode}
            required
          />
        )}
      </div>
    </FormModal>
  );
};

export default AddOrganizationModal;

