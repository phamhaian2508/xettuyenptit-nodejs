import { createContext, useEffect, useState } from "react";
import { apiClient } from "../api/client";

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  refreshUser: async () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const token = localStorage.getItem("ptit_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.me();
      setUser(response.data);
    } catch (_error) {
      localStorage.removeItem("ptit_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(payload) {
    const response = await apiClient.login(payload);
    localStorage.setItem("ptit_token", response.data.token);
    setUser(response.data.user);
    return response.data.user;
  }

  function logout() {
    localStorage.removeItem("ptit_token");
    setUser(null);
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
