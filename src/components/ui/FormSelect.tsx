import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import type { SelectProps } from '@/interface';

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder = '-- Please select --',
  icon: Icon,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calculate dropdown position when opened
  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    } else {
      setDropdownPosition(null);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : '';

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <div className={`space-y-2 relative ${className}`}>
      <label htmlFor={name} className='block text-sm font-medium text-foreground'>
        {label}
        {required && <span className='text-red-500 ml-1 text-base font-semibold'>*</span>}
      </label>

      <div className='relative' ref={selectRef}>
        {Icon && (
          <Icon className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10' />
        )}
        <button
          ref={buttonRef}
          type='button'
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onFocus={() => !disabled && setIsFocused(true)}
          onBlur={() => {
            if (!isOpen) {
              setIsFocused(false);
              onBlur?.();
            }
          }}
          disabled={disabled}
          className={`
            w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary
            ${Icon ? 'pl-12' : 'pl-4'}
            ${error ? 'border-red-500 focus:ring-red-500' : isFocused || isOpen ? 'border-primary' : 'border-slate-200'}
            ${
              disabled
                ? 'bg-gray-50 cursor-not-allowed text-muted-foreground'
                : 'bg-white text-foreground cursor-pointer hover:border-primary/50'
            }
            flex items-center justify-between
          `}
        >
          <span className={`flex-1 min-w-0 text-left ${displayValue ? 'text-foreground' : 'text-muted-foreground'}`}>
            {displayValue || placeholder}
          </span>
          <ChevronDown
            className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            } ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}
          />
        </button>

        {/* Dropdown - Rendered via Portal to appear above modal */}
        {isOpen &&
          !disabled &&
          dropdownPosition &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              ref={dropdownRef}
              className='fixed z-10001 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto'
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
              }}
            >
              {options.length === 0 ? (
                <div className='px-4 py-3 text-sm text-muted-foreground text-center'>No options available</div>
              ) : (
                options.map((option, index) => {
                  const isSelected = value === option.value;
                  return (
                    <button
                      key={option.value || `option-${index}`}
                      type='button'
                      onClick={() => handleSelect(option.value)}
                      className={`
                      w-full px-4 py-3 text-left text-sm transition-colors duration-150
                      flex items-center justify-between
                      ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-gray-50'}
                      ${index === 0 ? 'rounded-t-lg' : ''}
                      ${index === options.length - 1 ? 'rounded-b-lg' : ''}
                    `}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check className='w-4 h-4 text-primary shrink-0' />}
                    </button>
                  );
                })
              )}
            </div>,
            document.body,
          )}
      </div>

      {error && <p className='text-red-500 text-sm flex items-center gap-1'>{error}</p>}

      {helperText && !error && <p className='text-xs text-muted-foreground'>{helperText}</p>}
    </div>
  );
};

export default FormSelect;
