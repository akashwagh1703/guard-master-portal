import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Menu, LogOut, User, Settings } from "lucide-react";
import SearchBar from "../ui/SearchBar";
import Avatar from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onMenuToggle, sidebarCollapsed }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unread = 0;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2.5">
            <img src="/logo-shield.png" alt="" className="h-9 w-9 rounded-lg object-contain" />
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-slate-900 leading-tight">GuardMaster</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Admin Portal</p>
            </div>
          </div>
        </div>

        <div className="hidden md:block flex-1 max-w-md mx-8">
          <SearchBar placeholder="Search guards, sites, reports..." />
        </div>

        <div className="flex items-center gap-2">
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
            <Search className="h-5 w-5 text-slate-600" />
          </button>

          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative p-2 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <Bell className="h-5 w-5 text-slate-600" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-20">
                  <div className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-4 text-sm text-slate-500">
                    No new notifications
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <Avatar name={user?.name || "Admin"} size="sm" />
              <span className="hidden sm:block text-sm font-medium text-slate-700">{user?.name?.split(" ")[0] || "Admin"}</span>
            </button>
            {showProfile && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-20 py-1">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{user?.name || "Admin"}</p>
                    <p className="text-xs text-slate-500">{user?.email || ""}</p>
                  </div>
                  <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
                    <User className="h-4 w-4" /> Profile
                  </button>
                  <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
                    <Settings className="h-4 w-4" /> Settings
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
