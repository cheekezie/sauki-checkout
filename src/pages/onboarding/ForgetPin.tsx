import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import {
  phoneVerificationSchema,
  validateField,
} from "../../schemas/authSchemas";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const ForgetPin = () => {
  const { state, forgetPin } = useAuth();
  const { showSuccess, showError } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string>("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const navigate = useNavigate();

  // Prevent auto-submission on page load
  useEffect(() => {
    // No-op for now
  }, [phoneNumber, state.isLoading, isFormSubmitted]);

  const phoneValidation = validateField(
    phoneVerificationSchema.extract("phone"),
    phoneNumber
  );
  const canSubmit =
    phoneValidation.isValid && !state.isLoading && !isFormSubmitted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormSubmitted) {
      return;
    }

    if (!canSubmit) {
      if (!phoneValidation.isValid) {
        setError(phoneValidation.error || "Invalid phone number");
      }
      return;
    }

    setIsFormSubmitted(true);

    try {
      await forgetPin(phoneNumber);
      showSuccess(
        "PIN Reset Request Sent",
        "We've sent a reset code to your phone number. Please check your messages."
      );
      navigate("/reset-pin", {
        state: {
          phoneNumber: phoneNumber,
        },
      });
    } catch (error: any) {
      setIsFormSubmitted(false);
      showError(
        "Request Failed",
        error.message ||
          "Failed to process PIN reset request. Please try again."
      );
    }
  };

  return (
    <AuthLayout showBackAboveLogo>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Forgot Your PIN?
        </h1>
        <p className="text-muted-foreground">
          Enter your phone number and we'll help you reset your PIN
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        <Input
          label="Phone Number"
          name="forget-pin-phone"
          type="tel"
          value={phoneNumber}
          onChange={(value) => {
            setPhoneNumber(value);
            // Real-time validation
            const validation = validateField(
              phoneVerificationSchema.extract("phone"),
              value
            );
            if (validation.isValid) {
              setError("");
            } else if (value.length > 0) {
              setError(validation.error || "Invalid phone number");
            } else {
              setError("");
            }
          }}
          placeholder="08012345678"
          icon={Phone}
          required
          error={error}
        />

        <Button
          type="submit"
          disabled={!canSubmit || state.isLoading || isFormSubmitted}
          className="w-full py-4 text-base"
        >
          {state.isLoading
            ? "Processing..."
            : isFormSubmitted
            ? "Request Sent..."
            : "Reset PIN"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgetPin;
