import { AlertTriangle, ChevronLeft, RefreshCw } from 'lucide-react';

interface prop {
  message?: string;
  backBtnLabel?: string;
  onRetry?: () => void;
  onBack?: () => void;
}
const ErrorBanner = ({ message, onRetry, onBack, backBtnLabel }: prop) => {
  return (
    <div className='flex flex-col items-center gap-3 py-8 text-center'>
      <AlertTriangle className='w-8 h-8 text-red-400' />
      <p className='text-dark text-sm font-medium'>{message ?? 'Could not load payment details'}</p>
      <div className='flex items-center gap-4 mt-1'>
        {onRetry && (
          <button
            onClick={onRetry}
            className='flex items-center gap-1.5 text-sm text-primary font-medium hover:underline'
          >
            <RefreshCw className='w-3.5 h-3.5' />
            Try again
          </button>
        )}
        {onRetry && onBack && <span className='text-gray-300 text-sm'>|</span>}
        {onBack && (
          <button onClick={onBack} className='flex items-center gap-1 text-sm text-gray font-medium hover:underline'>
            {backBtnLabel ?? 'Change payment method'}
          </button>
        )}
      </div>
      {!onRetry && !onBack && <p className='text-gray text-xsm'>Please go back and try again.</p>}
    </div>
  );
};

export default ErrorBanner;
