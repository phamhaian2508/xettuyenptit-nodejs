import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import { AccountCenterPage } from "./pages/AccountCenterPage";
import { FilesPage } from "./pages/FilesPage";
import { LoginPage } from "./pages/LoginPage";
import { PurposePage } from "./pages/PurposePage";

function PrivatePages() {
  const { user, logout, refreshUser } = useContext(AuthContext);

  return (
    <AppShell user={user} onLogout={logout}>
      <Routes>
        <Route path="/mucdich" element={<PurposePage user={user} />} />
        <Route path="/danhsachhoso" element={<FilesPage />} />
        <Route
          path="/account/center"
          element={<AccountCenterPage user={user} refreshUser={refreshUser} />}
        />
        <Route path="*" element={<Navigate to="/mucdich" replace />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/user/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <PrivatePages />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
