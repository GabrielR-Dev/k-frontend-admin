import { useEffect, useState } from "react";
import { Eye, RefreshCw, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../services/admin.service";
import { apiMessage } from "../services/api";
import type { Place } from "../types";
import { StatusBadge } from "../components/StatusBadge";
export function Header({
  title,
  sub,
  refresh,
}: {
  title: string;
  sub: string;
  refresh?: () => void;
}) {
  return (
    <div className="page-head">
      <div>
        <small>REVISIÓN</small>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
      {refresh && (
        <button className="secondary" onClick={refresh}>
          <RefreshCw size={16} />
          Actualizar
        </button>
      )}
    </div>
  );
}
export function Table({
  places,
  loading,
  view,
  empty,
}: {
  places: Place[];
  loading: boolean;
  view: (id: number) => void;
  empty: string;
}) {
  if (loading) return <div className="card empty">Cargando lugares…</div>;
  if (!places.length)
    return (
      <div className="card empty">
        <h3>{empty}</h3>
        <p>No hay resultados para mostrar.</p>
      </div>
    );
  const owner = (p: Place) =>
    p.owner
      ? `${p.owner.name || ""} ${p.owner.last_name || p.owner.lastName || ""}`.trim() ||
        p.owner.email ||
        "—"
      : p.owner_id || p.ownerId
        ? `ID #${p.owner_id || p.ownerId}`
        : "—";
  return (
    <div className="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>Lugar</th>
            <th>Categoría</th>
            <th>Ciudad</th>
            <th>Propietario</th>
            <th>Estado</th>
            <th>Creado</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {places.map((p) => (
            <tr key={p.id}>
              <td>
                <b>{p.name}</b>
                <small>{p.address || "Sin dirección"}</small>
              </td>
              <td>{p.category}</td>
              <td>{p.city || "—"}</td>
              <td>{owner(p)}</td>
              <td>
                <StatusBadge status={p.status} />
              </td>
              <td>{date(p.created_at || p.createdAt)}</td>
              <td>
                <button className="eye" onClick={() => view(p.id)}>
                  <Eye size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const date = (x?: string) =>
  x ? new Date(x).toLocaleDateString("es-AR") : "—";
export function Pending() {
  const [ps, setPs] = useState<Place[]>([]),
    [q, setQ] = useState(""),
    [loading, setLoading] = useState(true),
    [err, setErr] = useState("");
  const nav = useNavigate();
  const load = () => {
    setLoading(true);
    adminService
      .getPendingPlaces()
      .then(setPs)
      .catch((e) =>
        setErr(apiMessage(e, "No se pudieron cargar los pendientes.")),
      )
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  const f = ps.filter((p) =>
    `${p.name} ${p.category} ${p.city || ""} ${p.owner?.name || ""} ${p.owner?.email || ""}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <>
      <Header
        title="Lugares pendientes"
        sub="Revisá cada publicación antes de autorizarla."
        refresh={load}
      />
      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Buscar nombre, categoría, ciudad o propietario…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
      {err && <div className="error">{err}</div>}
      <Table
        places={f}
        loading={loading}
        view={(id) => nav(`/admin/places/${id}`)}
        empty="No hay lugares pendientes."
      />
    </>
  );
}
