import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import { useOrg } from "@/hooks/useOrg";
import { logger } from "@/services/logger.service";
import { Check } from "lucide-react";

const SchoolSelection: React.FC = () => {
  const { state, selectSchool } = useAuth();
  const { setActiveOrgId } = useOrg();
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSchoolSelect = (orgId: string) => {
    setSelectedSchoolId(orgId);
  };

  const handleContinue = async () => {
    if (!selectedSchoolId) return;

    setIsLoading(true);
    try {
      logger.debug("School selection requested", {
        selectedSchoolId,
        schoolCount: state.schools.length,
      });

      await selectSchool(selectedSchoolId);
      setActiveOrgId(selectedSchoolId);
    } catch (error: unknown) {
      logger.error("School selection failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to get logo URL from school object
  // Logo can be at: school.kycDocument?.logo or school.logo
  const getSchoolLogo = (school: any): string | null => {
    if (school?.kycDocument?.logo) {
      return school.kycDocument.logo;
    }
    if (school?.logo) {
      return school.logo;
    }
    return null;
  };

  // Redirect to login if no schools are available (page refresh scenario)
  if (!state.schools || state.schools.length === 0) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AuthLayout showBackAboveLogo>
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose a school
          </h1>
          <p className="text-gray-600">
            Choose a school from your profile to continue to your dashboard
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {state.schools.map((school) => {
            const logoUrl = getSchoolLogo(school);
            return (
              <div
                key={school._id}
                onClick={() => handleSchoolSelect(school._id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 relative ${
                  selectedSchoolId === school._id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                    {logoUrl ? (
                      <>
                        <img
                          src={logoUrl}
                          alt={school.organizationName}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            // Hide image and show initials on error
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const initialsSpan =
                              target.nextElementSibling as HTMLElement;
                            if (initialsSpan) {
                              initialsSpan.style.display = "flex";
                            }
                          }}
                        />
                        <span
                          className="text-pink-600 font-semibold text-lg absolute inset-0 flex items-center justify-center hidden"
                          style={{ display: "none" }}
                        >
                          {getInitials(school.organizationName)}
                        </span>
                      </>
                    ) : (
                      <span className="text-pink-600 font-semibold text-lg">
                        {getInitials(school.organizationName)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {school.organizationName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {school.organizationCategory}
                    </p>
                  </div>
                  {selectedSchoolId === school._id && (
                    <div className="absolute top-[30px] right-4 rounded-full bg-primary text-white p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedSchoolId || isLoading}
          className="w-full py-4 text-base cursor-pointer"
        >
          {isLoading ? "Loading..." : "Continue"}
        </Button>
      </div>
    </AuthLayout>
  );
};

export default SchoolSelection;
