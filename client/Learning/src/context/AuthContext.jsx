import React, { createContext, useEffect, useMemo, useState } from "react";
import { apiRequest, clearAuthToken, setAuthToken } from "../config/api.js";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }
    apiRequest("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => clearAuthToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password, remember = true) => {
    const res = await apiRequest("/auth/login", { method: "POST", body: { email, password } });
    setAuthToken(res.data.token, remember);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password, remember = true) => {
    const res = await apiRequest("/auth/register", { method: "POST", body: { name, email, password } });
    setAuthToken(res.data.token, remember);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


