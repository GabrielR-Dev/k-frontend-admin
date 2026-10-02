import api, { unwrap } from "./api";
import type {
  AdminPlaceFilters,
  ApprovePlacePayload,
  Place,
  RejectPlacePayload,
} from "../types";
const cat = (v: string) =>
  v === "COMMERCE" ? "SHOP" : v === "ATTRACTION" ? "TOURIST_ATTRACTION" : v;
export const normalizePlace = (p: Place): Place =>
  p ? { ...p, category: cat(p.category || "") } : p;
const item = (x: unknown): Place => {
  if (
    x &&
    typeof x === "object" &&
    "place" in x &&
    (x as { place?: unknown }).place
  )
    return (x as { place: Place }).place;
  return x as Place;
};
const list = (x: unknown): Place[] => {
  if (Array.isArray(x)) return x;
  if (x && typeof x === "object") {
    const o = x as Record<string, unknown>;
    for (const k of ["content", "places", "items"])
      if (Array.isArray(o[k])) return o[k] as Place[];
  }
  return [];
};
export const adminService = {
  async getPlaces(f: AdminPlaceFilters = {}) {
    const p: Record<string, string> = {};
    if (f.status) p.status = f.status;
    if (f.search) p.search = f.search;
    return list(unwrap(await api.get("/api/admin/places", { params: p }))).map(
      normalizePlace,
    );
  },
  async getPendingPlaces() {
    return list(unwrap(await api.get("/api/admin/places/pending"))).map(
      normalizePlace,
    );
  },
  async getPlace(id: number) {
    return normalizePlace(
      item(unwrap(await api.get(`/api/admin/places/${id}`))),
    );
  },
  async approve(id: number, p: ApprovePlacePayload) {
    return normalizePlace(
      item(unwrap(await api.put(`/api/admin/places/${id}/approve`, p))),
    );
  },
  async reject(id: number, p: RejectPlacePayload) {
    return normalizePlace(
      item(unwrap(await api.put(`/api/admin/places/${id}/reject`, p))),
    );
  },
};
