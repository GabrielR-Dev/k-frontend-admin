import { useState, type FormEvent } from "react";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiMessage } from "../services/api";
export function Login() {
  const { login } = useAuth(),
    nav = useNavigate();
  const [e, setE] = useState("admin@kiago.com"),
    [p, setP] = useState(""),
    [err, setErr] = useState(""),
    [busy, setBusy] = useState(false);
  const submit = async (x: FormEvent) => {
    x.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(e, p);
      nav("/admin/pending", { replace: true });
    } catch (z) {
      setErr(
        z instanceof Error
          ? z.message
          : apiMessage(z, "No se pudo iniciar sesión."),
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="login">
      <div className="hero">
        <b className="hero-k">K</b>
        <small>KIAGO / ADMIN</small>
        <h1>Controlá la calidad de cada lugar publicado.</h1>
        <p>
          Revisá y autorizá establecimientos antes de que sean visibles para los
          usuarios.
        </p>
        <div className="secure">
          <ShieldCheck size={18} /> Acceso exclusivo para administradores
        </div>
      </div>
      <form className="login-form" onSubmit={submit}>
        <small>BIENVENIDO</small>
        <h2>Iniciar sesión</h2>
        <p>Ingresá con tu cuenta de administrador.</p>
        {err && <div className="error">{err}</div>}
        <label>
          Email
          <input
            type="email"
            value={e}
            onChange={(x) => setE(x.target.value)}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={p}
            onChange={(x) => setP(x.target.value)}
            required
          />
        </label>
        <button disabled={busy}>
          {busy ? "Ingresando…" : "Ingresar al panel"}
        </button>
        <a
          href="#"
          onClick={(x) => {
            x.preventDefault();
            setErr(
              "La recuperación de contraseña requiere un endpoint de la API.",
            );
          }}
        >
          ¿Olvidaste tu contraseña?
        </a>
      </form>
    </div>
  );
}
