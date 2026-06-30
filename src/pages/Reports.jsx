import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import Card, { CardHeader } from "../components/ui/Card";
import Tabs from "../components/ui/Tabs";
import DataTable from "../components/ui/DataTable";
import Button from "../components/ui/Button";
import { Select } from "../components/ui/Input";
import { Download } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useData } from "../context/DataContext";
import { useToast } from "../components/ui/Toast";

export default function ReportsPage() {
  const { attendance, visitors, incidents, guards, payroll, dashboard, exportReport } = useData();
  const attendanceTrend = dashboard?.charts?.attendanceTrend || [];
  const sitePerformance = dashboard?.charts?.sitePerformance || [];
  const [tab, setTab] = useState("attendance");
  const [exporting, setExporting] = useState(false);
  const { addToast } = useToast();

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportReport(tab, "csv");
      addToast({ type: "success", title: "Report exported" });
    } catch (err) {
      addToast({ type: "error", title: "Export failed", message: err.message });
    } finally {
      setExporting(false);
    }
  };

  const tabs = [
    { id: "attendance", label: "Attendance" },
    { id: "payroll", label: "Payroll" },
    { id: "visitors", label: "Visitors" },
    { id: "incidents", label: "Incidents" },
    { id: "sites", label: "Site Report" },
    { id: "guards", label: "Guard Report" },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Reports" }]} />
      <PageHeader title="Reports" subtitle="Analytics and exportable reports" />

      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />

      <div className="flex flex-wrap gap-3 my-6">
        <Select options={[{ value: "jun2026", label: "June 2026" }, { value: "may2026", label: "May 2026" }]} className="w-44" />
        <Select options={[{ value: "all", label: "All Sites" }]} className="w-44" />
        <Button variant="secondary" size="sm" loading={exporting} onClick={handleExport}><Download className="h-4 w-4" /> Export</Button>
      </div>

      {tab === "attendance" && (
        <div className="space-y-6">
          <Card>
            <CardHeader title="Attendance Report" />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" /><YAxis /><Tooltip />
                <Bar dataKey="present" fill="#2563EB" name="Present" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <DataTable columns={[
            { key: "date", label: "Date" }, { key: "guard", label: "Guard" }, { key: "site", label: "Site" },
            { key: "checkIn", label: "Check In" }, { key: "checkOut", label: "Check Out" }, { key: "status", label: "Status", badge: true },
          ]} data={attendance} />
        </div>
      )}

      {tab === "payroll" && (
        <Card>
          <CardHeader title="Payroll Summary" />
          <DataTable columns={[
            { key: "guard", label: "Guard" },
            { key: "month", label: "Month" },
            { key: "netSalary", label: "Net Salary", render: (r) => `₹${r.netSalary?.toLocaleString()}` },
            { key: "status", label: "Status", badge: true },
          ]} data={payroll} />
        </Card>
      )}

      {tab === "visitors" && (
        <DataTable columns={[
          { key: "name", label: "Visitor" }, { key: "purpose", label: "Purpose" }, { key: "site", label: "Site" },
          { key: "entryTime", label: "Entry" }, { key: "exitTime", label: "Exit" }, { key: "status", label: "Status", badge: true },
        ]} data={visitors} />
      )}

      {tab === "incidents" && (
        <DataTable columns={[
          { key: "title", label: "Incident" }, { key: "site", label: "Site" }, { key: "date", label: "Date" },
          { key: "priority", label: "Priority", badge: true }, { key: "status", label: "Status", badge: true },
        ]} data={incidents} />
      )}

      {tab === "sites" && (
        <Card>
          <CardHeader title="Site Performance Report" />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sitePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="site" /><YAxis domain={[0, 100]} /><Tooltip />
              <Bar dataKey="attendance" fill="#16a34a" name="Attendance %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {tab === "guards" && (
        <DataTable columns={[
          { key: "employeeId", label: "ID" }, { key: "name", label: "Name" }, { key: "mobile", label: "Mobile" },
          { key: "joiningDate", label: "Joined" }, { key: "salary", label: "Salary", render: (r) => `₹${r.salary?.toLocaleString()}` },
          { key: "status", label: "Status", badge: true },
        ]} data={guards} />
      )}
    </div>
  );
}
