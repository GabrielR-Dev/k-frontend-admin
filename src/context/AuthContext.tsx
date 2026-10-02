import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authService } from "../services/auth.service";
import type { User } from "../types";
const C = createContext<{
  user: User | null;
  loading: boolean;
  login: (e: string, p: string) => Promise<void>;
  logout: () => void;
} | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null),
    [loading, setLoading] = useState(true);
  const logout = () => {
    localStorage.removeItem("kiago_admin_token");
    setUser(null);
  };
  useEffect(() => {
    const f = () => setUser(null);
    window.addEventListener("kiago:logout", f);
    if (!localStorage.getItem("kiago_admin_token")) {
      setLoading(false);
      return () => window.removeEventListener("kiago:logout", f);
    }
    authService
      .me()
      .then((u) => (u.role === "ADMIN" ? setUser(u) : logout()))
      .catch(logout)
      .finally(() => setLoading(false));
    return () => window.removeEventListener("kiago:logout", f);
  }, []);
  const login = async (e: string, p: string) => {
    const x = await authService.login(e, p);
    if (x.user.role !== "ADMIN") {
      localStorage.removeItem("kiago_admin_token");
      throw new Error("Tu usuario no tiene permisos de administrador.");
    }
    setUser(x.user);
  };
  return (
    <C.Provider value={{ user, loading, login, logout }}>{children}</C.Provider>
  );
}
export const useAuth = () => {
  const x = useContext(C);
  if (!x) throw Error("AuthProvider requerido");
  return x;
};
