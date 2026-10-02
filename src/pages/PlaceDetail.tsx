import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { adminService } from "../services/admin.service";
import { apiMessage } from "../services/api";
import type { Place } from "../types";
import { StatusBadge } from "../components/StatusBadge";
export function PlaceDetail() {
  const { id } = useParams(),
    nav = useNavigate();
  const [p, setP] = useState<Place | null>(null),
    [err, setErr] = useState(""),
    [ok, setOk] = useState(""),
    [busy, setBusy] = useState(false),
    [modal, setModal] = useState<"a" | "r" | null>(null),
    [reason, setReason] = useState("");
  useEffect(() => {
    if (id)
      adminService
        .getPlace(+id)
        .then(setP)
        .catch((e) => setErr(apiMessage(e, "No se pudo cargar el lugar.")));
  }, [id]);
  const approve = async () => {
    if (!p) return;
    setBusy(true);
    try {
      setP(await adminService.approve(p.id, { status: "APPROVED" }));
      setOk("Lugar aprobado correctamente.");
      setModal(null);
    } catch (e) {
      setErr(apiMessage(e, "No se pudo aprobar el lugar."));
    } finally {
      setBusy(false);
    }
  };
  const reject = async () => {
    const r = reason.trim();
    if (!p || r.length < 3 || r.length > 1000) return;
    setBusy(true);
    try {
      setP(
        await adminService.reject(p.id, {
          status: "REJECTED",
          rejection_reason: r,
        }),
      );
      setOk("Lugar rechazado correctamente.");
      setReason("");
      setModal(null);
    } catch (e) {
      setErr(apiMessage(e, "No se pudo rechazar el lugar."));
    } finally {
      setBusy(false);
    }
  };
  if (!p) return <div className="card empty">{err || "Cargando detalle…"}</div>;
  return (
    <>
      <button className="back" onClick={() => nav(-1)}>
        <ArrowLeft size={16} />
        Volver
      </button>
      <div className="detail-head">
        <div>
          <small>LUGAR #{p.id}</small>
          <h2>{p.name}</h2>
          <StatusBadge status={p.status} />
        </div>
        {p.status === "PENDING" && (
          <div className="actions">
            <button onClick={() => setModal("a")} className="approve">
              <Check size={16} />
              Aprobar
            </button>
            <button onClick={() => setModal("r")} className="reject">
              <X size={16} />
              Rechazar
            </button>
          </div>
        )}
      </div>
      {err && <div className="error">{err}</div>}
      {ok && <div className="success">{ok}</div>}
      {p.status === "REJECTED" && (
        <div className="rejection">
          <b>Motivo del rechazo</b>
          <p>{p.rejection_reason || p.rejectionReason || "No informado."}</p>
        </div>
      )}
      <div className="grid">
        <Card title="Información general">
          <F l="Descripción" v={p.description} />
          <F l="Dirección" v={p.address} />
          <F l="Ciudad" v={p.city} />
          <F l="Provincia" v={p.province} />
          <F l="País" v={p.country} />
        </Card>
        <Card title="Contacto">
          <F l="Teléfono" v={p.phone} />
          <F l="Email" v={p.email} />
          <F l="Web" v={p.website} />
          <F l="Imagen" v={p.image_url || p.imageUrl} />
        </Card>
        <Card title="Propietario">
          <F l="ID" v={String(p.owner_id ?? p.ownerId ?? "—")} />
          <F
            l="Nombre"
            v={
              p.owner
                ? `${p.owner.name || ""} ${p.owner.last_name || p.owner.lastName || ""}`.trim()
                : undefined
            }
          />
          <F l="Email" v={p.owner?.email} />
        </Card>
        <Card title="Auditoría">
          <F l="Creado" v={fmt(p.created_at || p.createdAt)} />
          <F l="Actualizado" v={fmt(p.updated_at || p.updatedAt)} />
          <F
            l="Aprobado por"
            v={String(p.approved_by ?? p.approvedBy ?? "—")}
          />
          <F l="Aprobado en" v={fmt(p.approved_at || p.approvedAt)} />
        </Card>
        <Card title="Ubicación">
          <F l="Latitud" v={String(p.latitude ?? "—")} />
          <F l="Longitud" v={String(p.longitude ?? "—")} />
        </Card>
        <Card title="Metadata">
          <pre>{JSON.stringify(p.metadata || {}, null, 2)}</pre>
        </Card>
      </div>
      {modal === "a" && (
        <Modal
          title="¿Aprobar este lugar?"
          onClose={() => setModal(null)}
          onConfirm={approve}
          busy={busy}
        >
          <p>
            El lugar pasará a <b>APPROVED</b>.
          </p>
        </Modal>
      )}
      {modal === "r" && (
        <Modal
          title="Rechazar lugar"
          onClose={() => !busy && setModal(null)}
          onConfirm={reject}
          busy={busy}
          danger
          disabled={reason.trim().length < 3}
        >
          <textarea
            maxLength={1000}
            placeholder="Motivo del rechazo (3 a 1000 caracteres)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <small>{reason.trim().length}/1000</small>
        </Modal>
      )}
    </>
  );
}
function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card info">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
function F({ l, v }: { l: string; v?: string | null }) {
  return (
    <div className="field">
      <small>{l}</small>
      <b>{v || "—"}</b>
    </div>
  );
}
function fmt(v?: string | null) {
  return v ? new Date(v).toLocaleString("es-AR") : "—";
}
function Modal({
  title,
  children,
  onClose,
  onConfirm,
  busy,
  danger,
  disabled,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  busy: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="modal-bg">
      <div className="modal">
        <button className="close" onClick={onClose}>
          <X />
        </button>
        <h3>{title}</h3>
        {children}
        <div className="modal-actions">
          <button onClick={onClose} disabled={busy}>
            Cancelar
          </button>
          <button
            className={danger ? "reject" : "approve"}
            onClick={onConfirm}
            disabled={busy || disabled}
          >
            {busy ? "Procesando…" : danger ? "Rechazar" : "Aprobar"}
          </button>
        </div>
      </div>
    </div>
  );
}
