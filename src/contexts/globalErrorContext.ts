import { createContext } from "react";

export type GlobalErrorType = "error" | "warning" | "info";

export interface GlobalError {
  id: string;
  message: string;
  details?: string;
  timestamp: Date;
  type: GlobalErrorType;
}

export interface GlobalErrorContextValue {
  errors: GlobalError[];
  addError: (message: string, details?: string, type?: GlobalErrorType) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
}

export const GlobalErrorContext = createContext<GlobalErrorContextValue | undefined>(
  undefined
);


