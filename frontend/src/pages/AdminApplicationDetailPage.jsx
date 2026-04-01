import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { APPLICATION_STATUS_OPTIONS, getApplicationStatusLabel } from "../utils/status";

export function AdminApplicationDetailPage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: "", note: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.getAdminApplicationDetail(id);
        if (mounted) {
          setApplication(response.data);
          setStatusForm({
            status: response.data.status,
            note: response.data.note || ""
          });
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
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await apiClient.updateAdminApplicationStatus(id, statusForm);
      setApplication(response.data);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="portal-empty">Đang tải chi tiết hồ sơ...</div>;
  }

  if (error && !application) {
    return <div className="portal-error">{error}</div>;
  }

  return (
    <div className="portal-page">
      <section className="portal-page-header">
        <h1 className="portal-page-title">Chi tiết hồ sơ</h1>
        <p className="portal-page-subtitle">
          Kiểm tra thông tin hồ sơ và cập nhật trạng thái xử lý khi cần.
        </p>
      </section>

      <Link to="/admin/applications" className="text-link">
        ← Quay lại danh sách hồ sơ
      </Link>

      <div className="detail-grid">
        <section className="portal-card">
          <div className="portal-card-title">Thông tin hồ sơ</div>
          <div className="detail-list">
            <div>
              <strong>Mã hồ sơ:</strong> {application.applicationCode}
            </div>
            <div>
              <strong>Thí sinh:</strong> {application.fullName} ({application.candidateCode})
            </div>
            <div>
              <strong>CCCD:</strong> {application.identityNumber}
            </div>
            <div>
              <strong>Đợt tuyển sinh:</strong> {application.admissionPeriodName}
            </div>
            <div>
              <strong>Ngành:</strong> {application.majorName}
              {application.specializationName ? ` / ${application.specializationName}` : ""}
            </div>
            <div>
              <strong>Tổ hợp:</strong> {application.combinationCode}
            </div>
            <div>
              <strong>Điểm:</strong> {application.applicationScore}
            </div>
            <div>
              <strong>Trạng thái:</strong> {getApplicationStatusLabel(application.status)}
            </div>
            <div>
              <strong>Địa chỉ:</strong>{" "}
              {[
                application.permanentAddress,
                application.permanentWardName,
                application.permanentDistrictName,
                application.permanentProvinceName
              ]
                .filter(Boolean)
                .join(", ")}
            </div>
          </div>
        </section>

        <section className="portal-card">
          <div className="portal-card-title">Cập nhật trạng thái</div>
          {error ? <div className="portal-error">{error}</div> : null}
          <form className="profile-form" onSubmit={handleSubmit}>
            <label className="portal-field">
              <span>Trạng thái</span>
              <select
                value={statusForm.status}
                onChange={(event) => setStatusForm((prev) => ({ ...prev, status: event.target.value }))}
              >
                {APPLICATION_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="portal-field">
              <span>Ghi chú</span>
              <textarea
                value={statusForm.note}
                onChange={(event) => setStatusForm((prev) => ({ ...prev, note: event.target.value }))}
              />
            </label>
            <button className="form-submit" type="submit" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </section>
      </div>

      <section className="portal-card">
        <div className="portal-card-title">Lịch sử thao tác</div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Hành động</th>
                <th>Dữ liệu</th>
              </tr>
            </thead>
            <tbody>
              {(application.logs || []).map((item) => (
                <tr key={item.id}>
                  <td>{String(item.createdAt).replace("T", " ").slice(0, 19)}</td>
                  <td>{item.actionName}</td>
                  <td>{item.metadataJson || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
