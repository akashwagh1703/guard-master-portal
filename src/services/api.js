const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export function getToken() {
  return localStorage.getItem("sg_admin_token");
}

export function setToken(token) {
  if (token) localStorage.setItem("sg_admin_token", token);
  else localStorage.removeItem("sg_admin_token");
}

export async function api(path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(json.message || "Request failed");
    err.errors = json.errors;
    err.status = res.status;
    throw err;
  }

  return json;
}

export function unwrapList(payload) {
  const data = payload?.data;
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

export async function downloadFile(path, filename) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: "*/*",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Download failed");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export { API_URL };
