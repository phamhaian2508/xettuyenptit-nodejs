import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminShell } from "./components/AdminShell";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import { AccountCenterPage } from "./pages/AccountCenterPage";
import { AdminApplicationDetailPage } from "./pages/AdminApplicationDetailPage";
import { AdminApplicationsPage } from "./pages/AdminApplicationsPage";
import { AdminCandidateDetailPage } from "./pages/AdminCandidateDetailPage";
import { AdminCandidatesPage } from "./pages/AdminCandidatesPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminExportPage } from "./pages/AdminExportPage";
import { FilesPage } from "./pages/FilesPage";
import { LoginPage } from "./pages/LoginPage";
import { PurposePage } from "./pages/PurposePage";
import { RootConsolePage } from "./pages/RootConsolePage";

const adminNavigation = [
  { to: "/admin/dashboard", label: "Tổng quan", end: true },
  { to: "/admin/applications", label: "Quản lý hồ sơ" },
  { to: "/admin/candidates", label: "Quản lý thí sinh" },
  { to: "/admin/export", label: "Xuất dữ liệu" },
  { to: "/admin/profile", label: "Tài khoản" }
];

const rootNavigation = [
  { to: "/root/console", label: "Điều hành hệ thống", end: true },
  { to: "/root/profile", label: "Tài khoản" }
];

function CandidatePages() {
  const { user, logout, refreshUser } = useContext(AuthContext);

  return (
    <AppShell user={user} onLogout={logout}>
      <Routes>
        <Route path="mucdich" element={<PurposePage user={user} />} />
        <Route path="danhsachhoso" element={<FilesPage user={user} refreshUser={refreshUser} />} />
        <Route
          path="account/center"
          element={<AccountCenterPage user={user} refreshUser={refreshUser} />}
        />
        <Route path="*" element={<Navigate to="/mucdich" replace />} />
      </Routes>
    </AppShell>
  );
}

function AdminPages() {
  const { user, logout, refreshUser } = useContext(AuthContext);

  return (
    <AdminShell user={user} onLogout={logout} navigation={adminNavigation}>
      <Routes>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="applications" element={<AdminApplicationsPage />} />
        <Route path="applications/:id" element={<AdminApplicationDetailPage />} />
        <Route path="candidates" element={<AdminCandidatesPage />} />
        <Route path="candidates/:id" element={<AdminCandidateDetailPage />} />
        <Route path="export" element={<AdminExportPage />} />
        <Route
          path="profile"
          element={<AccountCenterPage user={user} refreshUser={refreshUser} />}
        />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminShell>
  );
}

function RootPages() {
  const { user, logout, refreshUser } = useContext(AuthContext);

  return (
    <AdminShell user={user} onLogout={logout} navigation={rootNavigation}>
      <Routes>
        <Route path="console" element={<RootConsolePage />} />
        <Route
          path="profile"
          element={<AccountCenterPage user={user} refreshUser={refreshUser} />}
        />
        <Route path="*" element={<Navigate to="/root/console" replace />} />
      </Routes>
    </AdminShell>
  );
}

function RootRedirect() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="screen-center">Dang tai du lieu...</div>;
  }

  if (!user) {
    return <Navigate to="/user/login" replace />;
  }

  if (user.roles?.includes("ADMIN")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.roles?.includes("ROOT")) {
    return <Navigate to="/root/console" replace />;
  }

  return <Navigate to="/mucdich" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/user/login" element={<LoginPage mode="candidate" />} />
      <Route path="/admin/login" element={<LoginPage mode="admin" />} />
      <Route path="/" element={<RootRedirect />} />
      <Route
        path="/root/*"
        element={
          <ProtectedRoute allowRoles={["ROOT"]} loginPath="/user/login">
            <RootPages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowRoles={["ADMIN"]} loginPath="/admin/login">
            <AdminPages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute allowRoles={["CANDIDATE", "ROOT"]} loginPath="/user/login">
            <CandidatePages />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
