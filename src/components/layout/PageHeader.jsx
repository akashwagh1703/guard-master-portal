import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function PageHeader({ title, subtitle, action, actionLabel, actionTo, breadcrumbs }) {
  return (
    <div className="mb-6">
      {breadcrumbs}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {(action || actionTo) && (
          actionTo ? (
            <Link to={actionTo}>
              <Button className="shadow-sm hover:shadow-md transition-shadow">{actionLabel}</Button>
            </Link>
          ) : (
            <Button onClick={action} className="shadow-sm hover:shadow-md transition-shadow">{actionLabel}</Button>
          )
        )}
      </div>
    </div>
  );
}
