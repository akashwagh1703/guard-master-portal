import { cn } from "../../utils/cn";

export default function Card({ children, className, padding = true, hover = false }) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-100/80 shadow-sm backdrop-blur-sm",
        padding && "p-6",
        hover && "hover:shadow-md hover:border-slate-200/80 transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn("flex items-start justify-between mb-4 gap-4", className)}>
      <div>
        {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
