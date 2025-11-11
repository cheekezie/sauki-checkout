import type { CheckboxProps } from "../../interface";

const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
  children,
}: CheckboxProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start gap-3">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          disabled={disabled}
          className={`
            mt-1 w-4 h-4 rounded border-2 
            focus:ring-2 focus:ring-primary/20 focus:outline-none
            ${error ? "border-red-500" : "border-gray-7s00"}
            ${checked ? "bg-primary border-primary" : "bg-white"}
            ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            transition-colors duration-200
            appearance-none
            checked:bg-primary checked:border-primary
          `}
          style={{
            backgroundImage: checked ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-8.5 8.5a.5.5 0 0 1-.708 0l-4-4a.5.5 0 1 1 .708-.708L5 10.293l8.146-8.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e")` : 'none',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />
        <div className="flex-1">
          <div className={`
              text-sm text-foreground
              ${disabled ? "cursor-not-allowed opacity-50" : ""}
            `}>
            <span className="select-none">
              {label}
            </span>{" "}
            {children}
          </div>
        </div>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Checkbox;
