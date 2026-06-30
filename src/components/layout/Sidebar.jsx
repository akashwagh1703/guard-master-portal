import {
  LayoutDashboard, Building2, Shield, Clock, UserCheck, CalendarCheck,
  Users, AlertTriangle, CalendarOff, Wallet, BarChart3, Settings, LogOut, ChevronLeft,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

const menuItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/sites", label: "Site Management", icon: Building2 },
  { path: "/guards", label: "Security Guards", icon: Shield },
  { path: "/shifts", label: "Shift Management", icon: Clock },
  { path: "/assignments", label: "Guard Assignment", icon: UserCheck },
  { path: "/attendance", label: "Attendance", icon: CalendarCheck },
  { path: "/visitors", label: "Visitors", icon: Users },
  { path: "/incidents", label: "Incidents", icon: AlertTriangle },
  { path: "/leave", label: "Leave Requests", icon: CalendarOff },
  { path: "/payroll", label: "Payroll", icon: Wallet },
  { path: "/reports", label: "Reports", icon: BarChart3 },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-30 bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <button
          onClick={onToggle}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-slate-50 cursor-pointer"
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </button>
        <NavLink
          to="/login"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-1"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </NavLink>
      </div>
    </aside>
  );
}
