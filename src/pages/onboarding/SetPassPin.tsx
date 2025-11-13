import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { validatePIN } from "../../schemas/authSchemas";

const SetPassPin = () => {
  const { state, setPassPin } = useAuth();
  const { showSuccess, showError } = useToast();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [errors, setErrors] = useState<{
    pin?: string;
    confirmPin?: string;
  }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber;

  const pinValidation = validatePIN(pin);
  const confirmPinValidation = validatePIN(confirmPin);
  const pinsMatch = pin === confirmPin && pin.length > 0;

  const canSubmit =
    pinValidation.isValid &&
    confirmPinValidation.isValid &&
    pinsMatch &&
    !state.isLoading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      if (!pinValidation.isValid) {
        setErrors((prev) => ({ ...prev, pin: pinValidation.error }));
      }
      if (!confirmPinValidation.isValid) {
        setErrors((prev) => ({
          ...prev,
          confirmPin: confirmPinValidation.error,
        }));
      }
      if (!pinsMatch) {
        setErrors((prev) => ({ ...prev, confirmPin: "PINs do not match" }));
      }
      return;
    }

    try {
      await setPassPin(phoneNumber, pin);
      showSuccess(
        "PIN Set Successfully",
        "Your PIN has been set. You can now log in to your account."
      );
      navigate("/login");
    } catch (error: any) {
      showError(
        "PIN Setting Failed",
        error.message || "Failed to set PIN. Please try again."
      );
    }
  };

  return (
    <AuthLayout showBackAboveLogo>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Set Your PIN
        </h1>
        <p className="text-muted-foreground">
          Create a secure PIN for your account
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Input
          label="PIN"
          name="pin"
          type="password"
          value={pin}
          onChange={(value) => {
            setPin(value);
            // Validate PIN in real-time
            const validation = validatePIN(value);
            setErrors((prev) => ({
              ...prev,
              pin: validation.isValid ? undefined : validation.error,
            }));
            if (value === confirmPin && confirmPin.length > 0) {
              setErrors((prev) => ({ ...prev, confirmPin: undefined }));
            } else if (confirmPin.length > 0 && value !== confirmPin) {
              setErrors((prev) => ({
                ...prev,
                confirmPin: "PINs do not match",
              }));
            }
          }}
          placeholder="Enter 6-digit PIN (numbers only)"
          required
          maxLength={6}
          error={errors.pin}
        />

        <Input
          label="Confirm PIN"
          name="confirmPin"
          type="password"
          value={confirmPin}
          onChange={(value) => {
            setConfirmPin(value);
            const validation = validatePIN(value);
            setErrors((prev) => ({
              ...prev,
              confirmPin: validation.isValid ? undefined : validation.error,
            }));
            if (pin.length > 0 && value.length > 0) {
              if (pin === value) {
                setErrors((prev) => ({ ...prev, confirmPin: undefined }));
              } else {
                setErrors((prev) => ({
                  ...prev,
                  confirmPin: "PINs do not match",
                }));
              }
            }
          }}
          placeholder="Confirm your 6-digit PIN (numbers only)"
          required
          maxLength={6}
          error={errors.confirmPin}
        />

        <Button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-4 text-base"
        >
          {state.isLoading ? "Setting PIN..." : "Set PIN"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SetPassPin;
