import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { PortalFooter } from "./PortalFooter";
import { PortalIntroModal } from "./PortalIntroModal";

function InfoCircleIcon() {
  return (
    <svg viewBox="64 64 896 896" focusable="false" aria-hidden="true">
      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
      <path d="M464 336a48 48 0 1 0 96 0 48 48 0 0 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" />
    </svg>
  );
}

function UserOutlinedIcon() {
  return (
    <svg viewBox="64 64 896 896" focusable="false" aria-hidden="true">
      <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" />
    </svg>
  );
}

function LogoutOutlinedIcon() {
  return (
    <svg viewBox="64 64 896 896" focusable="false" aria-hidden="true">
      <path d="M868 732h-70.3c-4.8 0-8.7 3.9-8.7 8.7V794H194V230h595v53.3c0 4.8 3.9 8.7 8.7 8.7H868c4.8 0 8.7-3.9 8.7-8.7V184c0-17.7-14.3-32-32-32H138c-17.7 0-32 14.3-32 32v656c0 17.7 14.3 32 32 32h706.7c17.7 0 32-14.3 32-32v-99.3c0-4.8-3.9-8.7-8.7-8.7z" />
      <path d="M905.6 505l-137.9-138c-6.5-6.5-17-6.6-23.5-.1l-45.3 45.2c-6.6 6.6-6.6 17.4 0 24l63.8 63.8H432c-9.4 0-17 7.6-17 17v64c0 9.4 7.6 17 17 17h330.7l-63.8 63.8c-6.6 6.6-6.6 17.4 0 24l45.3 45.2c6.5 6.5 17 6.4 23.5-.1l137.9-138c6.7-6.6 6.7-17.4 0-24z" />
    </svg>
  );
}

export function AdminShell({ user, onLogout, navigation = [], children }) {
  const navigate = useNavigate();
  const displayFullName = user?.fullName || user?.userName || "Quản trị viên";
  const [showIntroModal, setShowIntroModal] = useState(false);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setShowIntroModal(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  async function handleLogout() {
    await onLogout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell-page">
      <header className="app-shared-header">
        <Link to="/admin/dashboard" className="app-shared-brand">
          <img src="/images/ptit-header-icon.png" className="app-shared-logo" alt="PTIT" />
          <div>
            <div className="app-shared-brand-top">HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</div>
            <div className="app-shared-brand-bottom">CỔNG QUẢN TRỊ XÉT TUYỂN TRỰC TUYẾN</div>
          </div>
        </Link>

        <div className="app-shared-right">
          <button
            type="button"
            className="app-shared-action app-shared-info-button"
            onClick={() => setShowIntroModal(true)}
          >
            <InfoCircleIcon />
          </button>
          <div className="app-shared-user">
            <div className="app-shared-user-trigger">
              <img src="/images/ptit-header-icon.png" alt="PTIT" className="app-shared-user-ptit" />
              <span className="app-shared-user-name">{displayFullName}</span>
            </div>
            <div className="app-shared-user-menu">
              <Link to="/admin/profile">
                <UserOutlinedIcon />
                <span>Tài khoản</span>
              </Link>
              <button type="button" className="app-shared-logout" onClick={handleLogout}>
                <LogoutOutlinedIcon />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-shell-nav-wrap">
        <nav className="admin-shell-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "admin-shell-link active" : "admin-shell-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <main className="admin-shell-content">{children}</main>

      <PortalFooter />
      <PortalIntroModal open={showIntroModal} onClose={() => setShowIntroModal(false)} />
    </div>
  );
}
