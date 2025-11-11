import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building, User, Users, ArrowLeft } from "lucide-react";
import Button from "../../components/ui/Button";
import AuthLayout from "../../components/auth/AuthLayout";
import Select from "../../components/ui/Select";

type BusinessType = "government" | "individual" | "corporate";

const businessTypes = [
  {
    id: "government" as BusinessType,
    title: "Government",
    icon: Building,
    description: "For government institutions and agencies",
  },
  {
    id: "individual" as BusinessType,
    title: "Individual",
    icon: User,
    description: "For personal business accounts",
  },
  {
    id: "corporate" as BusinessType,
    title: "Corporate",
    icon: Users,
    description: "For businesses and organizations",
  },
];

const businessCategories = [
  { value: "ecommerce", label: "E-commerce" },
  { value: "saas", label: "SaaS" },
  { value: "logistics", label: "Logistics" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "retail", label: "Retail" },
  { value: "other", label: "Other" },
];

const AccountTypeSelection = () => {
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType>("corporate");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      return;
    }

    // Navigate to register account form (next step in stepper)
    navigate("/register-account", {
      state: { businessType: selectedBusinessType, category: selectedCategory },
    });
  };

  const canSubmit = selectedBusinessType && selectedCategory;

  return (
    <AuthLayout showLogo={false}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-105 border-0 outline-none group"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground transition-transform duration-200 group-hover:-translate-x-1" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground">Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Type Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-4">
              Business type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {businessTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedBusinessType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedBusinessType(type.id)}
                    className={`
                      p-6 rounded-lg border-2 transition-all text-left
                      ${isSelected
                        ? "border-secondary bg-secondary/5"
                        : "border-gray-300 bg-white hover:border-secondary/50"
                      }
                    `}
                  >
                    <div className="flex flex-col items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? "bg-secondary text-white" : "bg-gray-100"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">{type.title}</h3>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business Category */}
          <Select
            label="Business Category"
            name="category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={businessCategories}
            placeholder="E-commerce, Saas, Logistics etc."
            required
          />

          {/* Legal Disclaimer */}
          <p className="text-sm text-muted-foreground text-center">
            By clicking on Create Account, you agree to Sauki Payment Services{" "}
            <Link
              to="/terms-and-conditions"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              to="/terms-and-conditions"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Terms of Use
            </Link>
            .
          </p>

          {/* Create Account Button */}
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 text-base"
            style={{
              backgroundColor: 'var(--color-secondary)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
              e.currentTarget.style.opacity = '1';
            }}
          >
            Create Account
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already Registered?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:text-primary/80"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AccountTypeSelection;
