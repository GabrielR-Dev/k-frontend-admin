import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8180",
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((c) => {
  const t = localStorage.getItem("kiago_admin_token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401) {
      localStorage.removeItem("kiago_admin_token");
      window.dispatchEvent(new Event("kiago:logout"));
    }
    return Promise.reject(e);
  },
);
export function apiMessage(e: unknown, f = "Ocurrió un error.") {
  return axios.isAxiosError(e)
    ? e.response?.data?.message || e.response?.data?.error || f
    : f;
}
export function unwrap<T>(r: unknown): T {
  const d = (r as { data?: unknown })?.data;
  if (d && typeof d === "object" && "success" in d && "data" in d)
    return (d as { data: T }).data;
  return d as T;
}
export default api;
