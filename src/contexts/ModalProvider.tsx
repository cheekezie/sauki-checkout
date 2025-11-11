import { useState, useCallback, type ReactNode } from "react";
import type { ModalData, ModalContextType } from "../interface/ui.interface";
import { ModalContext } from "./modalContext";

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState<ModalData | null>(null);

  const showModal = useCallback((modal: ModalData) => {
    setCurrentModal(modal);
    setIsModalOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentModal(null);
  }, []);

  const value: ModalContextType = {
    showModal,
    hideModal,
    isModalOpen,
    currentModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}
