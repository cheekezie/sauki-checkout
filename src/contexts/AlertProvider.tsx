import { AlertRenderer } from '@/components/ui/AlertRenderer';
import type { AlertConfigI } from '@/types/ui.interface';
import { createContext, useContext, useEffect, useState } from 'react';

interface AlertContextValue {
  alert: AlertConfigI | null;
  show: (config: AlertConfigI) => void;
  close: () => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertConfigI | null>(null);

  const show = (config: AlertConfigI) => {
    setAlert(config);
  };

  const close = () => setAlert(null);

  // Auto dismiss
  useEffect(() => {
    if (!alert?.autoDismiss) return;

    const timer = setTimeout(close, alert.duration ?? 4000);

    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <AlertContext.Provider value={{ alert, show, close }}>
      {children}
      <AlertRenderer alert={alert} onClose={close} />
    </AlertContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAlertContext() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used inside AlertProvider');
  return ctx;
}
