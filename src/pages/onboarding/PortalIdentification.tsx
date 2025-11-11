import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const PortalIdentification = () => {
  const { state, verifyPortalId } = useAuth();
  const { showSuccess, showError } = useToast();
  const [portalId, setPortalId] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const canSubmit = portalId.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || state.isLoading) return;

    try {
      const response = await verifyPortalId(portalId);
      if (response.data.isValid) {
        showSuccess(
          "Portal ID Verified",
          "Portal ID is valid. Proceeding to registration."
        );
        navigate("/register-school", {
          state: {
            portalId,
            portalInfo: response.data.schoolInfo,
            schoolType: location.state?.schoolType,
          },
        });
      } else {
        throw new Error("Invalid Portal ID. Please check and try again.");
      }
    } catch (error: any) {
      showError(
        "Verification Failed",
        error.message ||
          state.error ||
          "Invalid Portal ID. Please check and try again."
      );
    }
  };

  return (
    <AuthLayout showBackAboveLogo>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          We want to Identify You.
        </h1>
        <p className="text-muted-foreground">Please enter your Portal ID</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Portal ID"
          name="portalId"
          type="text"
          value={portalId}
          onChange={setPortalId}
          placeholder="Myschoolportal ID"
          required
        />

        <Button
          type="submit"
          disabled={!canSubmit || state.isLoading}
          className="w-full py-4 text-base"
        >
          {state.isLoading ? "Verifying..." : "Submit"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default PortalIdentification;
