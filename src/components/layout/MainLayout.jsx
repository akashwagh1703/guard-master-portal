import { useState } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "../../utils/cn";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        onMenuToggle={() => setMobileOpen(!mobileOpen)}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <main
        className={cn(
          "pt-16 min-h-screen flex flex-col transition-all duration-300",
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
        )}
      >
        <div className="flex-1 p-4 lg:p-6">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}
