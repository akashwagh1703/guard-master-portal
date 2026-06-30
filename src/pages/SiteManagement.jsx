import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import DataTable, { ActionMenu } from "../components/ui/DataTable";
import { Select } from "../components/ui/Input";
import { ConfirmDialog } from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";
import { useData } from "../context/DataContext";

export default function SiteManagement() {
  const { sites, deleteSite } = useData();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = statusFilter === "all" ? sites : sites.filter((s) => s.status === statusFilter);

  const handleDelete = async () => {
    try {
      await deleteSite(deleting.id);
      addToast({ type: "success", title: "Site deleted" });
      setDeleteOpen(false);
      setDeleting(null);
    } catch (err) {
      addToast({ type: "error", title: "Delete failed", message: err.message });
    }
  };

  const columns = [
    {
      key: "name", label: "Site Name",
      render: (row) => (
        <Link to={`/sites/${row.id}`} className="font-medium text-slate-900 hover:text-primary transition-colors">
          {row.name}
        </Link>
      ),
    },
    { key: "client", label: "Client" },
    { key: "contact", label: "Contact Person" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status", badge: true },
    {
      key: "actions", label: "Actions", sortable: false,
      render: (row) => (
        <ActionMenu items={[
          { label: "View", onClick: () => navigate(`/sites/${row.id}`) },
          { label: "Edit", onClick: () => navigate(`/sites/${row.id}/edit`) },
          { label: "Delete", danger: true, onClick: () => { setDeleting(row); setDeleteOpen(true); } },
        ]} />
      ),
    },
  ];

  return (
    <div className="animate-page-enter">
      <Breadcrumb items={[{ label: "Site Management" }]} />
      <PageHeader
        title="Site Management"
        subtitle="Manage client sites and locations"
        actionTo="/sites/new"
        actionLabel={<><Plus className="h-4 w-4" /> Add Site</>}
      />

      <DataTable
        columns={columns}
        data={filtered}
        selectable
        searchPlaceholder="Search sites..."
        actions={
          <Select
            options={[{ value: "all", label: "All Status" }, { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40"
          />
        }
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Site"
        message={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
