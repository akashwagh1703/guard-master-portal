import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, MapPin, Phone, Building2 } from "lucide-react";
import Breadcrumb from "../components/ui/Breadcrumb";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/Modal";
import { useData } from "../context/DataContext";
import { useToast } from "../components/ui/Toast";
import { useState } from "react";

export default function SiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sites, deleteSite } = useData();
  const { addToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const site = sites.find((s) => s.id === Number(id));

  if (!site) {
    return <div className="text-center py-20 text-slate-500">Site not found</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteSite(site.id);
      addToast({ type: "success", title: "Site deleted" });
      navigate("/sites");
    } catch (err) {
      addToast({ type: "error", title: "Delete failed", message: err.message });
    }
  };

  return (
    <div className="animate-page-enter max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: "Site Management", href: "/sites" }, { label: site.name }]} />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{site.name}</h1>
            <Badge status={site.status} />
          </div>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <Building2 className="h-4 w-4" /> {site.client}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={`/sites/${site.id}/edit`}>
            <Button variant="secondary"><Pencil className="h-4 w-4" /> Edit</Button>
          </Link>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}><Trash2 className="h-4 w-4" /> Delete</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="animate-fade-in-up">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Contact Details</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Contact Person</p>
                <p className="font-medium text-slate-900">{site.contact || "—"}</p>
                <p className="text-sm text-primary mt-0.5">{site.phone || "—"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Address</p>
              <p className="font-medium text-slate-900 mt-0.5">{site.address}</p>
            </div>
          </div>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Geofence Settings</h3>
          <div className="flex items-start gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Coordinates</p>
              <p className="font-medium text-slate-900">{site.lat}, {site.lng}</p>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-primary/5 to-indigo-50 rounded-xl border border-primary/10">
            <p className="text-sm text-slate-500">Attendance Radius</p>
            <p className="text-2xl font-bold text-primary mt-1">{site.radius}m</p>
          </div>
        </Card>
      </div>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Site" message={`Are you sure you want to delete "${site.name}"? This cannot be undone.`} confirmLabel="Delete" />
    </div>
  );
}
