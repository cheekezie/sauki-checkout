import { useState } from "react";
import type { SelectProps } from "../../interface";

const Select = ({
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
}: SelectProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onFocus={() => setIsFocused(true)}
          required={required}
          disabled={disabled}
          className={`
            w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary
            ${Icon ? 'pl-12' : 'pl-4'}
            ${error 
              ? 'border-red-500 focus:ring-red-500' 
              : isFocused 
                ? 'border-primary' 
                : 'border-gray-300'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
          `}
        >
          <option key="placeholder" value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={option.value || `option-${index}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
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

export default Select;
