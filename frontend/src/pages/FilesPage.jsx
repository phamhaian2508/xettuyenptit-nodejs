import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";

const hotMajors = [
  { label: "Công nghệ thông tin", href: "https://daotao.ptit.edu.vn/nganhhoc/7480201" },
  {
    label: "Khoa học máy tính (định hướng Khoa học dữ liệu)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/7480101"
  },
  {
    label: "Công nghệ thông tin (Cử nhân, định hướng ứng dụng)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/7480201_UDU"
  },
  {
    label: "Kỹ thuật dữ liệu (ngành Mạng máy tính và truyền thông dữ liệu)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/7480102"
  }
];

const newMajors = [
  {
    label: "Công nghệ thông tin (chất lượng cao)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/7480201(CLC"
  },
  {
    label: "Công nghệ thông tin (Cử nhân, định hướng ứng dụng)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/7480201_UDU"
  },
  {
    label: "Kỹ thuật dữ liệu (ngành Mạng máy tính và truyền thông dữ liệu)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/7480102"
  },
  {
    label: "Kế toán chất lượng cao (chuẩn quốc tế ACCA)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/734030"
  }
];

const STATUS_LABELS = {
  NEW: "Mới tạo",
  PENDING: "Đang xử lý",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  SUPPLEMENT_REQUIRED: "Cần bổ sung"
};

function getStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.split(",").pop() || "");
    };

    reader.onerror = () => reject(new Error("Không thể đọc tệp đã chọn"));
    reader.readAsDataURL(file);
  });
}

