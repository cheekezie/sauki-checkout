import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { Portal } from "../layout/Portal";
import Button from "../ui/Button";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  saveText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
  maxWidth?: string;
  className?: string;
  icon?: ReactNode;
  subtitle?: string;
  saveDisabled?: boolean;
}

const FormModal = ({
  isOpen,
  onClose,
  title,
  children,
  onSave,
  onCancel,
  saveText = "Save",
  cancelText = "Cancel",
  showCloseButton = true,
  maxWidth = "max-w-md",
  className = "",
  icon,
  subtitle,
  saveDisabled = false,
}: FormModalProps) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={handleBackdropClick}
      >
        <div
          className={`
            relative w-full ${maxWidth} bg-white rounded-xl shadow-lg max-h-[95vh] flex flex-col
            animate-in fade-in-0 zoom-in-95 duration-200
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-offwhite flex-shrink-0">
            <div className="flex items-center space-x-3">
              {icon && (
                <div className="p-2 bg-primary/10 rounded-lg">
                  {icon}
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-dark">{title}</h2>
                {subtitle && (
                  <p className="text-sm text-dark/70">{subtitle}</p>
                )}
              </div>
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-dark" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto flex-1">{children}</div>

          {/* Footer */}
          {(onSave || onCancel) && (
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-offwhite flex-shrink-0">
              <Button
                type="button"
                onClick={handleCancel}
                variant="secondary"
                size="sm"
                fullWidth={false}
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={saveDisabled}
                variant="secondary"
                size="sm"
                fullWidth={false}
              >
                {saveDisabled ? "Save" : saveText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};

export default FormModal;
