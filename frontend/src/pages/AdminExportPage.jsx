import { useState } from "react";
import { apiClient } from "../api/client";
import { APPLICATION_STATUS_OPTIONS } from "../utils/status";

function downloadBlob(blob, fileName) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
}

export function AdminExportPage() {
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleExport(type) {
    setMessage("");
    setError("");

    try {
      const blob =
        type === "applications"
          ? await apiClient.exportAdminApplications(filters)
          : await apiClient.exportAdminCandidates(filters);

      downloadBlob(blob, type === "applications" ? "applications.csv" : "candidates.csv");
      setMessage("Đã xuất tệp CSV thành công.");
    } catch (exportError) {
      setError(exportError.message);
    }
  }

  return (
    <div className="portal-page">
      <section className="portal-page-header">
        <h1 className="portal-page-title">Xuất dữ liệu</h1>
        <p className="portal-page-subtitle">
          Lọc dữ liệu trước khi xuất danh sách hồ sơ hoặc thí sinh ra tệp CSV.
        </p>
      </section>

      <section className="portal-card">
        <div className="portal-card-title">Bộ lọc xuất dữ liệu</div>
        {message ? <div className="portal-success">{message}</div> : null}
        {error ? <div className="portal-error">{error}</div> : null}

        <div className="filter-grid">
          <label className="portal-field">
            <span>Tìm kiếm</span>
            <input
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              placeholder="Theo mã, tên, CCCD..."
            />
          </label>
          <label className="portal-field">
            <span>Trạng thái hồ sơ</span>
            <select
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="">Tất cả</option>
              {APPLICATION_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="export-actions">
          <button className="form-submit" type="button" onClick={() => handleExport("applications")}>
            Xuất danh sách hồ sơ
          </button>
          <button className="form-submit secondary" type="button" onClick={() => handleExport("candidates")}>
            Xuất danh sách thí sinh
          </button>
        </div>
      </section>
    </div>
  );
}
