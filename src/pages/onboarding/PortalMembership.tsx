import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";

const PortalMembership = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const schoolType = location.state?.schoolType || "primary";

  const handleSelection = (selection: boolean) => {
    if (selection) {
      navigate("/portal-identification", { state: { schoolType } });
    } else {
      navigate("/register-school", { state: { schoolType } });
    }
  };

  return (
    <AuthLayout showBackAboveLogo>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Are you already a member of Myschoolportal.ng or Examportal.ng?
        </h1>
        <p className="text-muted-foreground mb-4">
          Myschoolportal and Examportal are our official school management
          portal partners.
        </p>
        <p className="text-foreground">Please select an option below.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            onClick={() => handleSelection(true)}
             className="!bg-transparent !text-black p-6 h-auto text-center border-2 border-black hover:!bg-primary/5 hover:!text-primary hover:!border-primary transition-all"
          >
            Yes
          </Button>
          <Button
            type="button"
            onClick={() => handleSelection(false)}
            className="!bg-transparent !text-black p-6 h-auto text-center border-2 border-black hover:!bg-primary/5 hover:!text-primary hover:!border-primary transition-all"
          >
            No
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default PortalMembership;
