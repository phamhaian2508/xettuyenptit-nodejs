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
    try {
      const response = await apiClient.me();
      setUser(response.data);
    } catch (_error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(payload) {
    const response = await apiClient.login(payload);
    setUser(response.data.user);
    return response.data.user;
  }

  async function logout() {
    try {
      await apiClient.logout();
    } catch (_error) {
      // Ignore logout transport errors and clear local state anyway.
    }
    setUser(null);
  }

  useEffect(() => {
    localStorage.removeItem("ptit_token");
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
