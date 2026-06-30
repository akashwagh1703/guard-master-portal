import PageHeader from "../components/layout/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import Card, { CardHeader } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Tabs from "../components/ui/Tabs";
import { useState } from "react";
import { useData } from "../context/DataContext";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function IncidentsPage() {
  const { incidents } = useData();
  const [tab, setTab] = useState("all");

  const counts = {
    open: incidents.filter((i) => i.status === "open").length,
    pending: incidents.filter((i) => i.status === "pending").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
  };

  const filtered = tab === "all" ? incidents : incidents.filter((i) => i.status === tab);

  return (
    <div>
      <Breadcrumb items={[{ label: "Incidents" }]} />
      <PageHeader title="Incident Management" subtitle="Track and resolve security incidents" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card padding className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
          <div><p className="text-2xl font-bold text-slate-900">{counts.open}</p><p className="text-sm text-slate-500">Open</p></div>
        </Card>
        <Card padding className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center"><Clock className="h-6 w-6 text-amber-600" /></div>
          <div><p className="text-2xl font-bold text-slate-900">{counts.pending}</p><p className="text-sm text-slate-500">Pending</p></div>
        </Card>
        <Card padding className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center"><CheckCircle className="h-6 w-6 text-green-600" /></div>
          <div><p className="text-2xl font-bold text-slate-900">{counts.resolved}</p><p className="text-sm text-slate-500">Resolved</p></div>
        </Card>
      </div>

      <Tabs
        tabs={[
          { id: "all", label: "All", count: incidents.length },
          { id: "open", label: "Open", count: counts.open },
          { id: "pending", label: "Pending", count: counts.pending },
          { id: "resolved", label: "Resolved", count: counts.resolved },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {filtered.map((inc) => (
          <Card key={inc.id} hover>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900">{inc.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{inc.site} &middot; {inc.date}</p>
              </div>
              <div className="flex gap-2">
                <Badge status={inc.priority} />
                <Badge status={inc.status} />
              </div>
            </div>
            <div className="h-32 bg-slate-100 rounded-lg mb-3 flex items-center justify-center text-sm text-slate-400">
              Photo Preview
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">{inc.description}</p>
            <p className="text-xs text-slate-400 mt-2">Reported by: {inc.guard}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
