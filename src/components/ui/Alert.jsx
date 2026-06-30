import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "../../utils/cn";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

export default function Alert({ type = "info", title, message, onClose, className }) {
  const Icon = icons[type];

  return (
    <div className={cn("flex gap-3 p-4 rounded-xl border", styles[type], className)}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium text-sm">{title}</p>}
        {message && <p className="text-sm mt-0.5 opacity-90">{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 cursor-pointer">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
