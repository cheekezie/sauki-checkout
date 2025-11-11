import type { TextareaProps } from "../../interface";

const Textarea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  maxLength,
  required = false,
  disabled = false,
  error,
  helperText,
  className = "",
  rows = 4,
}: TextareaProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`
          w-full rounded-lg border px-4 py-4 transition-all duration-200 border-gray-700
          focus:outline-none focus:ring-1 focus:ring-primary
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
          ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
          resize-none
        `}
      />

      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export default Textarea;
