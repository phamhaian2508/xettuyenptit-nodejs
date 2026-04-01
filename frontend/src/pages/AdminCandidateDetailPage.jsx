import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { getAccountStatusLabel, getApplicationStatusLabel } from "../utils/status";

export function AdminCandidateDetailPage() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.getAdminCandidateDetail(id);
        if (mounted) {
          setCandidate(response.data);
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

  if (loading) {
    return <div className="portal-empty">Đang tải thông tin thí sinh...</div>;
  }

  if (error) {
    return <div className="portal-error">{error}</div>;
  }

  return (
    <div className="portal-page">
      <section className="portal-page-header">
        <h1 className="portal-page-title">Chi tiết thí sinh</h1>
        <p className="portal-page-subtitle">
          Xem hồ sơ cá nhân, tình trạng tài khoản và lịch sử nộp hồ sơ của thí sinh.
        </p>
      </section>

      <Link to="/admin/candidates" className="text-link">
        ← Quay lại danh sách thí sinh
      </Link>

      <div className="detail-grid">
        <section className="portal-card">
          <div className="portal-card-title">Thông tin thí sinh</div>
          <div className="detail-list">
            <div>
              <strong>Mã thí sinh:</strong> {candidate.candidateCode}
            </div>
            <div>
              <strong>Họ tên:</strong> {candidate.fullName}
            </div>
            <div>
              <strong>Tên đăng nhập:</strong> {candidate.username}
            </div>
            <div>
              <strong>Email:</strong> {candidate.email}
            </div>
            <div>
              <strong>Số điện thoại:</strong> {candidate.phone}
            </div>
            <div>
              <strong>CCCD:</strong> {candidate.identityNumber}
            </div>
            <div>
              <strong>Ngày sinh:</strong> {String(candidate.dateOfBirth || "").slice(0, 10)}
            </div>
            <div>
              <strong>Địa chỉ:</strong>{" "}
              {[
                candidate.permanentAddress,
                candidate.permanentWardName,
                candidate.permanentDistrictName,
                candidate.permanentProvinceName
              ]
                .filter(Boolean)
                .join(", ")}
            </div>
            <div>
              <strong>Trường THPT:</strong> {candidate.highSchoolName}
            </div>
          </div>
        </section>

        <section className="portal-card">
          <div className="portal-card-title">Tổng quan</div>
          <div className="detail-list">
            <div>
              <strong>Trạng thái tài khoản:</strong> {getAccountStatusLabel(candidate.accountStatus)}
            </div>
            <div>
              <strong>Năm tốt nghiệp:</strong> {candidate.graduationYear}
            </div>
            <div>
              <strong>Ghi chú:</strong> {candidate.note || "-"}
            </div>
            <div>
              <strong>Số hồ sơ:</strong> {(candidate.applications || []).length}
            </div>
          </div>
        </section>
      </div>

      <section className="portal-card">
        <div className="portal-card-title">Lịch sử hồ sơ</div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã hồ sơ</th>
                <th>Ngành</th>
                <th>Đợt tuyển sinh</th>
                <th>Trạng thái</th>
                <th>Điểm</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(candidate.applications || []).map((item) => (
                <tr key={item.id}>
                  <td>{item.applicationCode}</td>
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
                      Xem hồ sơ
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
