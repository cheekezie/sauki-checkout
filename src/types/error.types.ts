/**
 * Error type definitions
 * Centralized error types for better type safety
 */

/**
 * API Error interface
 */
export interface ApiError {
  message: string;
  status?: number;
  statusCode?: number;
  code?: number;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
}

/**
 * Type guard to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  if (!error || typeof error !== "object") return false;
  const err = error as Record<string, unknown>;
  const hasResponse =
    typeof err.response === "object" && err.response !== null;

  return (
    typeof err.message === "string" ||
    typeof err.status === "number" ||
    typeof err.statusCode === "number" ||
    typeof err.code === "number" ||
    hasResponse
  );
}

/**
 * Extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An error occurred'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

