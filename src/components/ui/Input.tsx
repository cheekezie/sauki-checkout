import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { InputProps } from "../../interface";

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  icon: Icon,
  maxLength,
  required = false,
  disabled = false,
  error,
  helperText,
  className = "",
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (type === "tel") {
      newValue = formatPhoneInput(newValue);
    }

    if (
      type === "password" &&
      (name === "password" || name === "pin" || name === "confirmPin")
    ) {
      newValue = formatNumericInput(newValue);
    }

    onChange(newValue);
  };

  const formatPhoneInput = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    return digits.substring(0, 11);
  };

  const formatNumericInput = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    return digits.substring(0, 6);
  };

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
        <input
          id={name}
          name={name}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          onChange={handleChange}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          inputMode={
            type === "tel" ||
            (type === "password" &&
              (name === "password" || name === "pin" || name === "confirmPin"))
              ? "numeric"
              : undefined
          }
          className={`
            w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary
            ${Icon ? "pl-12" : "pl-4"}
            ${type === "password" ? "pr-12" : ""}
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : isFocused
                ? "border-primary"
                : "border-gray-300"
            }
            ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
          `}
        />

        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        )}

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
