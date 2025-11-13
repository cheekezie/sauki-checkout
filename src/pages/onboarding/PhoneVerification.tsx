import { useState, useEffect, useRef } from "react";
import maskPhoneNumber from "../../utils/mask";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { validateOTP } from "../../schemas/authSchemas";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import OTPInput from "../../components/ui/OTPInput";
import { useOnboarding } from "@/hooks/useOnboarding";

 
const PhoneVerification = () => {
  const { state, verifyPhone, resendPhoneOTP } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const onboarding = useOnboarding();

  const phoneNumber =
    location.state?.phoneNumber || onboarding.phoneNumber || "";
  const registrationData =
    location.state?.registrationData || onboarding.registrationData || null;

  const otpValidation = validateOTP(otp);
  const canSubmit = otpValidation.isValid && !state.isLoading;

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleOtpComplete = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      handleAutoSubmit(value);
    }
  };

  const handleAutoSubmit = async (otpValue: string) => {
    const otpValidation = validateOTP(otpValue);
    if (!otpValidation.isValid) {
      showError(
        "Invalid Code",
        otpValidation.error || "Invalid verification code"
      );
      return;
    }

    try {
      await verifyPhone(phoneNumber, otpValue);
      showSuccess(
        "Phone Verified",
        "Your phone number has been successfully verified!"
      );
      navigate("/set-pass-pin", {
        state: {
          phoneNumber,
          registrationData,
        },
      });
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
    await handleAutoSubmit(otp);
  };

  const handleResendOTP = async () => {
    if (!phoneNumber) {
      showError(
        "Phone Number Required",
        "Phone number not available. Please go back and re-enter your phone number."
      );
      return;
    }

    try {
      await resendPhoneOTP(phoneNumber);
      showInfo(
        "OTP Sent",
        "A new verification code has been sent to your phone."
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message?.includes("Route Not Found")
      ) {
        showError(
          "Resend Not Available",
          "Resend OTP feature is not available. Please contact support or try again later."
        );
      } else {
        showError(
          "Resend Failed",
          state.error || "Failed to resend OTP. Please try again."
        );
      }
    }
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
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Verify Phone Number
        </h1>
        <p className="text-muted-foreground">
          We've sent a verification code to {maskedPhoneNumber}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <OTPInput
            length={6}
            onComplete={handleOtpComplete}
            onChange={handleOtpChange}
            disabled={state.isLoading}
            className="mb-4"
          />
        </div>

        <Button
          type="submit"
          disabled={!canSubmit || state.isLoading}
          className="w-full py-4 text-base"
        >
          {state.isLoading ? "Verifying..." : "Verify Phone Number"}
        </Button>
      </form>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={state.isLoading}
          className="text-primary hover:text-primary/80 text-sm font-medium"
        >
          Didn't receive the code? Resend
        </button>
      </div>
    </AuthLayout>
  );
};

export default PhoneVerification;
