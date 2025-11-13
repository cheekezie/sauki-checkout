import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Lock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { validatePhoneNumber, validatePIN } from "../../schemas/authSchemas";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const AdminOTP = () => {
  const { state, sendAdminOTP } = useAuth();
  const { showSuccess, showError } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState<{ phoneNumber?: string; pin?: string }>(
    {}
  );
  const navigate = useNavigate();

  const phoneValidation = validatePhoneNumber(phoneNumber);
  const pinValidation = validatePIN(pin);
  const canSubmit =
    phoneValidation.isValid && pinValidation.isValid && !state.isLoading;

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneValidation = validatePhoneNumber(phoneNumber);
    const pinValidation = validatePIN(pin);

    if (!phoneValidation.isValid || !pinValidation.isValid) {
      setErrors({
        phoneNumber: phoneValidation.error,
        pin: pinValidation.error,
      });
      return;
    }

    try {
      await sendAdminOTP(phoneNumber, pin);
      showSuccess("OTP Sent", "Verification code sent to your phone number.");
      navigate("/admin-verification", { state: { phoneNumber } });
    } catch (error: any) {
      showError(
        "OTP Failed",
        error.message || state.error || "Failed to send OTP. Please try again."
      );
    }
  };

  return (
    <AuthLayout showBackAboveLogo>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Admin Login</h1>
        <p className="text-muted-foreground">
          Enter your phone number and PIN to receive OTP
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="08012345678"
          icon={Phone}
          required
          error={errors.phoneNumber}
        />

        <Input
          label="PIN"
          name="pin"
          type="password"
          value={pin}
          onChange={(value) => setPin(value)}
          placeholder="Enter your 6-digit PIN"
          icon={Lock}
          required
          maxLength={6}
          error={errors.pin}
        />

        <Button
          type="submit"
          disabled={!canSubmit || state.isLoading}
          className="w-full py-4 text-base"
        >
          {state.isLoading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default AdminOTP;
