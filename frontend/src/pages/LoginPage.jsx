import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function UserIcon() {
  return (
    <svg viewBox="64 64 896 896" fill="currentColor" aria-hidden="true">
      <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="64 64 896 896" fill="currentColor" aria-hidden="true">
      <path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="64 64 896 896" fill="currentColor" aria-hidden="true">
      <path d="M942.2 486.2Q889.47 375.11 816.7 305C742.46 233.4 648.93 197 512 197c-136.93 0-230.46 36.4-304.7 108C134.53 375.11 81.8 486.2 81.8 486.2a60.3 60.3 0 000 51.5Q134.53 648.89 207.3 719c74.24 71.6 167.77 108 304.7 108 136.93 0 230.46-36.4 304.7-108q72.77-70.11 125.5-181.3a60.29 60.29 0 000-51.5zM512 747c-63.6 0-122.86-22.47-176.15-66.78C289.08 640.08 253.83 582.59 227 512c26.83-70.59 62.08-128.08 108.85-168.22C389.14 299.47 448.4 277 512 277c63.6 0 122.86 22.47 176.15 66.78C734.92 383.92 770.17 441.41 797 512c-26.83 70.59-62.08 128.08-108.85 168.22C634.86 724.53 575.6 747 512 747z" />
      <path d="M512 352c-88.22 0-160 71.78-160 160s71.78 160 160 160 160-71.78 160-160-71.78-160-160-160zm0 240c-44.11 0-80-35.89-80-80s35.89-80 80-80 80 35.89 80 80-35.89 80-80 80z" />
    </svg>
  );
}

function EyeInvisibleIcon() {
  return (
    <svg viewBox="64 64 896 896" fill="currentColor" aria-hidden="true">
      <path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5z" />
      <path d="M878.63 165.56L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z" />
      <path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z" />
    </svg>
  );
}

function CloseCircleIcon() {
  return (
    <svg fillRule="evenodd" viewBox="64 64 896 896" fill="currentColor" aria-hidden="true">
      <path d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm127.98 274.82h-.04l-.08.06L512 466.75 384.14 338.88c-.04-.05-.06-.06-.08-.06a.12.12 0 00-.07 0c-.03 0-.05.01-.09.05l-45.02 45.02a.2.2 0 00-.05.09.12.12 0 000 .07v.02a.27.27 0 00.06.06L466.75 512 338.88 639.86c-.05.04-.06.06-.06.08a.12.12 0 000 .07c0 .03.01.05.05.09l45.02 45.02a.2.2 0 00.09.05.12.12 0 00.07 0c.02 0 .04-.01.08-.05L512 557.25l127.86 127.87c.04.04.06.05.08.05a.12.12 0 00.07 0c.03 0 .05-.01.09-.05l45.02-45.02a.2.2 0 00.05-.09.12.12 0 000-.07v-.02a.27.27 0 00-.05-.06L557.25 512l127.87-127.86c.04-.04.05-.06.05-.08a.12.12 0 000-.07c0-.03-.01-.05-.05-.09l-45.02-45.02a.2.2 0 00-.09-.05.12.12 0 00-.07 0z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="64 64 896 896" aria-hidden="true">
      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
      <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="64 64 896 896" aria-hidden="true">
      <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z" />
    </svg>
  );
}

