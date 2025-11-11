import { createContext } from "react";

export interface OnboardingState {
  phoneNumber: string;
  registrationData: unknown | null;
}

export interface OnboardingContextValue extends OnboardingState {
  setPhoneNumber: (phone: string) => void;
  setRegistrationData: (data: unknown | null) => void;
  reset: () => void;
}

export const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);


