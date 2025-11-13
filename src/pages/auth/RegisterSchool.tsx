import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Phone, Mail, Building, Tag } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { schoolRegistrationSchema } from "../../schemas/authSchemas";
import { useFormValidation } from "../../hooks/useFormValidation";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Checkbox from "../../components/ui/Checkbox";
import { getCategoryOptions } from "../../data";
import { useOnboarding } from "@/hooks/useOnboarding";

const RegisterSchool = () => {
  const { state, registerSchool } = useAuth();
  const { showSuccess, showError } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { setPhoneNumber, setRegistrationData } = useOnboarding();

  const schoolType = location.state?.schoolType || "primary";
  const isTertiary = schoolType === "tertiary";

  const { formData, errors, isValid, updateFieldWithValidation, validateForm } =
    useFormValidation({
      schoolName: "",
      contactPhone: "",
      contactEmail: "",
      category: "",
      termsAccepted: false,
    });

  const canSubmit = isValid && formData.termsAccepted && !state.isLoading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(schoolRegistrationSchema)) {
      return;
    }

    const registrationData = {
      schoolName: formData.schoolName,
      schoolType,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      category: formData.category,
    };

    try {
      await registerSchool(registrationData);
      showSuccess(
        "Registration Successful",
        "Please verify your phone number to complete registration."
      );
      setPhoneNumber(formData.contactPhone as string);
      setRegistrationData(registrationData);
      navigate("/phone-verification", {
        state: { phoneNumber: formData.contactPhone, registrationData },
        replace: true,
      });
    } catch (error: any) {
      showError(
        "Registration Failed",
        error.message ||
          state.error ||
          "Please check your information and try again."
      );
    }
  };

  // Get category options from centralized data
  const categoryOptions = getCategoryOptions(isTertiary) as any;

  return (
    <AuthLayout showBackAboveLogo>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Register as a School
        </h1>
        <p className="text-muted-foreground">
          Please input your school details to create an account.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Input
          label="School Name"
          name="schoolName"
          type="text"
          value={(formData.schoolName as string) || ""}
          onChange={(value) =>
            updateFieldWithValidation(
              "schoolName",
              value,
              schoolRegistrationSchema
            )
          }
          placeholder="Enter your school name"
          icon={Building}
          required
          error={errors.schoolName}
        />

        <Input
          label="Phone Number"
          name="contactPhone"
          type="tel"
          value={(formData.contactPhone as string) || ""}
          onChange={(value) =>
            updateFieldWithValidation(
              "contactPhone",
              value,
              schoolRegistrationSchema
            )
          }
          placeholder="08012345678"
          icon={Phone}
          maxLength={11}
          required
          error={errors.contactPhone}
        />

        <Input
          label="Email Address"
          name="contactEmail"
          type="email"
          value={(formData.contactEmail as string) || ""}
          onChange={(value) =>
            updateFieldWithValidation(
              "contactEmail",
              value,
              schoolRegistrationSchema
            )
          }
          placeholder="school@example.com"
          icon={Mail}
          required
          error={errors.contactEmail}
          helperText="Use a unique email address that hasn't been registered before"
        />

        <Select
          label={isTertiary ? "Institution Type" : "Category"}
          name="category"
          value={(formData.category as string) || ""}
          onChange={(value) =>
            updateFieldWithValidation(
              "category",
              value,
              schoolRegistrationSchema
            )
          }
          options={categoryOptions}
          placeholder={`-- Please select ${
            isTertiary ? "institution type" : "category"
          } --`}
          icon={Tag}
          required
          error={errors.category}
        />

        <Checkbox
          label="I agree to the"
          name="termsAccepted"
          checked={(formData.termsAccepted as boolean) || false}
          onChange={(checked) =>
            updateFieldWithValidation(
              "termsAccepted",
              checked,
              schoolRegistrationSchema
            )
          }
          error={errors.termsAccepted}
        >
          <a
            href="/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80"
            onClick={(e) => e.stopPropagation()}
          >
            Terms and Conditions
          </a>
        </Checkbox>

          <Button
            type="submit"
            disabled={!canSubmit || state.isLoading}
            className="w-full py-4 text-base"
          >
            {state.isLoading ? "Registering..." : "Submit"}
          </Button>
        </form>
    </AuthLayout>
  );
};

export default RegisterSchool;
