import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiClient } from "../api/client";

function buildInitials(user) {
  const middle = user?.middleName?.trim()?.[0] || "";
  const first = user?.firstName?.trim()?.[0] || "";
  return `${middle}${first}`.toUpperCase() || "PT";
}

export function AccountCenterPage({ user, refreshUser }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "password" ? "password" : "profile";
  const [profile, setProfile] = useState(user);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    setProfile(user);
  }, [user]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Account Center - Xét tuyển PTIT";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const initials = useMemo(() => buildInitials(profile), [profile]);

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setProfileMessage("");
    setPasswordMessage("");
    setErrorMessage("");

    try {
      await apiClient.updateProfile(profile);
      await refreshUser();
      setProfileMessage("Da luu thong tin thanh cong.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setProfileMessage("");
    setPasswordMessage("");
    setErrorMessage("");

    try {
      const response = await apiClient.updatePassword(passwordForm);
      setPasswordMessage(response.message);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="ac-page">
      <main className="ac-wrap">
        <div className="ac-grid">
          <aside className="ac-card ac-left">
            <div className="ac-avatar">{initials}</div>
            <div className="ac-name">{profile?.firstName || profile?.fullName}</div>
            <div className="ac-email">{profile?.email || "Chưa cập nhật email"}</div>
            <div className="ac-meta">
              <p>Thí sinh</p>
              <p>{profile?.firstName || "Chưa cập nhật tên"}</p>
              <p>{profile?.dateOfBirth || "Chưa cập nhật ngày sinh"}</p>
              <p>{profile?.gender || "Chưa cập nhật giới tính"}</p>
              <p>{profile?.email || "Chưa cập nhật email"}</p>
            </div>
          </aside>

          <section className="ac-card ac-right">
            <div className="tabs">
              <button
                className={activeTab === "profile" ? "tab active" : "tab"}
                onClick={() => setSearchParams({})}
                type="button"
              >
                Thông tin cá nhân
              </button>
              <button
                className={activeTab === "password" ? "tab active" : "tab"}
                onClick={() => setSearchParams({ tab: "password" })}
                type="button"
              >
                Đổi mật khẩu
              </button>
            </div>
            <div className="ac-form">
              {profileMessage ? <div className="ac-success">{profileMessage}</div> : null}
              {passwordMessage ? <div className="ac-success">{passwordMessage}</div> : null}
              {errorMessage ? <div className="ac-error">{errorMessage}</div> : null}

              {activeTab === "password" ? (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="ac-field">
                    <label>Mật khẩu cũ</label>
                    <input
                      className="ac-input"
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={(event) =>
                        setPasswordForm((prev) => ({ ...prev, oldPassword: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="ac-field">
                    <label>Mật khẩu mới</label>
                    <input
                      className="ac-input"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(event) =>
                        setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="ac-field">
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                      className="ac-input"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(event) =>
                        setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="ac-save-wrap">
                    <button className="ac-save" type="submit">Lưu</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleProfileSubmit}>
                  <div className="ac-row">
                    <div className="ac-field">
                      <label>Số CMND/CCCD hoặc hộ chiếu</label>
                      <input
                        className="ac-input"
                        value={profile?.identityNumber || ""}
                        onChange={(event) => setProfile((prev) => ({ ...prev, identityNumber: event.target.value }))}
                      />
                    </div>
                    <div className="ac-field">
                      <label>Ngày cấp</label>
                      <input
                        className="ac-input"
                        value={profile?.identityIssueDate || ""}
                        onChange={(event) => setProfile((prev) => ({ ...prev, identityIssueDate: event.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="ac-field">
                    <label>Nơi cấp</label>
                    <textarea
                      className="ac-textarea"
                      value={profile?.identityIssuePlace || ""}
                      onChange={(event) => setProfile((prev) => ({ ...prev, identityIssuePlace: event.target.value }))}
                    />
                  </div>

                  <div className="ac-row">
                    <div className="ac-field">
                      <label>Họ đệm</label>
                      <input
                        className="ac-input"
                        value={profile?.middleName || ""}
                        onChange={(event) => setProfile((prev) => ({ ...prev, middleName: event.target.value }))}
                      />
                    </div>
                    <div className="ac-field">
                      <label>Tên</label>
                      <input
                        className="ac-input"
                        value={profile?.firstName || ""}
                        onChange={(event) => setProfile((prev) => ({ ...prev, firstName: event.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="ac-field">
                    <label>Hộ khẩu thường trú</label>
                    <div className="ac-row">
                      <div className="ac-field">
                        <input
                          className="ac-input"
                          value={profile?.permanentProvince || ""}
                          onChange={(event) => setProfile((prev) => ({ ...prev, permanentProvince: event.target.value }))}
                        />
                      </div>
                      <div className="ac-field">
                        <input
                          className="ac-input"
                          value={profile?.permanentDistrict || ""}
                          onChange={(event) => setProfile((prev) => ({ ...prev, permanentDistrict: event.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="ac-row">
                      <div className="ac-field">
                        <input
                          className="ac-input"
                          value={profile?.permanentWard || ""}
                          onChange={(event) => setProfile((prev) => ({ ...prev, permanentWard: event.target.value }))}
                        />
                      </div>
                      <div className="ac-field">
                        <input
                          className="ac-input"
                          value={profile?.permanentAddress || ""}
                          onChange={(event) => setProfile((prev) => ({ ...prev, permanentAddress: event.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="ac-row">
                    <div className="ac-field">
                      <label>Ngày sinh</label>
                      <input
                        className="ac-input"
                        value={profile?.dateOfBirth || ""}
                        onChange={(event) => setProfile((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
                      />
                    </div>
                    <div className="ac-field">
                      <label>Giới tính</label>
                      <select
                        className="ac-select"
                        value={profile?.gender || ""}
                        onChange={(event) => setProfile((prev) => ({ ...prev, gender: event.target.value }))}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nu">Nữ</option>
                        <option value="Khac">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div className="ac-row">
                    <div className="ac-field">
                      <label>Email</label>
                      <input
                        className="ac-input"
                        value={profile?.email || ""}
                        onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                      />
                    </div>
                    <div className="ac-field">
                      <label>Số điện thoại</label>
                      <input
                        className="ac-input"
                        value={profile?.phone || ""}
                        onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="ac-save-wrap">
                    <button className="ac-save" type="submit">Lưu</button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
