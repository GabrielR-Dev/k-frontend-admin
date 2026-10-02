import api, { unwrap } from "./api";
import type { LoginResponse, User } from "../types";
export const authService = {
  async login(email: string, password: string) {
    const r = await api.post("/api/auth/login", { email, password });
    const x = unwrap<LoginResponse>(r);
    if (!x?.token || !x.user) throw new Error("Respuesta de login inválida.");
    localStorage.setItem("kiago_admin_token", x.token);
    return x;
  },
  async me() {
    return unwrap<User>(await api.get("/api/auth/me"));
  },
};
