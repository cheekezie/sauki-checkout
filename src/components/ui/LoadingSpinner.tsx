interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
}

export function ComponentLoading({ size = 'md', className = '', fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center w-full h-full bg-gray-50/50 backdrop-blur-sm z-50'
    : 'absolute inset-0 flex items-center justify-center w-full h-full min-h-screen';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-secondary/20 border-t-secondary rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-gray-50">
      <div
        className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

