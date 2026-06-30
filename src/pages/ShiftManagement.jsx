import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import DataTable, { ActionMenu } from "../components/ui/DataTable";
import { ConfirmDialog } from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";
import { useData } from "../context/DataContext";

export default function ShiftManagement() {
  const { shifts, deleteShift } = useData();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteShift(deleting.id);
      addToast({ type: "success", title: "Shift deleted" });
      setDeleteOpen(false);
    } catch (err) {
      addToast({ type: "error", title: "Delete failed", message: err.message });
    }
  };

  const columns = [
    { key: "name", label: "Shift Name" },
    { key: "startTime", label: "Start Time" },
    { key: "endTime", label: "End Time" },
    { key: "graceTime", label: "Grace (min)" },
    { key: "lateAfter", label: "Late After (min)" },
    { key: "status", label: "Status", badge: true },
    {
      key: "actions", label: "Actions", sortable: false,
      render: (row) => (
        <ActionMenu items={[
          { label: "Edit", onClick: () => navigate(`/shifts/${row.id}/edit`) },
          { label: "Delete", danger: true, onClick: () => { setDeleting(row); setDeleteOpen(true); } },
        ]} />
      ),
    },
  ];

  return (
    <div className="animate-page-enter">
      <Breadcrumb items={[{ label: "Shift Management" }]} />
      <PageHeader
        title="Shift Management"
        subtitle="Define and manage work shifts"
        actionTo="/shifts/new"
        actionLabel={<><Plus className="h-4 w-4" /> Add Shift</>}
      />
      <DataTable columns={columns} data={shifts} searchPlaceholder="Search shifts..." />
      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Shift" message={`Delete "${deleting?.name}"?`} confirmLabel="Delete" />
    </div>
  );
}
