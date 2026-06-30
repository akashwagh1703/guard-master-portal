import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import Card, { CardHeader } from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import Button from "../components/ui/Button";
import { Select } from "../components/ui/Input";
import { useToast } from "../components/ui/Toast";
import { useData } from "../context/DataContext";

export default function GuardAssignment() {
  const { sites, guards, shifts, assignments, createAssignment } = useData();
  const [form, setForm] = useState({});
  const { addToast } = useToast();

  const handleAssign = async () => {
    if (!form.siteId || !form.guardId || !form.shiftId || !form.fromDate || !form.toDate) {
      addToast({ type: "error", title: "Missing fields", message: "Please fill all required fields." });
      return;
    }
    if (form.fromDate > form.toDate) {
      addToast({ type: "error", title: "Invalid dates", message: "From date must be before To date." });
      return;
    }

    const site = sites.find((s) => s.id === Number(form.siteId));
    const guard = guards.find((g) => g.id === Number(form.guardId));

    try {
      await createAssignment({
        guardId: Number(form.guardId),
        siteId: Number(form.siteId),
        shiftId: Number(form.shiftId),
        fromDate: form.fromDate,
        toDate: form.toDate,
      });
      setForm({});
      addToast({ type: "success", title: "Guard assigned", message: `${guard.name} assigned to ${site.name}` });
    } catch (err) {
      addToast({ type: "error", title: "Assignment failed", message: err.message });
    }
  };

  const columns = [
    { key: "guardName", label: "Guard" },
    { key: "siteName", label: "Site" },
    { key: "shiftName", label: "Shift" },
    { key: "fromDate", label: "From" },
    { key: "toDate", label: "To" },
  ];

  return (
    <div className="animate-page-enter">
      <Breadcrumb items={[{ label: "Guard Assignment" }]} />
      <PageHeader title="Guard Assignment" subtitle="Assign guards to sites and shifts" />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary to-indigo-500" />
          <div className="p-6">
            <CardHeader title="New Assignment" subtitle="Select site, guard, and shift" />
            <div className="space-y-4">
              <Select label="Select Site" required placeholder="Choose site..." options={sites.filter((s) => s.status === "active").map((s) => ({ value: s.id, label: s.name }))} value={form.siteId || ""} onChange={(e) => setForm({ ...form, siteId: e.target.value })} />
              <Select label="Select Guard" required placeholder="Choose guard..." options={guards.filter((g) => g.status === "active").map((g) => ({ value: g.id, label: g.name }))} value={form.guardId || ""} onChange={(e) => setForm({ ...form, guardId: e.target.value })} />
              <Select label="Select Shift" required placeholder="Choose shift..." options={shifts.filter((s) => s.status === "active").map((s) => ({ value: s.id, label: s.name }))} value={form.shiftId || ""} onChange={(e) => setForm({ ...form, shiftId: e.target.value })} />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">From Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" value={form.fromDate || ""} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">To Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" value={form.toDate || ""} onChange={(e) => setForm({ ...form, toDate: e.target.value })} />
              </div>
              <Button className="w-full" onClick={handleAssign}>Assign Guard</Button>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Assigned Guards" subtitle={`${assignments.length} active assignments`} />
          <DataTable columns={columns} data={assignments} searchPlaceholder="Search assignments..." pagination={false} />
        </Card>
      </div>
    </div>
  );
}
