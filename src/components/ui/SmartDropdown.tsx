import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DropdownOption {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  className?: string;
}

interface SmartDropdownProps {
  options: DropdownOption[];
  trigger: React.ReactNode;
  className?: string;
}

const SmartDropdown = ({
  options,
  trigger,
  className = "",
}: SmartDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    direction: "up" | "down";
  }>({
    top: 0,
    left: 0,
    direction: "down",
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e?: React.MouseEvent) => {
    // Prevent triggering parent row click handlers
    e?.stopPropagation();
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 300; // Increased dropdown height to accommodate more items
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Calculate position
    const left = rect.right - 192; // 192px = w-48 (dropdown width)
    const direction =
      spaceBelow < dropdownHeight && spaceAbove >= dropdownHeight
        ? "up"
        : "down";
    const top = direction === "up" ? rect.top - 200 : rect.bottom;

    setPosition({ top, left, direction });
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent body scroll
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className={`cursor-pointer ${className}`}
      >
        {trigger}
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              maxHeight: "240px",
              overflowY: "visible",
            }}
          >
            {options.map((option, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  option.onClick();
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 hover:bg-gray-50 ${
                  option.className || "text-gray-700"
                }`}
              >
                <option.icon className="w-4 h-4" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default SmartDropdown;
