import type { AlertConfigI } from '@/types/ui.interface';
import { notify } from '@/utils/alert-bridge';

const icon = (type: string) => (type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ');

const iconBg = (type: string) =>
  ({
    success: 'bg-green-100',
    error: 'bg-red-100',
    warning: 'bg-orange-100',
    info: 'bg-blue-100',
  })[type];

const iconColor = (type: string) =>
  ({
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-orange-500',
    info: 'text-blue-500',
  })[type];

const snackbarBg = (type: string) =>
  ({
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-orange-500 text-white',
    info: 'bg-blue-500 text-white',
  })[type];

const positionClass = (pos = 'top-right') =>
  ({
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-center': 'top-6 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  })[pos];

export function AlertRenderer({ alert, onClose }: { alert: AlertConfigI | null; onClose: () => void }) {
  const close = () => {
    notify.close();
  };

  if (!alert) return null;

  if (alert.view === 'modal') {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'>
        <div
          className='max-w-[542px] w-full bg-white rounded-2xl shadow-md px-8 py-6 text-center border cursor-pointer'
          onClick={close}
        >
          <div
            className={`h-20 w-20 rounded-full mx-auto mb-3 flex items-center justify-center
              ${iconBg(alert.type)}`}
          >
            <span className={`text-3xl ${iconColor(alert.type)}`}>{icon(alert.type)}</span>
          </div>

          {alert.title && <h2 className='text-xl font-semibold mb-2'>{alert.title}</h2>}

          <p className='text-gray-500'>{alert.message}</p>

          {!alert.autoDismiss && (
            <button className='mt-4 text-sm font-medium text-primary' onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  // Snackbar
  return (
    <div
      className={`fixed z-50 px-4 py-3 rounded-lg shadow-md w-[90%] md:w-[400px] cursor-pointer
        ${positionClass(alert.position)}
        ${snackbarBg(alert.type)}`}
      onClick={close}
    >
      {alert.title && <strong className='text-md'>{alert.title}</strong>}
      <p className='text-sm'>{alert.message}</p>
    </div>
  );
}
