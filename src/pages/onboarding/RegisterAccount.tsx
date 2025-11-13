import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Building, Globe } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { useFormValidation } from "../../hooks/useFormValidation";

// Country options - you can expand this list
const countryOptions = [
  { value: "ng", label: "Nigeria" },
  { value: "gh", label: "Ghana" },
  { value: "ke", label: "Kenya" },
  { value: "za", label: "South Africa" },
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
];

const RegisterAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { businessType, category } = location.state || {};

  const { formData, errors, updateField } =
    useFormValidation({
      country: "",
      businessName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation - you can add proper schema validation later
    if (!formData.country || !formData.firstName) {
      return;
    }

    // Navigate to create password page (next step in stepper)
    navigate("/create-password", {
      state: {
        businessType,
        category,
        registrationData: formData,
      },
    });
  };

  const canSubmit = formData.country && formData.firstName;

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
          <h1 className="text-2xl font-semibold text-foreground">
            Register Account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Country */}
          <Select
            label="Country"
            name="country"
            value={formData.country as string}
            onChange={(value) =>
              updateField("country", value)
            }
            options={countryOptions}
            placeholder="-- Please select --"
            icon={Globe}
            required
            error={errors.country}
          />

          {/* Business Name */}
          <Input
            label="Business Name"
            name="businessName"
            type="text"
            value={formData.businessName as string}
            onChange={(value) =>
              updateField("businessName", value)
            }
            placeholder="e.g Jasiri Tech Nigeria Ltd"
            icon={Building}
            error={errors.businessName}
          />

          {/* First Name */}
          <Input
            label="First name"
            name="firstName"
            type="text"
            value={formData.firstName as string}
            onChange={(value) =>
              updateField("firstName", value)
            }
            placeholder="e.g. Sharafadeen"
            required
            error={errors.firstName}
          />

          {/* Last Name */}
          <Input
            label="Last name"
            name="lastName"
            type="text"
            value={formData.lastName as string}
            onChange={(value) =>
              updateField("lastName", value)
            }
            placeholder="e.g. Mubarak"
            error={errors.lastName}
          />

          {/* Email */}
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email as string}
            onChange={(value) =>
              updateField("email", value)
            }
            placeholder="user@email.com"
            icon={Mail}
            error={errors.email}
          />

          {/* Phone Number */}
          <Input
            label="Phone number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber as string}
            onChange={(value) =>
              updateField("phoneNumber", value)
            }
            placeholder="+234"
            icon={Phone}
            error={errors.phoneNumber}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 text-base mt-6"
            style={{
              backgroundColor: "var(--color-secondary)",
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-secondary)";
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-secondary)";
              e.currentTarget.style.opacity = "1";
            }}
          >
            Submit
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default RegisterAccount;

