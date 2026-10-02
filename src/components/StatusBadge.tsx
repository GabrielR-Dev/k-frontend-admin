import type { PlaceStatus } from "../types";
const l: Record<string, string> = {
  DRAFT: "Borrador",
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
};
export function StatusBadge({ status }: { status?: PlaceStatus }) {
  const s = status || "";
  return (
    <span className={`status ${s.toLowerCase()}`}>{l[s] || s || "—"}</span>
  );
}
