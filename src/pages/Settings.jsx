import { useState, useEffect } from "react";
import PageHeader from "../components/layout/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import Card, { CardHeader } from "../components/ui/Card";
import Input, { Select } from "../components/ui/Input";
import NumericInput from "../components/ui/NumericInput";
import Button from "../components/ui/Button";
import DataTable from "../components/ui/DataTable";
import { ProfileCard } from "../components/ui/Avatar";
import { ConfirmDialog } from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function SettingsPage() {
  const { holidays, settings, updateSettingsGroup, createHoliday, deleteHoliday } = useData();
  const { user, reloadProfile } = useAuth();
  const [tab, setTab] = useState("company");
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [holidayForm, setHolidayForm] = useState({ name: "", date: "" });
  const [deleteHolidayOpen, setDeleteHolidayOpen] = useState(false);
  const [deletingHoliday, setDeletingHoliday] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", password: "", confirm: "" });

  const company = settings.company || {};
  const attendance = settings.attendance || {};
  const payroll = settings.payroll || {};

  const [companyForm, setCompanyForm] = useState({
    company_name: company.company_name || "",
    company_email: company.company_email || "",
    company_phone: company.company_phone || "",
  });
  const [attendanceForm, setAttendanceForm] = useState({
    grace_minutes: attendance.grace_minutes || "10",
    half_day_hours: attendance.half_day_hours || "4",
  });
  const [payrollForm, setPayrollForm] = useState({
    working_days_per_month: payroll.working_days_per_month || "26",
    late_deduction: payroll.late_deduction || "100",
  });

  useEffect(() => {
    setCompanyForm({
      company_name: settings.company?.company_name || "",
      company_email: settings.company?.company_email || "",
      company_phone: settings.company?.company_phone || "",
    });
    setAttendanceForm({
      grace_minutes: settings.attendance?.grace_minutes || "10",
      half_day_hours: settings.attendance?.half_day_hours || "4",
    });
    setPayrollForm({
      working_days_per_month: settings.payroll?.working_days_per_month || "26",
      late_deduction: settings.payroll?.late_deduction || "100",
    });
  }, [settings]);

  useEffect(() => {
    setProfileForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  }, [user]);

  const tabs = [
    { id: "company", label: "Company Profile" },
    { id: "attendance", label: "Attendance Rules" },
    { id: "payroll", label: "Payroll Rules" },
    { id: "holidays", label: "Holiday List" },
    { id: "profile", label: "Profile" },
  ];

  const saveGroup = async (group, values, successTitle) => {
    setSaving(true);
    try {
      await updateSettingsGroup(group, values);
      addToast({ type: "success", title: successTitle });
    } catch (err) {
      addToast({ type: "error", title: "Save failed", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleAddHoliday = async () => {
    if (!holidayForm.name || !holidayForm.date) {
      addToast({ type: "error", title: "Name and date are required" });
      return;
    }
    try {
      await createHoliday(holidayForm);
      setHolidayForm({ name: "", date: "" });
      addToast({ type: "success", title: "Holiday added" });
    } catch (err) {
      addToast({ type: "error", title: "Failed to add holiday", message: err.message });
    }
  };

  const handleDeleteHoliday = async () => {
    try {
      await deleteHoliday(deletingHoliday.id);
      addToast({ type: "success", title: "Holiday deleted" });
      setDeleteHolidayOpen(false);
    } catch (err) {
      addToast({ type: "error", title: "Delete failed", message: err.message });
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api("/profile", { method: "PUT", body: profileForm });
      await reloadProfile();
      addToast({ type: "success", title: "Profile updated" });
    } catch (err) {
      addToast({ type: "error", title: "Update failed", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    if (passwordForm.password !== passwordForm.confirm) {
      addToast({ type: "error", title: "Passwords do not match" });
      return;
    }
    setSaving(true);
    try {
      await api("/change-password", {
        method: "PUT",
        body: { current_password: passwordForm.current, password: passwordForm.password, password_confirmation: passwordForm.confirm },
      });
      setPasswordForm({ current: "", password: "", confirm: "" });
      addToast({ type: "success", title: "Password changed" });
    } catch (err) {
      addToast({ type: "error", title: "Password change failed", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-page-enter">
      <Breadcrumb items={[{ label: "Settings" }]} />
      <PageHeader title="Settings" subtitle="Configure system preferences and policies" />

      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1" padding>
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${tab === t.id ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </Card>

        <div className="lg:col-span-3">
          {tab === "company" && (
            <Card>
              <CardHeader title="Company Profile" />
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Company Name" value={companyForm.company_name} onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })} required />
                <Input label="Email" type="email" value={companyForm.company_email} onChange={(e) => setCompanyForm({ ...companyForm, company_email: e.target.value })} />
                <Input label="Phone" value={companyForm.company_phone} onChange={(e) => setCompanyForm({ ...companyForm, company_phone: e.target.value })} />
              </div>
              <div className="flex gap-3 mt-6">
                <Button loading={saving} onClick={() => saveGroup("company", companyForm, "Company settings saved")}>Save Changes</Button>
              </div>
            </Card>
          )}

          {tab === "attendance" && (
            <Card>
              <CardHeader title="Attendance Rules" />
              <div className="grid md:grid-cols-2 gap-4">
                <NumericInput label="Default Grace Period (min)" value={attendanceForm.grace_minutes} onChange={(e) => setAttendanceForm({ ...attendanceForm, grace_minutes: e.target.value })} />
                <NumericInput label="Half Day Hours" value={attendanceForm.half_day_hours} onChange={(e) => setAttendanceForm({ ...attendanceForm, half_day_hours: e.target.value })} />
              </div>
              <div className="flex gap-3 mt-6"><Button loading={saving} onClick={() => saveGroup("attendance", attendanceForm, "Attendance rules saved")}>Save</Button></div>
            </Card>
          )}

          {tab === "payroll" && (
            <Card>
              <CardHeader title="Payroll Rules" />
              <div className="grid md:grid-cols-2 gap-4">
                <NumericInput label="Working Days / Month" value={payrollForm.working_days_per_month} onChange={(e) => setPayrollForm({ ...payrollForm, working_days_per_month: e.target.value })} />
                <NumericInput label="Late Deduction (₹)" value={payrollForm.late_deduction} onChange={(e) => setPayrollForm({ ...payrollForm, late_deduction: e.target.value })} />
              </div>
              <div className="flex gap-3 mt-6"><Button loading={saving} onClick={() => saveGroup("payroll", payrollForm, "Payroll rules saved")}>Save</Button></div>
            </Card>
          )}

          {tab === "holidays" && (
            <Card>
              <CardHeader title="Holiday List" />
              <div className="grid md:grid-cols-3 gap-3 mb-4">
                <Input label="Holiday Name" value={holidayForm.name} onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })} />
                <Input label="Date" type="date" value={holidayForm.date} onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })} />
                <div className="flex items-end"><Button onClick={handleAddHoliday}>Add Holiday</Button></div>
              </div>
              <DataTable columns={[
                { key: "name", label: "Holiday" },
                { key: "date", label: "Date" },
                {
                  key: "actions", label: "Actions", sortable: false,
                  render: (row) => (
                    <Button variant="ghost" size="sm" onClick={() => { setDeletingHoliday(row); setDeleteHolidayOpen(true); }}>Delete</Button>
                  ),
                },
              ]} data={holidays} pagination={false} />
            </Card>
          )}

          {tab === "profile" && (
            <div className="space-y-6">
              <ProfileCard name={user?.name || "Admin"} role={user?.role_label || "Administrator"} email={user?.email || ""} />
              <Card>
                <CardHeader title="Update Profile" />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Full Name" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                  <Input label="Email" type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                  <Input label="Phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                </div>
                <div className="flex gap-3 mt-6"><Button loading={saving} onClick={saveProfile}>Update Profile</Button></div>
              </Card>
              <Card>
                <CardHeader title="Change Password" />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Current Password" type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} />
                  <Input label="New Password" type="password" value={passwordForm.password} onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })} />
                  <Input label="Confirm Password" type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} />
                </div>
                <div className="flex gap-3 mt-6"><Button loading={saving} onClick={savePassword}>Change Password</Button></div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog open={deleteHolidayOpen} onClose={() => setDeleteHolidayOpen(false)} onConfirm={handleDeleteHoliday} title="Delete Holiday" message={`Delete ${deletingHoliday?.name}?`} confirmLabel="Delete" />
    </div>
  );
}
