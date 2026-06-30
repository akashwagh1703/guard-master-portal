import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, unwrapList, downloadFile } from "../services/api";
import { useAuth } from "./AuthContext";
import {
  mapSiteFromApi, mapSiteToApi, mapGuardFromApi, mapGuardToApi,
  mapShiftFromApi, mapShiftToApi, mapAssignmentFromApi, mapAssignmentToApi,
  mapAttendanceFromApi, mapVisitorFromApi, mapIncidentFromApi,
  mapLeaveFromApi, mapPayrollFromApi,
} from "../services/mappers";

const DataContext = createContext(null);

function settingsToPayload(group, values) {
  return {
    settings: Object.entries(values).map(([key, value]) => ({
      group,
      key,
      value: value ?? "",
    })),
  };
}

export function DataProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [sites, setSites] = useState([]);
  const [guards, setGuards] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);

  const refreshAll = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [dash, sitesR, guardsR, shiftsR, assignR, attR, visR, incR, leaveR, payR, holR, setR] = await Promise.all([
        api("/dashboard"),
        api("/sites?per_page=100"),
        api("/guards?per_page=100"),
        api("/shifts?per_page=100"),
        api("/assignments?per_page=100"),
        api("/attendance?per_page=100"),
        api("/visitors?per_page=100"),
        api("/incidents?per_page=100"),
        api("/leave-requests?per_page=100"),
        api("/payroll?per_page=100"),
        api("/holidays"),
        api("/settings"),
      ]);
      setDashboard(dash.data);
      setSites(unwrapList(sitesR).map(mapSiteFromApi));
      setGuards(unwrapList(guardsR).map(mapGuardFromApi));
      setShifts(unwrapList(shiftsR).map(mapShiftFromApi));
      setAssignments(unwrapList(assignR).map(mapAssignmentFromApi));
      setAttendance(unwrapList(attR).map(mapAttendanceFromApi));
      setVisitors(unwrapList(visR).map(mapVisitorFromApi));
      setIncidents(unwrapList(incR).map(mapIncidentFromApi));
      setLeaveRequests(unwrapList(leaveR).map(mapLeaveFromApi));
      setPayroll(unwrapList(payR).map(mapPayrollFromApi));
      setHolidays(Array.isArray(holR.data) ? holR.data : unwrapList(holR));
      setSettings(setR.data || {});
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) refreshAll();
    if (!isAuthenticated) {
      setSites([]); setGuards([]); setShifts([]); setAssignments([]);
      setAttendance([]); setVisitors([]); setIncidents([]);
      setLeaveRequests([]); setPayroll([]); setDashboard(null);
      setHolidays([]); setSettings({});
    }
  }, [authLoading, isAuthenticated, refreshAll]);

  const fetchAttendance = async (filters = {}) => {
    const params = new URLSearchParams({ per_page: "100", ...filters });
    const res = await api(`/attendance?${params}`);
    const rows = unwrapList(res).map(mapAttendanceFromApi);
    setAttendance(rows);
    return rows;
  };

  const createSite = async (values) => {
    const res = await api("/sites", { method: "POST", body: mapSiteToApi(values) });
    const site = mapSiteFromApi(res.data);
    setSites((prev) => [...prev, site]);
    return site;
  };

  const updateSite = async (id, values) => {
    const res = await api(`/sites/${id}`, { method: "PUT", body: mapSiteToApi(values) });
    const site = mapSiteFromApi(res.data);
    setSites((prev) => prev.map((s) => (s.id === id ? site : s)));
    return site;
  };

  const deleteSite = async (id) => {
    await api(`/sites/${id}`, { method: "DELETE" });
    setSites((prev) => prev.filter((s) => s.id !== id));
  };

  const createGuard = async (values) => {
    const res = await api("/guards", { method: "POST", body: mapGuardToApi(values, true) });
    const guard = mapGuardFromApi(res.data);
    setGuards((prev) => [...prev, guard]);
    return guard;
  };

  const updateGuard = async (id, values) => {
    const res = await api(`/guards/${id}`, { method: "PUT", body: mapGuardToApi(values) });
    const guard = mapGuardFromApi(res.data);
    setGuards((prev) => prev.map((g) => (g.id === id ? guard : g)));
    return guard;
  };

  const deleteGuard = async (id) => {
    await api(`/guards/${id}`, { method: "DELETE" });
    setGuards((prev) => prev.filter((g) => g.id !== id));
  };

  const createShift = async (values) => {
    const res = await api("/shifts", { method: "POST", body: mapShiftToApi(values) });
    const shift = mapShiftFromApi(res.data);
    setShifts((prev) => [...prev, shift]);
    return shift;
  };

  const updateShift = async (id, values) => {
    const res = await api(`/shifts/${id}`, { method: "PUT", body: mapShiftToApi(values) });
    const shift = mapShiftFromApi(res.data);
    setShifts((prev) => prev.map((s) => (s.id === id ? shift : s)));
    return shift;
  };

  const deleteShift = async (id) => {
    await api(`/shifts/${id}`, { method: "DELETE" });
    setShifts((prev) => prev.filter((s) => s.id !== id));
  };

  const createAssignment = async (values) => {
    const res = await api("/assignments", { method: "POST", body: mapAssignmentToApi(values) });
    const item = mapAssignmentFromApi(res.data);
    setAssignments((prev) => [...prev, item]);
    return item;
  };

  const updateAssignment = async (id, values) => {
    const res = await api(`/assignments/${id}`, { method: "PUT", body: mapAssignmentToApi(values) });
    const item = mapAssignmentFromApi(res.data);
    setAssignments((prev) => prev.map((a) => (a.id === id ? item : a)));
    return item;
  };

  const deleteAssignment = async (id) => {
    await api(`/assignments/${id}`, { method: "DELETE" });
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const updateLeaveStatus = async (id, status, adminRemarks = "") => {
    await api(`/leave-requests/${id}/status`, { method: "PUT", body: { status, admin_remarks: adminRemarks } });
    await refreshAll();
  };

  const updateSettingsGroup = async (group, values) => {
    const res = await api("/settings", { method: "PUT", body: settingsToPayload(group, values) });
    setSettings(res.data || {});
    return res.data;
  };

  const createHoliday = async (values) => {
    const res = await api("/holidays", { method: "POST", body: values });
    setHolidays((prev) => [...prev, res.data]);
    return res.data;
  };

  const deleteHoliday = async (id) => {
    await api(`/holidays/${id}`, { method: "DELETE" });
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  const generatePayroll = async (month, year) => {
    const res = await api("/payroll/generate", { method: "POST", body: { month, year } });
    await refreshAll();
    return res.data;
  };

  const downloadPayslip = async (payrollId) => {
    await downloadFile(`/payroll/${payrollId}/payslip`, `payslip-${payrollId}.pdf`);
  };

  const exportAttendance = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    await downloadFile(`/attendance/export?${params}`, "attendance-export.csv");
  };

  const exportReport = async (type, format = "csv", filters = {}) => {
    const params = new URLSearchParams(filters);
    await downloadFile(`/reports/${type}/export/${format}?${params}`, `${type}-report.${format}`);
  };

  return (
    <DataContext.Provider value={{
      sites, guards, shifts, assignments, attendance, visitors, incidents,
      leaveRequests, payroll, dashboard, holidays, settings, loading, refreshAll,
      fetchAttendance,
      createSite, updateSite, deleteSite,
      createGuard, updateGuard, deleteGuard,
      createShift, updateShift, deleteShift,
      createAssignment, updateAssignment, deleteAssignment,
      updateLeaveStatus,
      updateSettingsGroup, createHoliday, deleteHoliday,
      generatePayroll, downloadPayslip, exportAttendance, exportReport,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
