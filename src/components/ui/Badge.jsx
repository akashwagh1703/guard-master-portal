import { cn } from "../../utils/cn";

const statusStyles = {
  active: "bg-green-50 text-green-700 ring-green-600/20",
  inactive: "bg-slate-100 text-slate-600 ring-slate-500/20",
  present: "bg-green-50 text-green-700 ring-green-600/20",
  absent: "bg-red-50 text-red-700 ring-red-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  approved: "bg-green-50 text-green-700 ring-green-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
  open: "bg-red-50 text-red-700 ring-red-600/20",
  resolved: "bg-green-50 text-green-700 ring-green-600/20",
  inside: "bg-blue-50 text-blue-700 ring-blue-600/20",
  exited: "bg-slate-100 text-slate-600 ring-slate-500/20",
  processed: "bg-green-50 text-green-700 ring-green-600/20",
  high: "bg-red-50 text-red-700 ring-red-600/20",
  medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
  low: "bg-blue-50 text-blue-700 ring-blue-600/20",
};

export default function Badge({ status, children, className }) {
  const label = children || status;
  const style = statusStyles[status?.toLowerCase()] || statusStyles.inactive;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
