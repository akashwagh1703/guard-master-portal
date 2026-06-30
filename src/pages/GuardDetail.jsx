import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, Mail, Phone, Calendar, Wallet } from "lucide-react";
import { useState } from "react";
import Breadcrumb from "../components/ui/Breadcrumb";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/Modal";
import { useData } from "../context/DataContext";
import { useToast } from "../components/ui/Toast";

export default function GuardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { guards, deleteGuard } = useData();
  const { addToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const guard = guards.find((g) => g.id === Number(id));

  if (!guard) {
    return <div className="text-center py-20 text-slate-500">Guard not found</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteGuard(guard.id);
      addToast({ type: "success", title: "Guard deleted" });
      navigate("/guards");
    } catch (err) {
      addToast({ type: "error", title: "Delete failed", message: err.message });
    }
  };

  const info = [
    { icon: Phone, label: "Mobile", value: guard.mobile },
    { icon: Mail, label: "Email", value: guard.email || "—" },
    { icon: Calendar, label: "Joining Date", value: guard.joiningDate },
    { icon: Wallet, label: "Salary", value: `₹${guard.salary?.toLocaleString()}/mo` },
  ];

  return (
    <div className="animate-page-enter max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: "Security Guards", href: "/guards" }, { label: guard.name }]} />

      <Card className="mb-6 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary via-blue-500 to-indigo-500" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Avatar name={guard.name} size="xl" className="ring-4 ring-white shadow-lg" />
              <div className="pb-1">
                <h1 className="text-2xl font-bold text-slate-900">{guard.name}</h1>
                <p className="text-sm text-slate-500">{guard.employeeId} &middot; @{guard.username}</p>
                <Badge status={guard.status} className="mt-2" />
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/guards/${guard.id}/edit`}>
                <Button variant="secondary"><Pencil className="h-4 w-4" /> Edit</Button>
              </Link>
              <Button variant="danger" onClick={() => setDeleteOpen(true)}><Trash2 className="h-4 w-4" /> Delete</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="animate-fade-in-up">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Contact & Employment</h3>
          <div className="space-y-4">
            {info.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-medium text-slate-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Compensation</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-primary/5 to-blue-50 rounded-xl border border-primary/10">
              <p className="text-xs text-slate-500">Monthly Salary</p>
              <p className="text-xl font-bold text-primary mt-1">₹{guard.salary?.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <p className="text-xs text-slate-500">Overtime Rate</p>
              <p className="text-xl font-bold text-green-600 mt-1">₹{guard.overtimeRate}/hr</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-500">Address</p>
            <p className="text-sm font-medium text-slate-900 mt-0.5">{guard.address || "—"}</p>
          </div>
        </Card>
      </div>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Guard" message={`Delete ${guard.name}? This cannot be undone.`} confirmLabel="Delete" />
    </div>
  );
}
