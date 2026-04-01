import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { APPLICATION_STATUS_OPTIONS } from "../utils/status";

const initialFilters = {
  search: "",
  status: "",
  page: 1,
  pageSize: 10
};

export function AdminCandidatesPage() {
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
        const response = await apiClient.getAdminCandidates(filters);
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

  return (
    <div className="portal-page">
      <section className="portal-page-header">
        <h1 className="portal-page-title">Quản lý thí sinh</h1>
        <p className="portal-page-subtitle">
          Tra cứu thông tin thí sinh và theo dõi số lượng hồ sơ đã nộp.
        </p>
      </section>

      <section className="portal-card">
        <div className="filter-grid">
          <label className="portal-field">
            <span>Tìm kiếm</span>
            <input
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))
              }
              placeholder="Mã thí sinh, họ tên, CCCD..."
            />
          </label>
          <label className="portal-field">
            <span>Trạng thái hồ sơ</span>
            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, status: event.target.value, page: 1 }))
              }
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

        {loading ? <div className="portal-empty-inline">Đang tải danh sách thí sinh...</div> : null}
        {error ? <div className="portal-error">{error}</div> : null}

        {!loading && !error ? (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã thí sinh</th>
                    <th>Họ tên</th>
                    <th>CCCD</th>
                    <th>Email</th>
                    <th>Số hồ sơ</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {result.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.candidateCode}</td>
                      <td>{item.fullName}</td>
                      <td>{item.identityNumber}</td>
                      <td>{item.email}</td>
                      <td>{item.applicationCount}</td>
                      <td>
                        <Link className="text-link" to={`/admin/candidates/${item.id}`}>
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
