import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useFormValidation } from "../../hooks/useFormValidation";
import { phoneOnlySchema } from "../../schemas/authSchemas";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const Verification = () => {
  const { state, resendPhoneOTP } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const { formData, errors, isValid, updateFieldWithValidation, validateForm } =
    useFormValidation({
      phone: "",
    });

  const canSubmit = isValid && !state.isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("📝 Form submitted with data:", formData);

    // Add detailed validation debugging
    const validationResult = validateForm(phoneOnlySchema);
    // console.log("🔍 Form validation result:", validationResult);
    // console.log("📱 Phone number being validated:", formData.phone);
    // console.log("📱 Phone number length:", formData.phone?.length);
    // console.log(
    //   "📱 Phone number digits only:",
    //   formData.phone?.replace(/\D/g, "")
    // );

    if (!validationResult) {
      // console.log("❌ Form validation failed");
      // console.log("❌ Form errors:", errors);
      return;
    }

    try {
      // console.log("📱 Sending OTP to:", formData.phone);
      await resendPhoneOTP(formData.phone);
      // console.log("✅ OTP sent successfully");
      showSuccess(
        "OTP Sent",
        "A new verification code has been sent to your phone number."
      );

      // Navigate to phone verification page where user can enter the 6-digit OTP
      navigate("/phone-verification", {
        state: {
          phoneNumber: formData.phone,
        },
      });
    } catch (error: any) {
      // console.error("❌ OTP send failed:", error);
      showError(
        "Resend Failed",
        error.message || "Failed to resend OTP. Please try again."
      );
    }
  };

  return (
    <AuthLayout showBackAboveLogo>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Complete Your Registration
        </h1>
        <p className="text-muted-foreground">
          We need to verify your phone number to complete your account setup
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(value) =>
            updateFieldWithValidation("phone", value, phoneOnlySchema)
          }
          placeholder="08012345678"
          icon={Phone}
          maxLength={11}
          required
          error={errors.phone}
        />

        <Button type="submit" disabled={!canSubmit || state.isLoading}>
          {state.isLoading ? "Sending..." : "Send Verification Code"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Verification;
