/**
 * Utility functions for handling errors in React Query
 */
import { isApiError } from '../types/error.types';

/**
 * Check if an error is a 401 Unauthorized error
 */
export function isUnauthorizedError(error: unknown): boolean {
  if (!error) return false;
  
  if (isApiError(error)) {
    return (
      error.statusCode === 401 ||
      error.status === 401 ||
      error.response?.status === 401 ||
      error.code === 401
    );
  }
  
  if (typeof error === 'object') {
    const err = error as Record<string, unknown>;
    return (
      err.statusCode === 401 ||
      err.status === 401 ||
      (typeof err.response === 'object' && 
       err.response !== null && 
       (err.response as Record<string, unknown>).status === 401) ||
      err.code === 401
    );
  }
  
  return false;
}

/**
 * Filter out 401 errors from React Query error state
 * Returns null if error is 401, otherwise returns the error
 */
export function filterUnauthorizedError(error: unknown): unknown {
  if (isUnauthorizedError(error)) {
    return null;
  }
  return error;
}

