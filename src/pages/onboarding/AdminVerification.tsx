import { useState, useEffect, useRef } from "react";
import maskPhoneNumber from "../../utils/mask";
import { useNavigate, useLocation } from "react-router-dom";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { validateOTP } from "../../schemas/authSchemas";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import OTPInput from "../../components/ui/OTPInput";

const AdminVerification = () => {
  const { state, verifyAdminOTP } = useAuth();
  const { showSuccess, showError } = useToast();
  const [confirmCode, setConfirmCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber: ctxPhone } = useOnboarding();

  const phoneNumber = location.state?.phoneNumber || ctxPhone || "";

  const otpValidation = validateOTP(confirmCode);
  const canSubmit = otpValidation.isValid && !state.isLoading;

  const handleCodeChange = (value: string) => {
    setConfirmCode(value);
  };

  const handleCodeComplete = (value: string) => {
    setConfirmCode(value);
    if (value.length === 6) {
      handleAutoSubmit(value);
    }
  };

  const handleAutoSubmit = async (codeValue: string) => {
    const otpValidation = validateOTP(codeValue);
    if (!otpValidation.isValid) {
      showError(
        "Invalid Code",
        otpValidation.error || "Invalid verification code"
      );
      return;
    }

    try {
      await verifyAdminOTP(phoneNumber, codeValue);
      showSuccess(
        "Verification Successful",
        "You can now log in to your account."
      );
      navigate("/login");
    } catch (error: any) {
      showError(
        "Verification Failed",
        error.message ||
          state.error ||
          "Invalid verification code. Please try again."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAutoSubmit(confirmCode);
  };

  const maskedPhoneNumber = maskPhoneNumber(phoneNumber);

  const notifiedRef = useRef(false);
  useEffect(() => {
    if (!phoneNumber && !notifiedRef.current) {
      notifiedRef.current = true;
      showError(
        "Phone Required",
        "Please start from registration and enter your phone number."
      );
      navigate("/register", { replace: true });
    }
  }, [phoneNumber, navigate, showError]);

  if (!phoneNumber) return null;

  return (
    <AuthLayout showBackAboveLogo>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Verify OTP</h1>
        <p className="text-muted-foreground">
          Enter the verification code sent to {maskedPhoneNumber}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <OTPInput
            length={6}
            onComplete={handleCodeComplete}
            onChange={handleCodeChange}
            disabled={state.isLoading}
            className="mb-4"
          />
        </div>

        <Button
          type="submit"
          disabled={!canSubmit || state.isLoading}
          className="w-full py-4 text-base"
        >
          {state.isLoading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default AdminVerification;
