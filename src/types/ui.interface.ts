import type { ReactNode } from 'react';


// Toast Component
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

// Tooltip Component
export interface TooltipProps {
  label: string;
  children?: ReactNode;
  placement?: 'right' | 'left' | 'top' | 'bottom';
  delay?: number;
}

// Back Button Component
export interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

// Feature Card Component
export interface FeatureCardProps {
  heading: string;
  items: string[];
  className?: string;
  selectedType?: 'school' | 'other';
}

// Portal Component
export interface PortalProps {
  children: ReactNode;
}

// Modal Components
export type ModalType = 'email-sent' | 'pin-success' | 'verification-success' | 'confirmation' | 'info' | 'error';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
}

export interface ModalData {
  type: ModalType;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export interface ModalContextType {
  showModal: (modal: ModalData) => void;
  hideModal: () => void;
  isModalOpen: boolean;
  currentModal: ModalData | null;
}



export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type AlertView = 'modal' | 'snackbar';

export type AlertPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface AlertConfigI {
  id?: string;
  type: AlertType;
  title?: string;
  message: string;
  view?: AlertView;
  position?: AlertPosition;
  autoDismiss?: boolean;
  duration?: number; // ms
}

export interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
}
