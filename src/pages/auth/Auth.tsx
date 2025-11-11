import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import FeatureCard from "../../components/ui/FeatureCard";
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
    className={`p-6 rounded-lg border-2 transition-all w-full text-left hover:border-primary bg-transparent hover:bg-primary/5 ${
      isSelected ? "border-primary bg-primary/5" : "border-border"
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

const Auth = () => {
  const [selectedType, setSelectedType] = useState<UserType["id"]>(DEFAULT_USER_TYPE);
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground leading-tight">
          Welcome to SaukiPay,
          <br />
          unlock new experiences.
        </h1>
        <p className="text-muted-foreground text-lg">
          Empower educators, elevate the learning experience.
          <br />
          Enroll & start your journey today.
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
            window.open("https://rev-direct-public.vercel.app/", "_blank");
          } else {
            navigate("/login");
          }
        }}
        className="py-4 text-base"
      >
        Login
      </Button>
    </>
  );
};

export default Auth;
