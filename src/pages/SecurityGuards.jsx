import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import DataTable, { ActionMenu } from "../components/ui/DataTable";
import Avatar from "../components/ui/Avatar";
import { ConfirmDialog } from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";
import { useData } from "../context/DataContext";

export default function SecurityGuards() {
  const { guards, deleteGuard } = useData();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteGuard(deleting.id);
      addToast({ type: "success", title: "Guard deleted" });
      setDeleteOpen(false);
    } catch (err) {
      addToast({ type: "error", title: "Delete failed", message: err.message });
    }
  };

  const columns = [
    {
      key: "name", label: "Guard",
      render: (row) => (
        <Link to={`/guards/${row.id}`} className="flex items-center gap-3 group">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-slate-900 group-hover:text-primary transition-colors">{row.name}</p>
            <p className="text-xs text-slate-500">{row.employeeId}</p>
          </div>
        </Link>
      ),
    },
    { key: "mobile", label: "Mobile" },
    { key: "email", label: "Email" },
    { key: "joiningDate", label: "Joining Date" },
    { key: "salary", label: "Salary", render: (r) => `₹${r.salary?.toLocaleString()}` },
    { key: "status", label: "Status", badge: true },
    {
      key: "actions", label: "Actions", sortable: false,
      render: (row) => (
        <ActionMenu items={[
          { label: "View Profile", onClick: () => navigate(`/guards/${row.id}`) },
          { label: "Edit", onClick: () => navigate(`/guards/${row.id}/edit`) },
          { label: "Delete", danger: true, onClick: () => { setDeleting(row); setDeleteOpen(true); } },
        ]} />
      ),
    },
  ];

  return (
    <div className="animate-page-enter">
      <Breadcrumb items={[{ label: "Security Guards" }]} />
      <PageHeader
        title="Security Guards"
        subtitle="Manage guard profiles and employment details"
        actionTo="/guards/new"
        actionLabel={<><Plus className="h-4 w-4" /> Add Guard</>}
      />

      <DataTable columns={columns} data={guards} selectable searchPlaceholder="Search guards..." />

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Guard" message={`Delete ${deleting?.name}?`} confirmLabel="Delete" />
    </div>
  );
}
