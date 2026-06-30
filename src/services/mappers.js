export function mapSiteFromApi(s) {
  return {
    id: s.id,
    name: s.name,
    client: s.client_name,
    contact: s.contact_person || "",
    phone: s.phone || "",
    address: s.address || "",
    lat: parseFloat(s.latitude) || 0,
    lng: parseFloat(s.longitude) || 0,
    radius: s.attendance_radius ?? 100,
    status: s.status,
  };
}

export function mapSiteToApi(v) {
  return {
    name: v.name,
    client_name: v.client,
    contact_person: v.contact,
    phone: v.phone,
    address: v.address,
    latitude: parseFloat(v.lat),
    longitude: parseFloat(v.lng),
    attendance_radius: parseInt(v.radius, 10),
    status: v.status,
  };
}

export function mapGuardFromApi(g) {
  return {
    id: g.id,
    employeeId: g.employee_id,
    name: g.name,
    mobile: g.mobile || "",
    email: g.email || "",
    address: g.address || "",
    joiningDate: g.joining_date || "",
    salary: parseFloat(g.salary) || 0,
    overtimeRate: parseFloat(g.overtime_rate) || 0,
    username: g.username || "",
    status: g.status,
    photo: g.photo,
  };
}

export function mapGuardToApi(v, isNew = false) {
  const payload = {
    name: v.name,
    mobile: v.mobile,
    email: v.email,
    address: v.address,
    joining_date: v.joiningDate,
    salary: parseFloat(v.salary),
    overtime_rate: parseFloat(v.overtimeRate),
    username: v.username,
    status: v.status,
  };
  if (isNew) {
    payload.employee_id = v.employeeId || `SG-${String(Date.now()).slice(-6)}`;
    payload.password = v.password || "password123";
  }
  return payload;
}

export function mapShiftFromApi(s) {
  const time = (t) => (t ? String(t).slice(0, 5) : "");
  return {
    id: s.id,
    name: s.name,
    startTime: time(s.start_time),
    endTime: time(s.end_time),
    graceTime: s.grace_minutes ?? 10,
    lateAfter: s.late_after ?? 15,
    status: s.status,
  };
}

export function mapShiftToApi(v) {
  return {
    name: v.name,
    start_time: v.startTime?.length === 5 ? `${v.startTime}:00` : v.startTime,
    end_time: v.endTime?.length === 5 ? `${v.endTime}:00` : v.endTime,
    grace_minutes: parseInt(v.graceTime, 10),
    late_after: parseInt(v.lateAfter, 10),
    status: v.status,
  };
}

export function mapAssignmentFromApi(a) {
  const guard = a.guard || a.securityGuard;
  const site = a.site;
  const shift = a.shift;
  return {
    id: a.id,
    guardId: a.guard_id,
    guardName: guard?.name || "",
    siteId: a.site_id,
    siteName: site?.name || "",
    shiftId: a.shift_id,
    shiftName: shift?.name || "",
    fromDate: a.from_date,
    toDate: a.to_date,
    status: a.status,
  };
}

export function mapAssignmentToApi(v) {
  return {
    guard_id: v.guardId,
    site_id: v.siteId,
    shift_id: v.shiftId,
    from_date: v.fromDate,
    to_date: v.toDate,
    status: v.status || "active",
  };
}

export function mapAttendanceFromApi(a) {
  return {
    id: a.id,
    date: a.date,
    guard: a.guard?.name || "",
    site: a.site?.name || "",
    shift: a.shift?.name || "",
    checkIn: a.check_in_time ? String(a.check_in_time).slice(0, 5) : "-",
    checkOut: a.check_out_time ? String(a.check_out_time).slice(0, 5) : "-",
    hours: a.working_hours ?? "-",
    late: (a.late_minutes ?? 0) > 0,
    overtime: a.overtime_hours ?? "-",
    status: a.status,
  };
}

export function mapVisitorFromApi(v) {
  return {
    id: v.id,
    name: v.visitor_name,
    purpose: v.purpose,
    personToMeet: v.person_to_meet,
    guard: v.guard?.name || "",
    site: v.site?.name || "",
    entryTime: v.entry_time ? new Date(v.entry_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "-",
    exitTime: v.exit_time ? new Date(v.exit_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "-",
    status: v.status,
  };
}

export function mapIncidentFromApi(i) {
  return {
    id: i.id,
    title: i.title,
    description: i.description,
    site: i.site?.name || "",
    guard: i.guard?.name || "",
    date: i.incident_time ? i.incident_time.slice(0, 10) : "",
    priority: i.priority,
    status: i.status,
  };
}

export function mapLeaveFromApi(l) {
  return {
    id: l.id,
    guard: l.guard?.name || "",
    type: l.type,
    from: l.from_date,
    to: l.to_date,
    days: l.days,
    reason: l.reason,
    status: l.status,
    appliedOn: l.created_at?.slice(0, 10) || "",
  };
}

export function mapPayrollFromApi(p) {
  const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return {
    id: p.id,
    guard: p.guard?.name || "",
    employeeId: p.guard?.employee_id || "",
    month: `${months[p.month] || p.month} ${p.year}`,
    baseSalary: parseFloat(p.base_salary) || 0,
    overtime: parseFloat(p.overtime_amount) || 0,
    bonus: parseFloat(p.bonus) || 0,
    deduction: parseFloat(p.deduction) || 0,
    netSalary: parseFloat(p.net_salary) || 0,
    status: p.status,
  };
}
