import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Phone, Lock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useModal } from "../../hooks/useModal";
import { validatePhoneNumber, validatePIN } from "../../schemas/authSchemas";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const ResetPin = () => {
  const { state, resetPin } = useAuth();
  const { showError } = useToast();
  const { showModal } = useModal();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [errors, setErrors] = useState<{
    phoneNumber?: string;
    resetCode?: string;
    newPin?: string;
    confirmPin?: string;
  }>({});
  const location = useLocation();

  const initialPhoneNumber = location.state?.phoneNumber || "";

  const phoneValidation = validatePhoneNumber(
    phoneNumber || initialPhoneNumber
  );
  const resetCodeValidation = validatePIN(resetCode);
  const newPinValidation = validatePIN(newPin);
  const confirmPinValidation = validatePIN(confirmPin);

  const canSubmit =
    phoneValidation.isValid &&
    resetCodeValidation.isValid &&
    newPinValidation.isValid &&
    confirmPinValidation.isValid &&
    newPin === confirmPin &&
    !state.isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneValidation = validatePhoneNumber(
      phoneNumber || initialPhoneNumber
    );
    const resetCodeValidation = validatePIN(resetCode);
    const newPinValidation = validatePIN(newPin);
    const confirmPinValidation = validatePIN(confirmPin);

    if (
      !phoneValidation.isValid ||
      !resetCodeValidation.isValid ||
      !newPinValidation.isValid ||
      !confirmPinValidation.isValid
    ) {
      setErrors({
        phoneNumber: phoneValidation.error,
        resetCode: resetCodeValidation.error,
        newPin: newPinValidation.error,
        confirmPin: confirmPinValidation.error,
      });
      return;
    }

    if (newPin !== confirmPin) {
      setErrors({
        confirmPin: "PINs do not match",
      });
      return;
    }

    try {
      const result = await resetPin(
        phoneNumber || initialPhoneNumber,
        resetCode,
        newPin
      );

      // Show success modal if reset was successful
      if (result?.success) {
        showModal({
          type: "pin-success",
          title: "PIN Reset Successful",
          message:
            "Your PIN has been successfully reset. You can now login with your new PIN.",
          confirmText: "Login",
          onConfirm: () => navigate("/login"),
        });
      }
    } catch (error: any) {
      showError(
        "Reset Failed",
        error.message ||
          "Failed to reset PIN. Please check your reset code and try again."
      );
    }
  };

  return (
    <AuthLayout showBackAboveLogo>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Reset Your PIN
        </h1>
        <p className="text-muted-foreground">
          Enter your phone number, reset code, and new PIN to complete the reset
          process
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={phoneNumber || initialPhoneNumber}
          onChange={(value) => {
            setPhoneNumber(value);
            if (errors.phoneNumber) {
              setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
            }
          }}
          placeholder="08012345678"
          icon={Phone}
          required
          error={errors.phoneNumber}
        />

        <Input
          label="Reset Code"
          name="resetCode"
          type="text"
          value={resetCode}
          onChange={(value) => {
            setResetCode(value);
            if (errors.resetCode) {
              setErrors((prev) => ({ ...prev, resetCode: undefined }));
            }
          }}
          placeholder="Enter 6-digit reset code"
          icon={Lock}
          maxLength={6}
          required
          error={errors.resetCode}
        />

        <Input
          label="New PIN"
          name="newPin"
          type="password"
          value={newPin}
          onChange={(value) => {
            setNewPin(value);
            if (errors.newPin) {
              setErrors((prev) => ({ ...prev, newPin: undefined }));
            }
          }}
          placeholder="Enter new 6-digit PIN"
          icon={Lock}
          maxLength={6}
          required
          error={errors.newPin}
        />

        <Input
          label="Confirm New PIN"
          name="confirmPin"
          type="password"
          value={confirmPin}
          onChange={(value) => {
            setConfirmPin(value);
            if (errors.confirmPin) {
              setErrors((prev) => ({ ...prev, confirmPin: undefined }));
            }
          }}
          placeholder="Confirm new PIN"
          icon={Lock}
          maxLength={6}
          required
          error={errors.confirmPin}
        />

        <Button
          type="submit"
          disabled={!canSubmit || state.isLoading}
          className="w-full py-4 text-base"
        >
          {state.isLoading ? "Resetting PIN..." : "Reset PIN"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPin;
