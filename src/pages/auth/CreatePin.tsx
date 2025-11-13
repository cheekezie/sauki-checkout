import AuthLayout from "../../components/auth/AuthLayout";
import { Lock } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { createPinSchema } from "../../schemas/authSchemas";
import { useFormValidation } from "../../hooks/useFormValidation";

const CreatePin = () => {
  const {
    formData,
    errors,
    updateFieldWithValidation,
    validateForm,
  } = useFormValidation({
    pin: "",
    confirmPin: "",
  });

  const canSubmit = !errors.pin && !errors.confirmPin && formData.pin && formData.confirmPin;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(createPinSchema)) {
      return;
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Create New PIN
        </h1>
        <p className="text-muted-foreground">
          Create a new 6-digit PIN that contains only numbers
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <Input
              label="PIN"
              name="pin"
              type="password"
              value={(formData.pin as string) || ""}
              onChange={(value) => updateFieldWithValidation("pin", value, createPinSchema)}
              placeholder="Enter your 6-digit PIN"
              icon={Lock}
              required
              maxLength={6}
              error={errors.pin}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              PIN requirements:
            </p>
            <div
              className={`flex items-center gap-2 text-sm ${
                (formData.pin as string)?.length === 6 ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>{(formData.pin as string)?.length === 6 ? "✓" : "✕"}</span>
              <span>Exactly 6 digits</span>
            </div>
            <div
              className={`flex items-center gap-2 text-sm ${
                /^\d*$/.test((formData.pin as string) || "") ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>{/^\d*$/.test((formData.pin as string) || "") ? "✓" : "✕"}</span>
              <span>Numbers only</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Confirm PIN"
            name="confirmPin"
            type="password"
            value={(formData.confirmPin as string) || ""}
            onChange={(value) => updateFieldWithValidation("confirmPin", value, createPinSchema)}
            placeholder="Confirm your PIN"
            icon={Lock}
            required
            maxLength={6}
            error={errors.confirmPin}
          />

          <Button type="submit" disabled={!canSubmit} className="mt-4">
            Create PIN
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default CreatePin;