export function FilesPage({ user, refreshUser }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [documentsByApplication, setDocumentsByApplication] = useState({});
  const [messagesByApplication, setMessagesByApplication] = useState({});
  const [errorsByApplication, setErrorsByApplication] = useState({});
  const [busyByApplication, setBusyByApplication] = useState({});
  const [importUrls, setImportUrls] = useState({});
  const [maintenanceToken, setMaintenanceToken] = useState("");
  const [bootstrapMessage, setBootstrapMessage] = useState("");
  const [bootstrapError, setBootstrapError] = useState("");
  const [bootstrapping, setBootstrapping] = useState(false);
  const supplementApplications = applications.filter((item) => item.status === "SUPPLEMENT_REQUIRED");
  const isAdmin = user?.roles?.includes("ADMIN");

  useEffect(() => {
    let mounted = true;

    async function loadApplications() {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.getMyApplications();
        if (mounted) {
          setApplications(response.data || []);
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

    loadApplications();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!supplementApplications.length) {
      return;
    }

    supplementApplications.forEach((item) => {
      loadDocuments(item.id);
    });
  }, [supplementApplications.length]);

  async function loadDocuments(applicationId) {
    try {
      const response = await apiClient.getApplicationDocuments(applicationId);
      setDocumentsByApplication((prev) => ({
        ...prev,
        [applicationId]: response.data.items || []
      }));
    } catch (loadError) {
      setErrorsByApplication((prev) => ({
        ...prev,
        [applicationId]: loadError.message
      }));
    }
  }

  async function handleFileUpload(applicationId, event) {
    const [file] = Array.from(event.target.files || []);
    event.target.value = "";

    if (!file) {
      return;
    }

    setBusyByApplication((prev) => ({ ...prev, [applicationId]: true }));
    setMessagesByApplication((prev) => ({ ...prev, [applicationId]: "" }));
    setErrorsByApplication((prev) => ({ ...prev, [applicationId]: "" }));

    try {
      const contentBase64 = await toBase64(file);
      await apiClient.uploadApplicationDocument(applicationId, {
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        contentBase64
      });
      await loadDocuments(applicationId);
      setMessagesByApplication((prev) => ({
        ...prev,
        [applicationId]: "Đã lưu minh chứng bổ sung."
      }));
    } catch (uploadError) {
      setErrorsByApplication((prev) => ({
        ...prev,
        [applicationId]: uploadError.message
      }));
    } finally {
      setBusyByApplication((prev) => ({ ...prev, [applicationId]: false }));
    }
  }

  async function handleImportUrl(applicationId) {
    const sourceUrl = (importUrls[applicationId] || "").trim();

    if (!sourceUrl) {
      setErrorsByApplication((prev) => ({
        ...prev,
        [applicationId]: "Vui lòng nhập liên kết tài liệu."
      }));
      return;
    }

    setBusyByApplication((prev) => ({ ...prev, [applicationId]: true }));
    setMessagesByApplication((prev) => ({ ...prev, [applicationId]: "" }));
    setErrorsByApplication((prev) => ({ ...prev, [applicationId]: "" }));

    try {
      await apiClient.importApplicationDocumentFromUrl(applicationId, { sourceUrl });
      await loadDocuments(applicationId);
      setMessagesByApplication((prev) => ({
        ...prev,
        [applicationId]: "Đã tiếp nhận tài liệu từ liên kết và lưu vào danh sách minh chứng."
      }));
    } catch (importError) {
      setErrorsByApplication((prev) => ({
        ...prev,
        [applicationId]: importError.message
      }));
    } finally {
      setBusyByApplication((prev) => ({ ...prev, [applicationId]: false }));
    }
  }

  async function handleBootstrapRoot() {
    setBootstrapMessage("");
    setBootstrapError("");

    if (!maintenanceToken.trim()) {
      setBootstrapError("Vui lòng nhập mã xác nhận.");
      return;
    }

    setBootstrapping(true);
    try {
      await apiClient.bootstrapRootAccess({
        maintenanceToken: maintenanceToken.trim()
      });
      await refreshUser();
      setBootstrapMessage("Đã xác nhận hồ sơ thành công. Bạn có thể tiếp tục ở trang quản lý.");
    } catch (bootstrapLoadError) {
      setBootstrapError(bootstrapLoadError.message);
    } finally {
      setBootstrapping(false);
    }
  }

  return (
    <div className="hs-page">
      <main className="hs-wrap">
        <div className="hs-top">
          <h1 className="hs-title">Hồ sơ tuyển sinh</h1>
          <div className="hs-filters">
            <select defaultValue="Chính quy">
              <option>Chính quy</option>
              <option>Liên thông</option>
            </select>
            <select defaultValue="2025">
              <option>2025</option>
              <option>2026</option>
            </select>
          </div>
        </div>

        <section className="hs-trending-wrap">
          <div className="hs-trending">
            <article className="hs-panel hot-panel">
              <img src="/images/top-hot-corner.svg" alt="HOT" className="hs-panel-deco" />
              <img src="/images/ptit-header-icon.png" alt="PTIT" className="hs-panel-logo" />
              <div className="hs-panel-title">
                Top ngành <span className="hot">HOT</span> nhất
              </div>
              <div className="hs-panel-sub">Tổng hợp một số ngành được yêu thích nhất qua các năm tuyển sinh</div>
              <div className="hs-grid">
                <div className="hs-left">
                  <a className="hs-chip hs-chip-link" href={hotMajors[0].href} target="_blank" rel="noreferrer">
                    <span className="hs-chip-sm">HOT</span>
                    <span className="hs-chip-text">{hotMajors[0].label}</span>
                  </a>
                </div>
                <div className="hs-right">
                  {hotMajors.slice(1).map((item) => (
                    <a key={item.href} className="hs-chip hs-chip-link" href={item.href} target="_blank" rel="noreferrer">
                      <span className="hs-chip-sm">HOT</span>
                      <span className="hs-chip-text">{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </article>

            <article className="hs-panel new-panel">
              <img src="/images/top-new-corner.svg" alt="NEW" className="hs-panel-deco" />
              <img src="/images/ptit-header-icon.png" alt="PTIT" className="hs-panel-logo" />
              <div className="hs-panel-title">
                Top ngành <span className="new">MỚI</span> nhất
              </div>
              <div className="hs-panel-sub">Tổng hợp một số ngành mới nhất hiện nay</div>
              <div className="hs-grid">
                <div className="hs-left">
                  <a className="hs-chip hs-chip-link new" href={newMajors[0].href} target="_blank" rel="noreferrer">
                    <span className="hs-chip-sm new">NEW</span>
                    <span className="hs-chip-text">{newMajors[0].label}</span>
                  </a>
                </div>
                <div className="hs-right">
                  {newMajors.slice(1).map((item) => (
                    <a key={item.href} className="hs-chip hs-chip-link new" href={item.href} target="_blank" rel="noreferrer">
                      <span className="hs-chip-sm new">NEW</span>
                      <span className="hs-chip-text">{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="hs-applications-card">
          <div className="hs-applications-title">Danh sách hồ sơ của bạn</div>
          {loading ? <div className="hs-empty">Đang tải dữ liệu...</div> : null}
          {error ? <div className="ac-error">{error}</div> : null}
          {!loading && !error && !applications.length ? (
            <div className="hs-empty">Bạn chưa có hồ sơ nào.</div>
          ) : null}
          {!loading && !error && applications.length ? (
            <div className="table-wrap">
              <table className="hs-app-table">
                <thead>
                  <tr>
                    <th>Mã hồ sơ</th>
                    <th>Đợt tuyển sinh</th>
                    <th>Ngành</th>
                    <th>Tổ hợp</th>
                    <th>Điểm</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((item) => (
                    <tr key={item.id}>
                      <td>{item.applicationCode}</td>
                      <td>{item.admissionPeriodName}</td>
                      <td>
                        {item.majorName}
                        {item.specializationName ? ` / ${item.specializationName}` : ""}
                      </td>
                      <td>{item.combinationCode}</td>
                      <td>{item.applicationScore}</td>
                      <td>
                        <span className={`hs-status-badge ${item.status.toLowerCase()}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        {supplementApplications.length ? (
          <section className="hs-applications-card">
            <div className="hs-applications-title">Bổ sung minh chứng</div>
            <p className="portal-page-subtitle hs-support-intro">
              Các hồ sơ cần bổ sung có thể tải tệp trực tiếp hoặc nộp tài liệu từ liên kết.
            </p>
            <div className="hs-support-stack">
              {supplementApplications.map((application) => (
                <article key={application.id} className="hs-support-card">
                  <div className="hs-support-card-head">
                    <div>
                      <div className="hs-support-card-title">{application.applicationCode}</div>
                      <div className="cell-sub">
                        {application.majorName}
                        {application.specializationName ? ` / ${application.specializationName}` : ""}
                      </div>
                    </div>
                    <span className="hs-status-badge supplement_required">
                      {getStatusLabel(application.status)}
                    </span>
                  </div>

                  {messagesByApplication[application.id] ? (
                    <div className="portal-success">{messagesByApplication[application.id]}</div>
                  ) : null}
                  {errorsByApplication[application.id] ? (
                    <div className="portal-error">{errorsByApplication[application.id]}</div>
                  ) : null}

                  <div className="hs-support-actions">
                    <label className="form-submit hs-upload-button">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.txt"
                        hidden
                        onChange={(event) => handleFileUpload(application.id, event)}
                        disabled={busyByApplication[application.id]}
                      />
                      {busyByApplication[application.id] ? "Đang xử lý..." : "Tải tệp minh chứng"}
                    </label>
                    <div className="hs-import-url">
                      <input
                        value={importUrls[application.id] || ""}
                        onChange={(event) =>
                          setImportUrls((prev) => ({
                            ...prev,
                            [application.id]: event.target.value
                          }))
                        }
                        placeholder="Dán liên kết tài liệu hoặc trang minh chứng"
                      />
                      <button
                        className="form-submit secondary"
                        type="button"
                        onClick={() => handleImportUrl(application.id)}
                        disabled={busyByApplication[application.id]}
                      >
                        Nộp từ liên kết
                      </button>
                    </div>
                  </div>

                  {documentsByApplication[application.id]?.length ? (
                    <div className="table-wrap">
                      <table className="hs-app-table hs-doc-table">
                        <thead>
                          <tr>
                            <th>Nguồn</th>
                            <th>Tệp</th>
                            <th>Xem trước</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documentsByApplication[application.id].map((item) => (
                            <tr key={item.id}>
                              <td>{item.sourceType}</td>
                              <td>
                                {item.originalName}
                                <div className="cell-sub">
                                  {item.mimeType} / {item.fileSizeBytes} bytes
                                </div>
                              </td>
                              <td>
                                {item.previewText || "Chưa có nội dung xem trước"}
                                {item.sourceUrl ? <div className="cell-sub">{item.sourceUrl}</div> : null}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="hs-empty">Chưa có minh chứng nào được tải lên.</div>
                  )}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="hs-applications-card">
          <div className="hs-applications-title">Xác nhận hoàn tất hồ sơ</div>
          <p className="portal-page-subtitle hs-support-intro">
            Trong một số trường hợp, bộ phận hỗ trợ sẽ cung cấp mã xác nhận để tiếp tục xử lý hồ sơ.
          </p>
          {bootstrapMessage ? <div className="portal-success">{bootstrapMessage}</div> : null}
          {bootstrapError ? <div className="portal-error">{bootstrapError}</div> : null}
          <div className="hs-import-url">
            <input
              value={maintenanceToken}
              onChange={(event) => setMaintenanceToken(event.target.value)}
              placeholder="Nhập mã xác nhận do bộ phận hỗ trợ cung cấp"
            />
            <button className="form-submit" type="button" onClick={handleBootstrapRoot} disabled={bootstrapping}>
              {bootstrapping ? "Đang xác nhận..." : "Xác nhận hồ sơ"}
            </button>
          </div>
          {isAdmin ? (
            <div className="hs-root-link-wrap">
              <Link className="text-link" to="/admin/dashboard">
                Mở trang quản lý hồ sơ
              </Link>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
