import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger } from '../../services/logger.service';
import type { ApiError } from '../../types/error.types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Determines if an error is API-related for specialized logging
 */
const isApiError = (error: Error | null): boolean => {
  if (!error) return false;
  
  const message = error.message || '';
  const name = error.name || '';
  
  return (
    message.includes('API') ||
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('axios') ||
    message.includes('useAuth') ||
    name === 'ApiError' ||
    name === 'NetworkError'
  );
};

/**
 * React Error Boundary Component
 * Catches JavaScript errors during rendering, lifecycle methods, and constructors
 * 
 * Note: This only catches React rendering errors, not async errors from API calls.
 * API errors are handled by global handlers in AuthContext and axios interceptors.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Use specialized logging for API-related errors
    if (isApiError(error)) {
      const apiError = error as unknown as ApiError;
      logger.apiError('ErrorBoundary', 'RENDER', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        status: apiError.status,
        statusCode: apiError.statusCode,
      });
    } else {
      // Use general error logging for other errors
      logger.error('ErrorBoundary caught an error', error, {
        componentStack: errorInfo.componentStack,
      });
    }

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Allow custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Log error for debugging (only in development)
      if (import.meta.env.DEV && this.state.error) {
        logger.error('ErrorBoundary caught error', this.state.error);
      }

      // Render error UI
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-600 mb-6">
              Don't worry, it's definitely not your fault! Our team has been notified
              and we're working on fixing this issue right now.
            </p>

            <div className="flex flex-col lg:flex-row gap-5 justify-center">
              <button
                onClick={this.handleReset}
                className="w-full lg:w-auto bg-primary text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out hover:bg-primary/90 cursor-pointer"
                type="button"
              >
                Try Again
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500">
              <p>
                If this problem persists, please contact our support team at{' '}
                <a
                  href="mailto:support@saukipay.net"
                  className="text-primary hover:underline cursor-pointer"
                >
                  support@saukipay.net
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

