import { useState, useCallback, type ReactNode } from "react";
import { logger } from "../services/logger.service";
import {
  GlobalErrorContext,
  type GlobalError,
  type GlobalErrorContextValue,
  type GlobalErrorType,
} from "./globalErrorContext";

export function GlobalErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<GlobalError[]>([]);

  const addError = useCallback((
    message: string,
    details?: string,
    type: GlobalErrorType = "error"
  ) => {
    const error: GlobalError = {
      id: Date.now().toString(),
      message,
      details,
      timestamp: new Date(),
      type,
    };

    setErrors((prev) => [...prev, error]);

    // Log based on type
    if (type === 'error') {
      logger.error('Global Error', new Error(message), { details });
    } else if (type === 'warning') {
      logger.warn('Global Warning', message, { details });
    } else {
      logger.info('Global Info', message, { details });
    }

    // Auto-remove after 5 seconds for info/warning
    if (type === 'info' || type === 'warning') {
      setTimeout(() => {
        setErrors((prev) => prev.filter((e) => e.id !== error.id));
      }, 5000);
    }
  }, []);

  const removeError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <GlobalErrorContext.Provider
      value={{ errors, addError, removeError, clearErrors } satisfies GlobalErrorContextValue}
    >
      {children}
    </GlobalErrorContext.Provider>
  );
}