export function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showGuide, setShowGuide] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const usernameErrorVisible = !form.username.trim();
  const passwordErrorVisible = !form.password.trim();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Login - Xét tuyển PTIT";

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setShowGuide(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.title = previousTitle;
    };
  }, []);

  function handleForgotSubmit(event) {
    event.preventDefault();
    setShowForgotModal(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || "/mucdich";
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page login-page-origin">
        <div className="left">
          <img src="/images/ptit-login-left.png" alt="PTIT" />
        </div>

        <div className="right">
          <div className="main">
            <div className="title-wrap">
              <h1 className="head">HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</h1>
              <div className="subhead">HỆ THỐNG XÉT TUYỂN TRỰC TUYẾN</div>
            </div>

            {error ? <div className="sys-alert">{error}</div> : null}

            <form autoComplete="off" id="loginForm" onSubmit={handleSubmit}>
              <div className="label">Tên đăng nhập</div>
              <div className={`field${usernameErrorVisible ? " is-error" : ""}`}>
                <span className="icon" aria-hidden="true">
                  <UserIcon />
                </span>
                <input
                  id="username"
                  className="input"
                  type="text"
                  placeholder="Tài khoản"
                  value={form.username}
                  onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                />
                <button
                  type="button"
                  className={`suffix icon-button clear-button${form.username ? "" : " is-hidden"}`}
                  onClick={() => setForm((prev) => ({ ...prev, username: "" }))}
                  aria-label="Xóa tên đăng nhập"
                >
                  <CloseCircleIcon />
                </button>
              </div>
              <div className="error-line" style={{ visibility: usernameErrorVisible ? "visible" : "hidden" }}>
                Nhập tên đăng nhập
              </div>

              <div className="label">Mật khẩu</div>
              <div className={`field${passwordErrorVisible ? " is-error" : ""}`}>
                <span className="icon" aria-hidden="true">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  className="input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                />
                <button
                  type="button"
                  className="suffix icon-button password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeIcon /> : <EyeInvisibleIcon />}
                </button>
              </div>
              <div className="error-line" style={{ visibility: passwordErrorVisible ? "visible" : "hidden" }}>
                Nhập mật khẩu
              </div>

              <button className="btn" type="submit" disabled={submitting}>
                {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
              <a
                href="#"
                className="forgot"
                onClick={(event) => {
                  event.preventDefault();
                  setShowForgotModal(true);
                }}
              >
                Quên mật khẩu ?
              </a>
            </form>
          </div>

          <div className="footer">
            Học viện Công nghệ Bưu chính Viễn thông
            <br />
            © 2026 PTIT
          </div>
        </div>
      </div>

      {showForgotModal ? (
        <div
          className="forgot-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowForgotModal(false);
            }
          }}
        >
          <div className="forgot-modal">
            <div className="forgot-modal-content">
              <button
                type="button"
                aria-label="Close"
                className="forgot-modal-close"
                onClick={() => setShowForgotModal(false)}
              >
                <span className="forgot-modal-close-x">
                  <CloseIcon />
                </span>
              </button>
              <div className="forgot-modal-header">
                <div className="forgot-modal-title">Quên mật khẩu</div>
              </div>
              <div className="forgot-modal-body">
                <form className="forgot-form" onSubmit={handleForgotSubmit}>
                  <div className="forgot-form-item">
                    <label htmlFor="forgot-email" className="forgot-form-label">
                      Vui lòng nhập email đã dùng để đăng ký tài khoản
                    </label>
                    <input
                      id="forgot-email"
                      className="forgot-form-input"
                      type="text"
                      placeholder="Nhập email"
                      value={forgotEmail}
                      onChange={(event) => setForgotEmail(event.target.value)}
                    />
                  </div>
                  <div className="forgot-form-actions">
                    <button type="submit" className="forgot-submit-btn">
                      Gửi
                    </button>
                    <button type="button" className="forgot-close-btn" onClick={() => setShowForgotModal(false)}>
                      Đóng
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={`guide-modal-overlay${showGuide ? " show" : ""}`}
        aria-hidden={!showGuide}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setShowGuide(false);
          }
        }}
      >
        <div className="guide-modal" role="dialog" aria-modal="true" aria-labelledby="guideTitle">
          <div className="guide-header">
            <span className="guide-info-icon" aria-hidden="true">
              <InfoIcon />
            </span>
            <span id="guideTitle">Hướng dẫn đăng nhập</span>
            <button type="button" className="guide-close" onClick={() => setShowGuide(false)} aria-label="Đóng">
              <CloseIcon />
            </button>
          </div>
          <div className="guide-body">
            <div className="guide-text">
              Thí sinh nhập học trực tuyến dùng <b>Tên đăng nhập</b> và <b>Mật khẩu</b> được cấp.
            </div>
            <div className="guide-box">
              <div className="guide-row">
                <span className="guide-row-icon user" aria-hidden="true">
                  <UserIcon />
                </span>
                <span>
                  Tên đăng nhập là <b>CCCD/CMND</b> của thí sinh,<span className="guide-example">VD: 001234567891</span>
                </span>
              </div>
              <div className="guide-row">
                <span className="guide-row-icon lock" aria-hidden="true">
                  <LockIcon />
                </span>
                <span>
                  Mật khẩu là <b>ngày sinh</b> của thí sinh,<span className="guide-example">VD: 01012007</span>
                </span>
              </div>
            </div>
            <p className="guide-note">
              <span className="guide-note-icon" aria-hidden="true">
                <InfoIcon />
              </span>
              Mọi thắc mắc vui lòng liên hệ bộ phận hỗ trợ.
            </p>
          </div>
          <div className="guide-footer">
            <button type="button" className="guide-ok" onClick={() => setShowGuide(false)}>
              Đã hiểu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
