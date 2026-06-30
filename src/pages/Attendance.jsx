import { useState } from "react";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import DataTable from "../components/ui/DataTable";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Select } from "../components/ui/Input";
import { useToast } from "../components/ui/Toast";
import { useData } from "../context/DataContext";

export default function AttendancePage() {
  const { attendance, guards, sites, fetchAttendance, exportAttendance } = useData();
  const { addToast } = useToast();
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const monthEnd = now.toISOString().slice(0, 10);

  const [fromDate, setFromDate] = useState(monthStart);
  const [toDate, setToDate] = useState(monthEnd);
  const [guardId, setGuardId] = useState("all");
  const [siteId, setSiteId] = useState("all");
  const [status, setStatus] = useState("all");
  const [exporting, setExporting] = useState(false);

  const buildFilters = () => {
    const filters = { from_date: fromDate, to_date: toDate };
    if (guardId !== "all") filters.guard_id = guardId;
    if (siteId !== "all") filters.site_id = siteId;
    if (status !== "all") filters.status = status;
    return filters;
  };

  const applyFilters = async () => {
    try {
      await fetchAttendance(buildFilters());
      addToast({ type: "success", title: "Filters applied" });
    } catch (err) {
      addToast({ type: "error", title: "Failed to load attendance", message: err.message });
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportAttendance(buildFilters());
      addToast({ type: "success", title: "Attendance exported" });
    } catch (err) {
      addToast({ type: "error", title: "Export failed", message: err.message });
    } finally {
      setExporting(false);
    }
  };

  const columns = [
    { key: "date", label: "Date" },
    { key: "guard", label: "Guard" },
    { key: "site", label: "Site" },
    { key: "shift", label: "Shift" },
    { key: "checkIn", label: "Check In" },
    { key: "checkOut", label: "Check Out" },
    { key: "hours", label: "Hours" },
    { key: "late", label: "Late", render: (r) => r.late ? <Badge status="pending">Yes</Badge> : <Badge status="active">No</Badge> },
    { key: "overtime", label: "OT" },
    { key: "status", label: "Status", badge: true },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Attendance" }]} />
      <PageHeader title="Attendance" subtitle="Track guard check-in/out and working hours" />

      <div className="flex flex-wrap gap-3 mb-4">
        <input type="date" className="px-3 py-2 text-sm border border-slate-200 rounded-lg" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <span className="self-center text-slate-400">to</span>
        <input type="date" className="px-3 py-2 text-sm border border-slate-200 rounded-lg" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <Select
          options={[{ value: "all", label: "All Guards" }, ...guards.map((g) => ({ value: String(g.id), label: g.name }))]}
          value={guardId}
          onChange={(e) => setGuardId(e.target.value)}
          className="w-40"
        />
        <Select
          options={[{ value: "all", label: "All Sites" }, ...sites.map((s) => ({ value: String(s.id), label: s.name }))]}
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
          className="w-40"
        />
        <Select
          options={[{ value: "all", label: "All Status" }, { value: "present", label: "Present" }, { value: "absent", label: "Absent" }]}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-40"
        />
        <Button size="sm" onClick={applyFilters}>Apply</Button>
      </div>

      <DataTable
        columns={columns}
        data={attendance}
        searchPlaceholder="Search attendance..."
        actions={
          <>
            <Button variant="secondary" size="sm" loading={exporting} onClick={handleExport}><Download className="h-4 w-4" /> Export CSV</Button>
            <Button variant="secondary" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
          </>
        }
      />
    </div>
  );
}
