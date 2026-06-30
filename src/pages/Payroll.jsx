import { useMemo, useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import Card, { CardHeader } from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import { Wallet, TrendingUp, Minus, Plus } from "lucide-react";
import { useToast } from "../components/ui/Toast";
import { useData } from "../context/DataContext";

export default function PayrollPage() {
  const { payroll, generatePayroll, downloadPayslip } = useData();
  const { addToast } = useToast();
  const now = new Date();
  const [generating, setGenerating] = useState(false);

  const totalPending = payroll.filter((p) => p.status === "pending").reduce((s, p) => s + p.netSalary, 0);
  const totalProcessed = payroll.filter((p) => p.status === "processed").reduce((s, p) => s + p.netSalary, 0);
  const totalDeductions = payroll.reduce((s, p) => s + p.deduction, 0);

  const salaryHistory = useMemo(() => {
    const grouped = payroll.reduce((acc, row) => {
      if (!acc[row.month]) {
        acc[row.month] = { month: row.month, total: 0, count: 0, status: "processed" };
      }
      acc[row.month].total += row.netSalary;
      acc[row.month].count += 1;
      if (row.status === "pending") acc[row.month].status = "pending";
      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) => b.month.localeCompare(a.month));
  }, [payroll]);

  const currentMonthLabel = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generatePayroll(now.getMonth() + 1, now.getFullYear());
      addToast({ type: "success", title: "Payroll generated" });
    } catch (err) {
      addToast({ type: "error", title: "Generation failed", message: err.message });
    } finally {
      setGenerating(false);
    }
  };

  const handlePayslip = async (row) => {
    try {
      await downloadPayslip(row.id);
      addToast({ type: "success", title: "Payslip downloaded" });
    } catch (err) {
      addToast({ type: "error", title: "Download failed", message: err.message });
    }
  };

  const columns = [
    { key: "guard", label: "Guard" },
    { key: "employeeId", label: "Employee ID" },
    { key: "month", label: "Month" },
    { key: "baseSalary", label: "Base", render: (r) => `₹${r.baseSalary.toLocaleString()}` },
    { key: "overtime", label: "OT", render: (r) => `₹${r.overtime.toLocaleString()}` },
    { key: "bonus", label: "Bonus", render: (r) => `₹${r.bonus.toLocaleString()}` },
    { key: "deduction", label: "Deduction", render: (r) => `₹${r.deduction.toLocaleString()}` },
    { key: "netSalary", label: "Net Salary", render: (r) => <span className="font-semibold">₹{r.netSalary.toLocaleString()}</span> },
    { key: "status", label: "Status", badge: true },
    {
      key: "actions", label: "Actions", sortable: false,
      render: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => handlePayslip(row)}>Payslip</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Payroll" }]} />
      <PageHeader title="Payroll" subtitle="Manage guard salaries and generate payslips" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Payroll" value={`₹${(totalPending + totalProcessed).toLocaleString()}`} icon={Wallet} color="primary" />
        <StatCard title="Pending" value={`₹${totalPending.toLocaleString()}`} icon={TrendingUp} color="amber" />
        <StatCard title="Processed" value={`₹${totalProcessed.toLocaleString()}`} icon={Plus} color="green" />
        <StatCard title="Deductions" value={`₹${totalDeductions.toLocaleString()}`} icon={Minus} color="red" />
      </div>

      <Card className="mb-6">
        <CardHeader
          title={`${currentMonthLabel} Payroll`}
          action={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" loading={generating} onClick={handleGenerate}>Generate Payslips</Button>
            </div>
          }
        />
        <DataTable columns={columns} data={payroll} searchPlaceholder="Search payroll..." />
      </Card>

      <Card>
        <CardHeader title="Salary History" subtitle="Previous months" />
        <div className="space-y-3">
          {salaryHistory.length === 0 ? (
            <p className="text-sm text-slate-500">No payroll records yet.</p>
          ) : salaryHistory.map((month) => (
            <div key={month.month} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-900">{month.month}</p>
                <p className="text-xs text-slate-500">{month.count} guards processed</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-900">₹{month.total.toLocaleString()}</span>
                <Badge status={month.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
