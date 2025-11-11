import { Suspense, type ComponentType, type ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ComponentLoading } from '../ui/LoadingSpinner';

interface LazyWrapperProps {
  component: ComponentType<any>;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

/**
 * Wrapper component for lazy-loaded components
 * Provides Suspense fallback and Error Boundary
 */
export function LazyWrapper({ 
  component: Component, 
  fallback = <ComponentLoading size="lg" fullScreen={true} />,
  errorFallback 
}: LazyWrapperProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
}

export { ComponentLoading };

