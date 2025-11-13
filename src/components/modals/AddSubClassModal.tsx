import { useState } from "react";
import { X } from "lucide-react";
import { Portal } from "../layout/Portal";
import Button from "../ui/Button";

interface AddSubClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subclassName: string, capacity: number) => void | Promise<void>;
  isSubmitting?: boolean;
}

const AddSubClassModal = ({
  isOpen,
  onClose,
  onSave,
  isSubmitting = false,
}: AddSubClassModalProps) => {
  const [subclassName, setSubclassName] = useState("");
  const [capacity, setCapacity] = useState<number>(10);

  const handleSave = async () => {
    if (subclassName.trim() && capacity > 0 && !isSubmitting) {
      await onSave(subclassName.trim(), capacity);
      setSubclassName("");
      setCapacity(10);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 relative shadow-xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-dark" />
          </button>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            Add New Subclass
          </h2>

          {/* Input Fields */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subclass Name *
              </label>
              <input
                type="text"
                value={subclassName}
                onChange={(e) => setSubclassName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g Gold, Silver"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                autoFocus
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity *
              </label>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                onKeyPress={handleKeyPress}
                placeholder="e.g 20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isSubmitting || !subclassName.trim() || capacity <= 0}
            variant="secondary"
            size="sm"
            fullWidth={false}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Portal>
  );
};

export default AddSubClassModal;
