// useAlert.ts

import { useAlertContext } from '@/contexts/AlertProvider';
import type { AlertConfigI } from '@/types/ui.interface';


export function useAlert() {
  const { show, close } = useAlertContext();

  return {
    snackbar: (config: Omit<AlertConfigI, 'view'>) =>
      show({
        view: 'snackbar',
        autoDismiss: true,
        position: 'top-center',
        duration: 4000,
        ...config,
      }),

    modalAlert: (config: Omit<AlertConfigI, 'view'>) =>
      show({
        view: 'modal',
        autoDismiss: true,
        duration: 4000,
        ...config,
      }),

    modal: (config: Omit<AlertConfigI, 'view'>) =>
      show({
        view: 'modal',
        autoDismiss: true,
        duration: 4000,
        ...config,
      }),

    close,
  };
}
