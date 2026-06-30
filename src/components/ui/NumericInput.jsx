import { cn } from "../../utils/cn";
import { sanitizeNumericInput, sanitizeSignedDecimal } from "../../utils/validation";

export default function NumericInput({
  label,
  error,
  helper,
  required,
  className,
  id,
  value,
  onChange,
  onBlur,
  allowDecimal = false,
  allowNegative = false,
  inputMode,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const handleChange = (e) => {
    let val = e.target.value;
    if (allowNegative) val = sanitizeSignedDecimal(val);
    else if (allowDecimal) val = sanitizeNumericInput(val, true);
    else val = sanitizeNumericInput(val, false);
    onChange?.({ ...e, target: { ...e.target, value: val } });
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type="text"
        inputMode={inputMode || (allowDecimal ? "decimal" : "numeric")}
        autoComplete="off"
        value={value ?? ""}
        onChange={handleChange}
        onBlur={onBlur}
        className={cn(
          "w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white transition-all duration-200",
          "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          error ? "border-red-300 focus:ring-red-200 focus:border-red-400 shake" : "border-slate-200 hover:border-slate-300"
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600 flex items-center gap-1">{error}</p>}
      {helper && !error && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}
