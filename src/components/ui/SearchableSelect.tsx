import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, X } from "lucide-react";
import type { SelectProps } from "../../interface";

interface SearchableSelectProps extends Omit<SelectProps, 'onChange'> {
  onChange: (value: string) => void;
  searchable?: boolean;
  maxHeight?: string;
}

const SearchableSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "-- Please select --",
  icon: Icon,
  required = false,
  disabled = false,
  error,
  helperText,
  className = "",
  searchable = true,
  maxHeight = "400px",
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });

  // Get selected option label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : "";

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4, // 4px gap
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
    onBlur?.();
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
    inputRef.current?.focus();
  };

  return (
    <div className={`space-y-2 ${className}`} ref={containerRef}>
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {/* Input field that looks like a select */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            id={name}
            name={name}
            value={isOpen ? searchTerm : displayValue}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              if (!disabled) {
                setIsOpen(true);
                if (!isOpen) {
                  setSearchTerm("");
                }
              }
            }}
            onBlur={() => {
              // Delay to allow option click to register
              setTimeout(() => {
                setIsFocused(false);
                onBlur?.();
              }, 200);
            }}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={!searchable || !isOpen}
            required={required}
            className={`
              w-full rounded-lg border px-4 py-3 text-sm pr-10 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary
              ${Icon ? 'pl-12' : 'pl-4'}
              ${error 
                ? 'border-red-500 focus:ring-red-500' 
                : isFocused 
                  ? 'border-primary' 
                  : 'border-gray-300'
              }
              ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white cursor-pointer'}
              ${!isOpen && !searchable ? 'cursor-pointer' : ''}
            `}
            onClick={handleInputClick}
          />
          
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          )}
          
          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {/* Dropdown - Rendered via Portal to appear above modal */}
        {isOpen && !disabled && typeof document !== 'undefined' && document.body && createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[10001] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              maxHeight,
            }}
          >
            {/* Search input when dropdown is open */}
            {searchable && (
              <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Search banks..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Options list */}
            <div className="overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 60px)` }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.value || `option-${index}`}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors
                      ${value === option.value ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700'}
                    `}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No banks found
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default SearchableSelect;

