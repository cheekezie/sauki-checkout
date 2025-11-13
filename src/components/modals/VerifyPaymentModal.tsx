import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface VerifyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerifyPaymentModal = ({ isOpen, onClose }: VerifyPaymentModalProps) => {
  const [regNumber, setRegNumber] = useState("");
  const [session, setSession] = useState("");
  const [institutionType, setInstitutionType] = useState<"primary" | "secondary" | "tertiary" | "">("");
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = async () => {
    if (!regNumber || !session || !institutionType) {
      return;
    }

    setIsChecking(true);
    // Pending API integration: invoke verification endpoint here.
    // Example: await checkPaymentStatus({ regNumber, session, institutionType });
    
    setTimeout(() => {
      setIsChecking(false);
    }, 1000);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[95vh] flex flex-col relative z-[10000]">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-offwhite flex-shrink-0">
          <h2 className="text-lg font-semibold text-dark">Check Payment Status</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-dark" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Reg Number or Payer ID Input */}
          <div>
            <Input
              label=""
              name="regNumber"
              value={regNumber}
              onChange={(value) => setRegNumber(value)}
              placeholder="Reg Number or Payer ID"
              required={false}
            />
          </div>

          {/* Session Input */}
          <div>
            <Input
              label=""
              name="session"
              value={session}
              onChange={(value) => setSession(value)}
              placeholder="Session"
              required={false}
            />
          </div>

          {/* Institution Type Radio Buttons */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">
              What is your institution type ?
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="institutionType"
                  value="primary"
                  checked={institutionType === "primary"}
                  onChange={(e) => setInstitutionType(e.target.value as "primary")}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Primary</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="institutionType"
                  value="secondary"
                  checked={institutionType === "secondary"}
                  onChange={(e) => setInstitutionType(e.target.value as "secondary")}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Secondary</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="institutionType"
                  value="tertiary"
                  checked={institutionType === "tertiary"}
                  onChange={(e) => setInstitutionType(e.target.value as "tertiary")}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Tertiary</span>
              </label>
            </div>
          </div>

          {/* Check Button */}
          <div className="pt-4">
            <Button
              onClick={handleCheck}
              disabled={!regNumber || !session || !institutionType || isChecking}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
              fullWidth={true}
            >
              {isChecking ? "Checking..." : "Check"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default VerifyPaymentModal;

