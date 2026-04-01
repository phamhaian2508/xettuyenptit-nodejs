import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { getApplicationStatusLabel } from "../utils/status";

export function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.getAdminDashboardSummary();
        if (mounted) {
          setSummary(response.data);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="portal-empty">Đang tải trang tổng quan...</div>;
  }

  if (error) {
    return <div className="portal-error">{error}</div>;
  }

  return (
    <div className="portal-page">
      <section className="portal-page-header">
        <h1 className="portal-page-title">Tổng quan quản trị</h1>
        <p className="portal-page-subtitle">
          Theo dõi nhanh số lượng hồ sơ, thí sinh và trạng thái xử lý gần nhất.
        </p>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Tổng hồ sơ</div>
          <div className="stat-value">{summary?.totalApplications || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tổng thí sinh</div>
          <div className="stat-value">{summary?.totalCandidates || 0}</div>
        </div>
        {(summary?.statuses || []).map((item) => (
          <div className="stat-card" key={item.status}>
            <div className="stat-label">{getApplicationStatusLabel(item.status)}</div>
            <div className="stat-value">{item.total}</div>
          </div>
        ))}
      </div>

      <section className="portal-card">
        <div className="portal-card-head">
          <div className="portal-card-title">Hồ sơ cập nhật gần đây</div>
          <Link to="/admin/applications" className="text-link">
            Xem tất cả
          </Link>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã hồ sơ</th>
                <th>Thí sinh</th>
                <th>Ngành</th>
                <th>Điểm</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(summary?.recentApplications || []).map((item) => (
                <tr key={item.id}>
                  <td>{item.applicationCode}</td>
                  <td>
                    {item.fullName}
                    <div className="cell-sub">{item.candidateCode}</div>
                  </td>
                  <td>
                    {item.majorName}
                    {item.specializationName ? ` / ${item.specializationName}` : ""}
                  </td>
                  <td>{item.applicationScore}</td>
                  <td>
                    <span className={`status-pill ${item.status.toLowerCase()}`}>
                      {getApplicationStatusLabel(item.status)}
                    </span>
                  </td>
                  <td>
                    <Link className="text-link" to={`/admin/applications/${item.id}`}>
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
