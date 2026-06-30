import Card, { CardHeader } from "./Card";
import { cn } from "../../utils/cn";

export default function ChartCard({ title, subtitle, action, children, className, delay = 0 }) {
  return (
    <Card
      className={cn("chart-card animate-fade-in-up overflow-hidden", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader title={title} subtitle={subtitle} action={action} />
      <div className="chart-container">{children}</div>
    </Card>
  );
}

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="font-semibold text-slate-900 mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-medium text-slate-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
