const API_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("ptit_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Yeu cau that bai");
  }

  return data;
}

export const apiClient = {
  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  me() {
    return request("/auth/me");
  },
  getProfile() {
    return request("/account/profile");
  },
  updateProfile(payload) {
    return request("/account/profile", {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },
  updatePassword(payload) {
    return request("/account/password", {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  }
};
