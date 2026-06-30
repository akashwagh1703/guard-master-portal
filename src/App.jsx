import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SiteManagement from "./pages/SiteManagement";
import SiteForm from "./pages/SiteForm";
import SiteDetail from "./pages/SiteDetail";
import SecurityGuards from "./pages/SecurityGuards";
import GuardForm from "./pages/GuardForm";
import GuardDetail from "./pages/GuardDetail";
import ShiftManagement from "./pages/ShiftManagement";
import ShiftForm from "./pages/ShiftForm";
import GuardAssignment from "./pages/GuardAssignment";
import AttendancePage from "./pages/Attendance";
import VisitorsPage from "./pages/Visitors";
import IncidentsPage from "./pages/Incidents";
import LeaveRequests from "./pages/LeaveRequests";
import PayrollPage from "./pages/Payroll";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="sites" element={<SiteManagement />} />
                  <Route path="sites/new" element={<SiteForm />} />
                  <Route path="sites/:id" element={<SiteDetail />} />
                  <Route path="sites/:id/edit" element={<SiteForm />} />
                  <Route path="guards" element={<SecurityGuards />} />
                  <Route path="guards/new" element={<GuardForm />} />
                  <Route path="guards/:id" element={<GuardDetail />} />
                  <Route path="guards/:id/edit" element={<GuardForm />} />
                  <Route path="shifts" element={<ShiftManagement />} />
                  <Route path="shifts/new" element={<ShiftForm />} />
                  <Route path="shifts/:id/edit" element={<ShiftForm />} />
                  <Route path="assignments" element={<GuardAssignment />} />
                  <Route path="attendance" element={<AttendancePage />} />
                  <Route path="visitors" element={<VisitorsPage />} />
                  <Route path="incidents" element={<IncidentsPage />} />
                  <Route path="leave" element={<LeaveRequests />} />
                  <Route path="payroll" element={<PayrollPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </DataProvider>
    </AuthProvider>
  );
}
