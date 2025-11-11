import { useModal } from "../../hooks/useModal";
import Modal from "./Modal";

const ModalContainer = () => {
  const { isModalOpen, currentModal, hideModal } = useModal();

  if (!currentModal || !isModalOpen) return null;

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={hideModal}
      type={currentModal.type}
      title={currentModal.title}
      message={currentModal.message}
      onConfirm={currentModal.onConfirm}
      onCancel={currentModal.onCancel}
      confirmText={currentModal.confirmText}
      cancelText={currentModal.cancelText}
      showCloseButton={currentModal.showCloseButton}
    />
  );
};

export default ModalContainer;
