import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

export function RootConsolePage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadConsole() {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.getRootConsole();
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

    loadConsole();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="portal-page">
      <section className="portal-page-header">
        <h1 className="portal-page-title">Bảng điều hành hệ thống</h1>
        <p className="portal-page-subtitle">
          Tổng hợp thông tin phục vụ rà soát vận hành và đối soát dữ liệu hệ thống.
        </p>
      </section>

      {loading ? <div className="portal-empty">Đang tải dữ liệu hệ thống...</div> : null}
      {error ? <div className="portal-error">{error}</div> : null}

      {!loading && !error && result ? (
        <>
          <section className="portal-card">
            <div className="portal-card-title">Thông tin phiên làm việc</div>
            <div className="detail-list">
              <div>Mã phiên: {result.consoleId}</div>
              <div>Tài khoản: {result.currentUser.userName}</div>
              <div>Nhóm quyền: {result.currentUser.roles.join(", ")}</div>
            </div>
          </section>

          <section className="portal-card">
            <div className="portal-card-title">Dịch vụ hệ thống</div>
            <div className="detail-list">
              <div>DB Host: {result.services.databaseHost}</div>
              <div>DB Name: {result.services.databaseName}</div>
              <div>Uploads Directory: {result.services.uploadsDirectory}</div>
              <div>Cookie Name: {result.services.cookieName}</div>
            </div>
          </section>

          <section className="portal-card">
            <div className="portal-card-title">Tổng quan dữ liệu</div>
            <div className="stats-grid">
              <article className="stat-card">
                <div className="stat-label">Tổng thí sinh</div>
                <div className="stat-value">{result.summary.totalCandidates}</div>
              </article>
              <article className="stat-card">
                <div className="stat-label">Tổng minh chứng</div>
                <div className="stat-value">{result.summary.totalDocuments}</div>
              </article>
            </div>
          </section>

          <section className="portal-card">
            <div className="portal-card-title">Tệp gần đây</div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tệp</th>
                    <th>Nguồn</th>
                    <th>Thời gian tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {result.recentDocuments.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        {item.originalName}
                        {item.sourceUrl ? <div className="cell-sub">{item.sourceUrl}</div> : null}
                      </td>
                      <td>{item.sourceType}</td>
                      <td>{item.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
