import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumb from "../ui/Breadcrumb";
import Button from "../ui/Button";
import Card from "../ui/Card";

export function FormLayout({ title, subtitle, backTo, backLabel = "Back", breadcrumbs, children, actions }) {
  return (
    <div className="animate-page-enter max-w-4xl mx-auto">
      {breadcrumbs}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          {backTo && (
            <Link
              to={backTo}
              className="mt-1 p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary via-blue-400 to-indigo-500" />
        <div className="p-6 lg:p-8">{children}</div>
        {actions && (
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 px-6 lg:px-8 py-5 bg-slate-50/80 border-t border-slate-100">
            {actions}
          </div>
        )}
      </Card>
    </div>
  );
}

export function FormSection({ title, description, children }) {
  return (
    <div className="mb-8 last:mb-0">
      {(title || description) && (
        <div className="mb-5 pb-4 border-b border-slate-100">
          {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
          {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

export function FormActions({ formId, onCancel, onReset, saveLabel = "Save", loading }) {
  return (
    <>
      <Button variant="secondary" type="button" onClick={onCancel} className="sm:min-w-[100px]">
        Cancel
      </Button>
      {onReset && (
        <Button variant="ghost" type="button" onClick={onReset}>
          Reset
        </Button>
      )}
      <Button type="submit" form={formId} loading={loading} className="sm:min-w-[120px]">
        {saveLabel}
      </Button>
    </>
  );
}
