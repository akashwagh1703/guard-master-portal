import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import DataTable from "../components/ui/DataTable";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import Drawer from "../components/ui/Drawer";
import { CameraPreview } from "../components/ui/FileUpload";
import { useData } from "../context/DataContext";

export default function VisitorsPage() {
  const { visitors } = useData();
  const [selected, setSelected] = useState(null);

  const columns = [
    {
      key: "name", label: "Visitor",
      render: (r) => (
        <div className="flex items-center gap-2">
          <Avatar name={r.name} size="sm" />
          <span className="font-medium">{r.name}</span>
        </div>
      ),
    },
    { key: "purpose", label: "Purpose" },
    { key: "personToMeet", label: "Person To Meet" },
    { key: "guard", label: "Guard" },
    { key: "site", label: "Site" },
    { key: "entryTime", label: "Entry" },
    { key: "exitTime", label: "Exit" },
    { key: "status", label: "Status", badge: true },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: "Visitors" }]} />
      <PageHeader title="Visitor Register" subtitle="Track all site visitors" />

      <DataTable columns={columns} data={visitors} searchPlaceholder="Search visitors..." onRowClick={setSelected} />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Visitor Details">
        {selected && (
          <div className="space-y-6">
            <CameraPreview />
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} size="lg" />
              <div>
                <h3 className="text-lg font-bold">{selected.name}</h3>
                <Badge status={selected.status} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[["Purpose", selected.purpose], ["Person To Meet", selected.personToMeet], ["Guard", selected.guard], ["Site", selected.site], ["Entry Time", selected.entryTime], ["Exit Time", selected.exitTime || "Still inside"]].map(([k, v]) => (
                <div key={k}><p className="text-slate-500">{k}</p><p className="font-medium mt-0.5">{v}</p></div>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
