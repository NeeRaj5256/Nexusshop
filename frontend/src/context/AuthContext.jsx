import { createContext, useContext, useState } from "react";
import { apiLogin, apiRegister } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nexus_user")) || null; }
    catch { return null; }
  });

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem("nexus_token", data.token);
    const u = { _id: data._id, name: data.name, email: data.email, role: data.role };
    localStorage.setItem("nexus_user", JSON.stringify(u));
    setUser(u);
  };

  const register = async (name, email, password) => {
    const data = await apiRegister(name, email, password);
    localStorage.setItem("nexus_token", data.token);
    const u = { _id: data._id, name: data.name, email: data.email, role: data.role };
    localStorage.setItem("nexus_user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("nexus_token");
    localStorage.removeItem("nexus_user");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
