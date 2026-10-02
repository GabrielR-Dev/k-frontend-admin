import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../services/admin.service";
import { apiMessage } from "../services/api";
import type { Place, PlaceStatus } from "../types";
import { Header, Table } from "./Pending";
export function Places() {
  const [ps, setPs] = useState<Place[]>([]),
    [status, setStatus] = useState<PlaceStatus | "">(""),
    [q, setQ] = useState(""),
    [loading, setLoading] = useState(true),
    [err, setErr] = useState("");
  const nav = useNavigate();
  const load = () => {
    setLoading(true);
    adminService
      .getPlaces({ status })
      .then(setPs)
      .catch((e) => setErr(apiMessage(e, "No se pudieron cargar los lugares.")))
      .finally(() => setLoading(false));
  };
  useEffect(load, [status]);
  const f = ps.filter((p) =>
    `${p.name} ${p.category} ${p.city || ""} ${p.owner?.name || ""} ${p.owner?.email || ""}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <>
      <Header
        title="Todos los lugares"
        sub="Consultá el estado y la información de cada publicación."
        refresh={load}
      />
      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Buscar…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as PlaceStatus | "")}
        >
          <option value="">Todos</option>
          <option value="DRAFT">Borrador</option>
          <option value="PENDING">Pendiente</option>
          <option value="APPROVED">Aprobado</option>
          <option value="REJECTED">Rechazado</option>
        </select>
      </div>
      {err && <div className="error">{err}</div>}
      <Table
        places={f}
        loading={loading}
        view={(id) => nav(`/admin/places/${id}`)}
        empty="No hay lugares que coincidan."
      />
    </>
  );
}
