import { useState } from "react";
import { Check, X } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";
import Avatar from "../components/ui/Avatar";
import { useToast } from "../components/ui/Toast";
import { useData } from "../context/DataContext";

export default function LeaveRequests() {
  const { leaveRequests, updateLeaveStatus } = useData();
  const [tab, setTab] = useState("pending");
  const { addToast } = useToast();

  const counts = {
    pending: leaveRequests.filter((l) => l.status === "pending").length,
    approved: leaveRequests.filter((l) => l.status === "approved").length,
    rejected: leaveRequests.filter((l) => l.status === "rejected").length,
  };

  const filtered = leaveRequests.filter((l) => l.status === tab);

  const handleAction = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
      addToast({ type: status === "approved" ? "success" : "warning", title: `Leave ${status}` });
    } catch (err) {
      addToast({ type: "error", title: "Failed", message: err.message });
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Leave Requests" }]} />
      <PageHeader title="Leave Requests" subtitle="Review and approve guard leave applications" />

      <Tabs
        tabs={[
          { id: "pending", label: "Pending", count: counts.pending },
          { id: "approved", label: "Approved", count: counts.approved },
          { id: "rejected", label: "Rejected", count: counts.rejected },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      <div className="space-y-4 mt-6">
        {filtered.length === 0 ? (
          <Card><p className="text-center text-slate-500 py-8">No {tab} leave requests</p></Card>
        ) : filtered.map((leave) => (
          <Card key={leave.id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar name={leave.guard} />
                <div>
                  <p className="font-semibold text-slate-900">{leave.guard}</p>
                  <p className="text-sm text-slate-500">{leave.type} &middot; {leave.days} day(s)</p>
                  <p className="text-xs text-slate-400 mt-1">{leave.from} to {leave.to}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={leave.status} />
                {tab === "pending" && (
                  <>
                    <Button variant="success" size="sm" onClick={() => handleAction(leave.id, "approved")}><Check className="h-4 w-4" /> Approve</Button>
                    <Button variant="danger" size="sm" onClick={() => handleAction(leave.id, "rejected")}><X className="h-4 w-4" /> Reject</Button>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3 pl-[72px]">{leave.reason}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
