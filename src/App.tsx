import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppShell } from "./components/AppShell";
import { Login } from "./pages/Login";
import { Pending } from "./pages/Pending";
import { Places } from "./pages/Places";
import { PlaceDetail } from "./pages/PlaceDetail";
import { Users } from "./pages/Users";
import { Analytics } from "./pages/Analytics";
import { Quality } from "./pages/Quality";
import "./styles.css";
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route
              path="/admin"
              element={<Navigate to="/admin/pending" replace />}
            />
            <Route path="/admin/pending" element={<Pending />} />
            <Route path="/admin/places" element={<Places />} />
            <Route path="/admin/places/:id" element={<PlaceDetail />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/quality" element={<Quality />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}
