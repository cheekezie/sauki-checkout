import { Phone, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { loginSchema } from "../../schemas/authSchemas";
import { useFormValidation } from "../../hooks/useFormValidation";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Checkbox from "../../components/ui/Checkbox";

const Login = () => {
  const { state, login } = useAuth();
  const { showSuccess, showError } = useToast();

  const [rememberMe, setRememberMe] = useState(false);

  const { formData, errors, updateFieldWithValidation, validateForm } =
    useFormValidation({
      phoneNumber: "",
      password: "",
    });

  useEffect(() => {
    const savedPhoneNumber = localStorage.getItem("rememberedPhoneNumber");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedRememberMe && savedPhoneNumber && savedPassword) {
      updateFieldWithValidation("phoneNumber", savedPhoneNumber, loginSchema);
      updateFieldWithValidation("password", savedPassword, loginSchema);
      setRememberMe(true);
    }
  }, [updateFieldWithValidation]);

  const canSubmit =
    !errors.phoneNumber &&
    !errors.password &&
    formData.phoneNumber &&
    formData.password &&
    !state.isLoading;

  const handlePhoneChange = (value: string) => {
    updateFieldWithValidation("phoneNumber", value, loginSchema);
  };

  const handlePasswordChange = (value: string) => {
    updateFieldWithValidation("password", value, loginSchema);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(loginSchema)) {
      return;
    }

    try {
      await login(formData.phoneNumber, formData.password);

      if (rememberMe) {
        localStorage.setItem("rememberedPhoneNumber", formData.phoneNumber);
        localStorage.setItem("rememberedPassword", formData.password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedPhoneNumber");
        localStorage.removeItem("rememberedPassword");
        localStorage.removeItem("rememberMe");
      }

      showSuccess("Login Successful", "Welcome back!");
    } catch (error: any) {
      // console.error("Login failed:", error);
      showError(
        "Login Failed",
        error.message ||
          state.error ||
          "Please check your credentials and try again."
      );
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Log in</h1>
        <p className="text-muted-foreground">
          Welcome back. Enter your details to continue.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handlePhoneChange}
          placeholder="08012345678"
          icon={Phone}
          required
          error={errors.phoneNumber}
        />

        <Input
          label="PIN"
          name="password"
          type="password"
          value={formData.password}
          onChange={handlePasswordChange}
          placeholder="Enter your 6-digit PIN"
          icon={Lock}
          required
          maxLength={6}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={rememberMe}
            onChange={setRememberMe}
          />
          <Link
            to="/forget-pin"
            className="text-primary font-semibold hover:text-primary/80 cursor-pointer text-sm"
          >
            Forgot PIN?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={!canSubmit || state.isLoading}
          className="py-4 text-base"
        >
          {state.isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
