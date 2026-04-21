import { useAlert } from '@/hooks/alert.hook';
import { useEffect } from 'react';

type AlertPayload = {
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
};

type ToastFn = (payload: AlertPayload) => void;
type ModalFn = (payload: AlertPayload) => void;
type closeFn = () => void;

let toastFn: ToastFn | null = null;
let modalFn: ModalFn | null = null;
let closeFn: closeFn | null = null;

const registerAlertHandlers = (handlers: { snackbar: ToastFn; modal: ModalFn; close: closeFn }) => {
  toastFn = handlers.snackbar;
  modalFn = handlers.modal;
  closeFn = handlers.close;
};

export const notify = {
  snackbar: (payload: AlertPayload) => {
    toastFn?.(payload);
  },
  modal: (payload: AlertPayload) => {
    modalFn?.(payload);
  },
  close: () => {
    closeFn?.();
  },
} as const;

export const AlertBridge = () => {
  const { snackbar, modal, close } = useAlert();

  useEffect(() => {
    registerAlertHandlers({
      snackbar,
      modal,
      close,
    });
  }, [snackbar, modal]);

  return null;
};
