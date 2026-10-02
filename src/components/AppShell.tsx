import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
export function AppShell() {
  const { user, logout } = useAuth(),
    nav = useNavigate();
  const links = [
    ["/admin/pending", "Pendientes", ClipboardList],
    ["/admin/places", "Todos los lugares", CheckCircle2],
    ["/admin/users", "Usuarios", Users],
    ["/admin/analytics", "Estadísticas", BarChart3],
    ["/admin/quality", "Control de calidad", ShieldCheck],
  ] as const;
  return (
    <div className="shell">
      <aside>
        <div className="logo">
          <b>K</b>
          <div>
            <strong>KIAGO</strong>
            <small>Administración</small>
          </div>
        </div>
        <nav>
          {links.map(([to, label, I]) => (
            <NavLink key={to} to={to}>
              <I size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="aside-bottom">
          <div className="user">
            <span>{(user?.name?.[0] || "A").toUpperCase()}</span>
            <div>
              <b>
                {user?.name} {user?.last_name || user?.lastName}
              </b>
              <small>{user?.email}</small>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              nav("/login");
            }}
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main>
        <header>
          <div>
            <small>PANEL DE ADMINISTRACIÓN</small>
            <h1>Kiago</h1>
          </div>
          <span className="admin-pill">ADMIN</span>
        </header>
        <section>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
