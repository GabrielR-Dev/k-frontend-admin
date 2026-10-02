import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="center">Cargando…</div>;
  return user?.role === "ADMIN" ? <Outlet /> : <Navigate to="/login" replace />;
}
