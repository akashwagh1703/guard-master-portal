import { cn } from "../../utils/cn";

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="border-b border-slate-200">
      <nav className="flex gap-1 -mb-px overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "ml-2 px-2 py-0.5 text-xs rounded-full",
                activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
