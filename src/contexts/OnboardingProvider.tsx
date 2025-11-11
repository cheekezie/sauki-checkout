import { useState, type ReactNode } from "react";
import {
  OnboardingContext,
  type OnboardingContextValue,
} from "./onboardingContext";

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [registrationData, setRegistrationData] = useState<unknown | null>(null);

  const reset = () => {
    setPhoneNumber("");
    setRegistrationData(null);
  };

  const value: OnboardingContextValue = {
    phoneNumber,
    registrationData,
    setPhoneNumber,
    setRegistrationData,
    reset,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}
