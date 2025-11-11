import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";

const SchoolTypeSelection = () => {
  const [selectedSchoolType, setSelectedSchoolType] = useState<
    "primary" | "secondary" | "tertiary"
  >("primary");
  const navigate = useNavigate();

  const schoolTypes = [
    { id: "primary", label: "Primary" },
    { id: "secondary", label: "Secondary" },
    { id: "tertiary", label: "Tertiary" },
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSchoolType === "tertiary") {
      navigate("/register-school", {
        state: { schoolType: selectedSchoolType },
      });
    } else {
      navigate("/portal-membership", {
        state: { schoolType: selectedSchoolType },
      });
    }
  };

  return (
    <AuthLayout showBackAboveLogo>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          What type of school do you operate
        </h1>
        <p className="text-muted-foreground">
          Please select a school type below to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {schoolTypes.map((type) => (
            <Button
              key={type.id}
              type="button"
              onClick={() => setSelectedSchoolType(type.id)}
              className={`p-6 rounded-lg border-2 transition-all text-center ${
                selectedSchoolType === type.id
                  ? "!bg-primary/5 !text-primary border-primary"
                  : "!bg-transparent !text-black border-black hover:!bg-primary/5 hover:!text-primary hover:border-primary"
              }`}
            >
              <span className="font-medium">{type.label}</span>
            </Button>
          ))}
        </div>

        <Button type="submit" className="w-full py-4 text-base">
          Next
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SchoolTypeSelection;
