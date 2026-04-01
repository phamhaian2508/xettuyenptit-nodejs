import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { APPLICATION_STATUS_OPTIONS, getApplicationStatusLabel } from "../utils/status";

const initialFilters = {
  search: "",
  status: "",
  page: 1,
  pageSize: 10
};

export function AdminApplicationsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [result, setResult] = useState({
    items: [],
    pagination: { page: 1, pageSize: 10, total: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.getAdminApplications(filters);
        if (mounted) {
          setResult(response.data);
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
  }, [filters]);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }

  return (
    <div className="portal-page">
      <section className="portal-page-header">
        <h1 className="portal-page-title">Quản lý hồ sơ</h1>
        <p className="portal-page-subtitle">
          Tìm kiếm, lọc và theo dõi toàn bộ hồ sơ xét tuyển trong hệ thống.
        </p>
      </section>

      <section className="portal-card">
        <div className="filter-grid">
          <label className="portal-field">
            <span>Tìm kiếm</span>
            <input
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Mã hồ sơ, họ tên, CCCD..."
            />
          </label>
          <label className="portal-field">
            <span>Trạng thái</span>
            <select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
              <option value="">Tất cả</option>
              {APPLICATION_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? <div className="portal-empty-inline">Đang tải danh sách hồ sơ...</div> : null}
        {error ? <div className="portal-error">{error}</div> : null}

        {!loading && !error ? (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã hồ sơ</th>
                    <th>Thí sinh</th>
                    <th>CCCD</th>
                    <th>Ngành</th>
                    <th>Đợt tuyển sinh</th>
                    <th>Trạng thái</th>
                    <th>Điểm</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {result.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.applicationCode}</td>
                      <td>
                        {item.fullName}
                        <div className="cell-sub">{item.candidateCode}</div>
                      </td>
                      <td>{item.identityNumber}</td>
                      <td>
                        {item.majorName}
                        {item.specializationName ? ` / ${item.specializationName}` : ""}
                      </td>
                      <td>{item.admissionPeriodName}</td>
                      <td>
                        <span className={`status-pill ${item.status.toLowerCase()}`}>
                          {getApplicationStatusLabel(item.status)}
                        </span>
                      </td>
                      <td>{item.applicationScore}</td>
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
            <div className="pager">
              <button
                type="button"
                disabled={filters.page <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
              >
                Trước
              </button>
              <span>
                Trang {result.pagination.page} /{" "}
                {Math.max(Math.ceil(result.pagination.total / result.pagination.pageSize), 1)}
              </span>
              <button
                type="button"
                disabled={result.pagination.page * result.pagination.pageSize >= result.pagination.total}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
              >
                Sau
              </button>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
