import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import FeatureCard from "../../components/ui/FeatureCard";
import AuthLayout from "../../components/auth/AuthLayout";
import type { UserType, UserTypeCardProps } from "../../interface";
import { USER_TYPES, DEFAULT_USER_TYPE, FEATURE_CONTENT } from "../../data";

const UserTypeCard = ({
  title,
  description,
  icon: Icon,
  isSelected,
  onClick,
}: UserTypeCardProps) => (
  <Button
    type="button"
    onClick={onClick}
    className={`!p-6 !rounded-lg !border-2 !transition-all !w-full !text-left hover:!border-primary !border-border ${
      isSelected ? "!border-primary !bg-primary/5 !text-black" : "!bg-transparent !text-black"
    }`}
  >
    <div className="flex items-start gap-4">
      <div
        className={`p-2 rounded-lg ${
          isSelected ? "bg-primary text-white" : "bg-muted"
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </Button>
);

const AccountTypeSelection = () => {
  const [selectedType, setSelectedType] = useState<UserType["id"]>(DEFAULT_USER_TYPE);
  const navigate = useNavigate();

  return (
    <AuthLayout rightMaxWidth="max-w-2xl">
      <div className="mb-12">
        <h1 className="text-2xl font-bold mb-4 text-foreground leading-tight">
          Get Started with Fees.ng Choose your account type.
        </h1>
        <p className="text-muted-foreground text-lg">
          Select the option that best describes your role
          <br />
          to get started with the right features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {USER_TYPES.map((type) => (
          <UserTypeCard
            key={type.id}
            title={type.title}
            description={type.description}
            icon={type.icon}
            isSelected={selectedType === type.id}
            onClick={() => setSelectedType(type.id)}
          />
        ))}
      </div>

      <FeatureCard
        heading={FEATURE_CONTENT[selectedType].heading}
        items={FEATURE_CONTENT[selectedType].items}
        selectedType={selectedType}
        className="mb-6"
      />

      <Button
        onClick={() => {
          if (selectedType === "other") {
            window.location.href =
              "https://rev-direct-public.vercel.app/";
          } else {
            navigate("/school-type");
          }
        }}
        className="py-4 text-base"
      >
        Next
      </Button>
    </AuthLayout>
  );
};

export default AccountTypeSelection;
