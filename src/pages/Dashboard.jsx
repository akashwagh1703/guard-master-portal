import {
  Shield, UserCheck, LogIn, UserX, Building2, Users, AlertTriangle, Wallet,
  Plus, FileText, Calendar, TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import StatCard from "../components/ui/StatCard";
import Card, { CardHeader } from "../components/ui/Card";
import ChartCard, { ChartTooltip } from "../components/ui/ChartCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { useData } from "../context/DataContext";

const siteColors = ["#2563EB", "#3B82F6", "#60A5FA", "#16A34A", "#059669"];

export default function Dashboard() {
  const { dashboard, loading } = useData();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const stats = dashboard?.stats || {};
  const attendanceTrend = dashboard?.charts?.attendanceTrend || [];
  const lateArrivals = dashboard?.charts?.lateArrivals || [];
  const sitePerformance = dashboard?.charts?.sitePerformance || [];
  const recentVisitors = dashboard?.recentVisitors || [];
  const recentIncidents = dashboard?.recentIncidents || [];
  const recentActivity = dashboard?.recentActivity || [];
  const shiftSummary = dashboard?.shiftSummary || [];

  const statItems = [
    { title: "Total Guards", value: stats.totalGuards ?? 0, icon: Shield, color: "primary", trend: "Active guards", trendUp: true },
    { title: "On Duty", value: stats.onDuty ?? 0, icon: UserCheck, color: "green" },
    { title: "Checked In", value: stats.checkedIn ?? 0, icon: LogIn, color: "green" },
    { title: "Absent", value: stats.absent ?? 0, icon: UserX, color: "red" },
    { title: "Sites", value: stats.sites ?? 0, icon: Building2, color: "primary" },
    { title: "Today's Visitors", value: stats.todayVisitors ?? 0, icon: Users, color: "slate" },
    { title: "Incidents Today", value: stats.incidentsToday ?? 0, icon: AlertTriangle, color: "amber" },
    { title: "Payroll Pending", value: stats.payrollPending ?? 0, icon: Wallet, color: "amber" },
  ];

  if (loading && !dashboard) {
    return <div className="flex justify-center py-24"><Loader size="lg" /></div>;
  }

  return (
    <div className="space-y-6 animate-page-enter">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary mb-1 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" /> Operations Overview
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">{today}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/guards/new"><Button size="sm"><Plus className="h-4 w-4" /> Add Guard</Button></Link>
          <Link to="/reports"><Button variant="secondary" size="sm"><FileText className="h-4 w-4" /> Reports</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, i) => (
          <StatCard key={item.title} {...item} delay={i * 50} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Attendance Trend" subtitle="Present vs absent — last 7 days" delay={100}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Area type="monotone" dataKey="present" stroke="#2563EB" strokeWidth={2.5} fill="url(#presentGrad)" name="Present" animationDuration={800} />
              <Area type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} fill="url(#absentGrad)" name="Absent" animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Late Arrivals" subtitle="Weekly late check-in trend" delay={150}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lateArrivals}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="count" stroke="url(#lineGrad)" strokeWidth={3} dot={{ fill: "#D97706", strokeWidth: 2, r: 4, stroke: "#fff" }} activeDot={{ r: 6, stroke: "#D97706", strokeWidth: 2 }} name="Late Arrivals" animationDuration={1000} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Site Performance" subtitle="Attendance rate by site (%)" className="lg:col-span-2" delay={200}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sitePerformance} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="site" type="category" tick={{ fontSize: 12, fill: "#64748B" }} width={95} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} formatter={(v) => [`${v}%`, "Attendance"]} />
              <Bar dataKey="attendance" radius={[0, 6, 6, 0]} name="Attendance %" animationDuration={900}>
                {sitePerformance.map((_, i) => (
                  <Cell key={i} fill={siteColors[i % siteColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="animate-fade-in-up chart-card" style={{ animationDelay: "250ms" }}>
          <CardHeader title="Today's Shift Summary" subtitle="Live attendance by shift" />
          <div className="space-y-3">
            {shiftSummary.map((s, i) => {
              const pct = Math.round((s.present / s.assigned) * 100);
              return (
                <div key={s.shift} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-900">{s.shift}</p>
                    <span className="text-xs font-semibold text-primary">{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-700 ease-out"
                      style={{ width: `${pct}%`, transitionDelay: `${300 + i * 100}ms` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-green-600 font-medium">{s.present} present</span>
                    <span className="text-red-500">{s.absent} absent</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <CardHeader title="Quick Actions" />
          <div className="grid grid-cols-2 gap-2">
            <Link to="/guards/new"><Button variant="secondary" className="w-full hover-lift"><Plus className="h-4 w-4" /> Add Guard</Button></Link>
            <Link to="/sites/new"><Button variant="secondary" className="w-full hover-lift"><Building2 className="h-4 w-4" /> Add Site</Button></Link>
            <Link to="/attendance"><Button variant="secondary" className="w-full hover-lift"><Calendar className="h-4 w-4" /> Attendance</Button></Link>
            <Link to="/reports"><Button variant="secondary" className="w-full hover-lift"><FileText className="h-4 w-4" /> Reports</Button></Link>
          </div>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: "350ms" }}>
          <CardHeader title="Recent Activity" />
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={a.id} className="flex gap-3 group">
                <div className="relative flex flex-col items-center">
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ring-4 ring-white ${a.type === "success" ? "bg-green-500" : a.type === "danger" ? "bg-red-500" : "bg-blue-500"}`} />
                  {i < recentActivity.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                </div>
                <div className="pb-3">
                  <p className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">{a.action}</p>
                  <p className="text-xs text-slate-500">{a.detail}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <CardHeader title="Recent Visitors" action={<Link to="/visitors" className="text-sm text-primary hover:underline font-medium">View all</Link>} />
          <div className="space-y-2">
            {recentVisitors.slice(0, 3).map((v) => (
              <div key={v.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-900">{v.name}</p>
                  <p className="text-xs text-slate-500">{v.site}</p>
                </div>
                <Badge status={v.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="animate-fade-in-up overflow-hidden" style={{ animationDelay: "450ms" }}>
        <div className="h-0.5 bg-gradient-to-r from-red-400 via-amber-400 to-red-400" />
        <div className="p-6">
          <CardHeader title="Recent Incidents" action={<Link to="/incidents" className="text-sm text-primary hover:underline font-medium">View all</Link>} />
          <div className="grid md:grid-cols-2 gap-4">
            {recentIncidents.slice(0, 2).map((inc) => (
              <div key={inc.id} className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{inc.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{inc.site} &middot; {inc.date}</p>
                  </div>
                  <Badge status={inc.priority} />
                </div>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{inc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
