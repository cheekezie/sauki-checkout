import { X } from "lucide-react";
import { Portal } from "../layout/Portal";
import Button from "@/components/ui/Button";

interface DetailsModalProps<
  T extends Record<string, any> = Record<string, any>
> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: T;
  fields: {
    key: string;
    label: string;
    render?: (value: any, data: T) => React.ReactNode;
    fullWidth?: boolean;
  }[];
  icon?: React.ReactNode;
  subtitle?: string;
  maxWidth?: string;
}

const DetailsModal = <T extends Record<string, any>>({
  isOpen,
  onClose,
  title,
  data,
  fields,
  icon,
  subtitle,
  maxWidth = "max-w-3xl",
}: DetailsModalProps<T>) => {
  if (!isOpen) return null;

  const getValue = (key: string) => {
    const keys = key.split(".");
    let value = data;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined || value === null) break;
    }
    return value;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Portal>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={handleBackdropClick}
      >
        <div
          className={`bg-white rounded-xl shadow-lg w-full ${maxWidth} max-h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200`}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-offwhite flex-shrink-0">
            <div className="flex items-center space-x-3">
              {icon && (
                <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-dark">{title}</h2>
                {subtitle && (
                  <p className="text-sm text-dark/70">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-dark" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => {
                const value = getValue(field.key);
                const renderedContent = field.render
                  ? field.render(value, data)
                  : String(value ?? "—");
                return (
                  <div
                    key={field.key}
                    className={`space-y-1 ${field.fullWidth ? "md:col-span-2" : ""}`}
                  >
                    <p className="text-sm font-medium text-gray-700">
                      {field.label}
                    </p>
                    {field.render ? (
                      <div className="text-sm text-gray-900">{renderedContent}</div>
                    ) : (
                      <p className="text-sm text-gray-900">{renderedContent}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-offwhite flex-shrink-0">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="sm"
              fullWidth={false}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default DetailsModal;
