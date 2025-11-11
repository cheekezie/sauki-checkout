import { useState, useCallback, type ReactElement } from "react";
import Modal from "../components/modals/Modal";
import { logger } from "../services/logger.service";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  type?: "confirmation" | "warning" | "error";
}

interface ConfirmModalState {
  isOpen: boolean;
  options: ConfirmOptions | null;
}

interface UseConfirmModalReturn {
  confirm: (options: ConfirmOptions) => void;
  ConfirmModal: () => ReactElement | null;
}

export const useConfirmModal = (): UseConfirmModalReturn => {
  const [state, setState] = useState<ConfirmModalState>({
    isOpen: false,
    options: null,
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    setState({
      isOpen: true,
      options,
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    if (state.options) {
      try {
        await state.options.onConfirm();
      } catch (error) {
        // Error handling is done by the caller
        logger.error("Error in confirm action", error);
      }
    }
    setState({ isOpen: false, options: null });
  }, [state.options]);

  const handleCancel = useCallback(() => {
    if (state.options?.onCancel) {
      state.options.onCancel();
    }
    setState({ isOpen: false, options: null });
  }, [state.options]);

  const ConfirmModal = () => {
    if (!state.options) return null;

    return (
      <Modal
        isOpen={state.isOpen}
        onClose={handleCancel}
        type={state.options.type || "confirmation"}
        title={state.options.title}
        message={state.options.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText={state.options.confirmText}
        cancelText={state.options.cancelText}
        showCloseButton={false}
      />
    );
  };

  return {
    confirm,
    ConfirmModal,
  };
};
