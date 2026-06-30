import { cn } from "../../utils/cn";

const colors = {
  primary: { bg: "bg-blue-50", text: "text-primary", accent: "#2563eb" },
  green: { bg: "bg-green-50", text: "text-green-600", accent: "#16a34a" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", accent: "#d97706" },
  red: { bg: "bg-red-50", text: "text-red-600", accent: "#dc2626" },
  slate: { bg: "bg-slate-100", text: "text-slate-600", accent: "#64748b" },
};

export default function StatCard({ title, value, icon: Icon, trend, trendUp, color = "primary", delay = 0 }) {
  const c = colors[color] || colors.primary;

  return (
    <div
      className="stat-card bg-white rounded-xl border border-slate-100/80 shadow-sm p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, "--accent": c.accent }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{value}</p>
          {trend && (
            <p className={cn("text-xs mt-1.5 font-medium flex items-center gap-0.5", trendUp ? "text-green-600" : "text-red-600")}>
              <span>{trendUp ? "↑" : "↓"}</span> {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 stat-card:hover:scale-105", c.bg, c.text)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
