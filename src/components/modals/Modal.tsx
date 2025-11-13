import { useEffect } from "react";
import { X } from "lucide-react";
import { Portal } from "../layout/Portal";
import Button from "../ui/Button";
import successIcon from "../../assets/success-icon.png";
import errorIcon from "../../assets/error-icon.png";
import warningIcon from "../../assets/warning-icon.png";

// ModalProps interface (enhanced with ConfirmationModal features)
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "email-sent" | "pin-success" | "verification-success" | "confirmation" | "info" | "error" | "success" | "warning";
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
  autoCloseDelay?: number; // Auto-close delay in milliseconds (merged from ConfirmationModal)
}

const Modal = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  showCloseButton = true,
  autoCloseDelay,
}: ModalProps) => {
  // Handle escape key and auto-close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      
      // Auto-close if delay is provided
      if (autoCloseDelay && autoCloseDelay > 0) {
        const timer = setTimeout(() => {
          onClose();
        }, autoCloseDelay);
        return () => {
          clearTimeout(timer);
          document.removeEventListener("keydown", handleEscape);
          document.body.style.overflow = "unset";
        };
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, autoCloseDelay]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get modal configuration based on type
  const getModalConfig = () => {
    switch (type) {
      case "email-sent":
        return {
          icon: successIcon,
          iconAlt: "Email Sent",
          defaultTitle: "Email Sent!",
          defaultMessage:
            "We've sent you a verification email. Please check your inbox and click the link to continue.",
          defaultConfirmText: "OK",
          styles: "border-blue-200 bg-blue-50",
          isConfirmation: false,
        };
      case "pin-success":
        return {
          icon: successIcon,
          iconAlt: "PIN Success",
          defaultTitle: "PIN Set Successfully!",
          defaultMessage:
            "Your PIN has been set successfully. You can now use it to access your account.",
          defaultConfirmText: "Continue",
          styles: "border-green-200 bg-green-50",
          isConfirmation: false,
        };
      case "verification-success":
        return {
          icon: successIcon,
          iconAlt: "Verification Success",
          defaultTitle: "Verification Successful!",
          defaultMessage:
            "Your account has been verified successfully. You can now access all features.",
          defaultConfirmText: "Continue",
          styles: "border-green-200 bg-green-50",
          isConfirmation: false,
        };
      case "confirmation":
        return {
          icon: warningIcon,
          iconAlt: "Confirmation",
          defaultTitle: "Confirm Action",
          defaultMessage: "Are you sure you want to proceed with this action?",
          defaultConfirmText: "Yes",
          defaultCancelText: "Cancel",
          styles: "border-0 bg-white",
          isConfirmation: true,
        };
      case "info":
        return {
          icon: warningIcon,
          iconAlt: "Information",
          defaultTitle: "Information",
          defaultMessage: "Here is some important information you should know.",
          defaultConfirmText: "OK",
          styles: "border-blue-200 bg-blue-50",
          isConfirmation: false,
        };
      case "error":
        return {
          icon: errorIcon,
          iconAlt: "Error",
          defaultTitle: "Error",
          defaultMessage: "Something went wrong. Please try again.",
          defaultConfirmText: "OK",
          styles: "border-red-200 bg-red-50",
          isConfirmation: false,
        };
      case "success":
        return {
          icon: successIcon,
          iconAlt: "Success",
          defaultTitle: "Success",
          defaultMessage: "Operation completed successfully.",
          defaultConfirmText: "OK",
          styles: "border-green-200 bg-green-50",
          isConfirmation: false,
        };
      case "warning":
        return {
          icon: warningIcon,
          iconAlt: "Warning",
          defaultTitle: "Warning",
          defaultMessage: "Please review the information carefully.",
          defaultConfirmText: "OK",
          defaultCancelText: "Cancel",
          styles: "border-0 bg-white",
          isConfirmation: true,
        };
      default:
        return {
          icon: warningIcon,
          iconAlt: "Info",
          defaultTitle: "Information",
          defaultMessage: "Here is some important information you should know.",
          defaultConfirmText: "OK",
          styles: "border-gray-200 bg-white",
          isConfirmation: false,
        };
    }
  };

  const config = getModalConfig();

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={handleBackdropClick}
      >
        <div
          className={`
            relative w-full max-w-md bg-white rounded-xl shadow-lg p-6
            ${config.styles}
            animate-in fade-in-0 zoom-in-95 duration-200
          `}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-primary" />
            </button>
          )}

          {/* Modal content */}
          <div className="text-center">
            {/* Icon */}
            <div className="mb-4">
              <img
                src={config.icon}
                alt={config.iconAlt}
                className="w-16 h-16 mx-auto"
              />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {title || config.defaultTitle}
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {message || config.defaultMessage}
            </p>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              {config.isConfirmation ? (
                <>
                  <Button
                    type="button"
                    onClick={handleConfirm}
                    variant="danger"
                    size="sm"
                    fullWidth={false}
                  >
                    {confirmText || config.defaultConfirmText}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    variant="secondary"
                    size="sm"
                    fullWidth={false}
                  >
                    {cancelText || config.defaultCancelText}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={handleConfirm}
                  variant="secondary"
                  size="sm"
                  fullWidth={false}
                >
                  {confirmText || config.defaultConfirmText}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
