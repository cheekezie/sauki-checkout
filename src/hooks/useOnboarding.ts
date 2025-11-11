import { useContext } from "react";
import { OnboardingContext } from "@/contexts/onboardingContext";

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);

  if (!ctx) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }

  return ctx;
};

