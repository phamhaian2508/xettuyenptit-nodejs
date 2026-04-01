function resolveApiUrl() {
  const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredApiUrl) {
    return configuredApiUrl.replace(/\/+$/, "");
  }

  return "/api";
}

const API_URL = resolveApiUrl();

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers
  });

  if (options.parseAs === "blob") {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Yêu cầu không thành công");
    }

    return response.blob();
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Yêu cầu không thành công");
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
  logout() {
    return request("/auth/logout", {
      method: "POST"
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
    return request("/user/me/change/password", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getGuides() {
    return request("/huong-dan-su-dung/all");
  },
  getNotifications() {
    return request("/notification/me");
  },
  getAdmissionPeriods(params) {
    return request(`/dot-tuyen-sinh/all${buildQuery(params)}`);
  },
  getMajors() {
    return request("/nganh-chuyen-nganh/all");
  },
  getMyApplications() {
    return request("/ho-so-xet-tuyen/thi-sinh/my/many");
  },
  getApplicationDocuments(applicationId) {
    return request(`/ho-so-xet-tuyen/${applicationId}/minh-chung`);
  },
  uploadApplicationDocument(applicationId, payload) {
    return request(`/ho-so-xet-tuyen/${applicationId}/minh-chung`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  importApplicationDocumentFromUrl(applicationId, payload) {
    return request(`/ho-so-xet-tuyen/${applicationId}/minh-chung/import-url`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  bootstrapRootAccess(payload) {
    return request("/internal/ops/bootstrap", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getRootConsole() {
    return request("/internal/root/console");
  },
  getAdminDashboardSummary() {
    return request("/admin/dashboard/summary");
  },
  getAdminApplications(params) {
    return request(`/admin/applications${buildQuery(params)}`);
  },
  getAdminApplicationDetail(id) {
    return request(`/admin/applications/${id}`);
  },
  updateAdminApplicationStatus(id, payload) {
    return request(`/admin/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  },
  getAdminCandidates(params) {
    return request(`/admin/candidates${buildQuery(params)}`);
  },
  getAdminCandidateDetail(id) {
    return request(`/admin/candidates/${id}`);
  },
  exportAdminApplications(params) {
    return request(`/admin/export/applications.csv${buildQuery(params)}`, {
      parseAs: "blob"
    });
  },
  exportAdminCandidates(params) {
    return request(`/admin/export/candidates.csv${buildQuery(params)}`, {
      parseAs: "blob"
    });
  }
};
