import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function ProtectedRoute({ children, allowRoles, loginPath = "/user/login" }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="screen-center">Đang tải dữ liệu...</div>;
  }

  if (!user) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (allowRoles?.length && !allowRoles.some((role) => user.roles?.includes(role))) {
    const fallbackPath = user.roles?.includes("ADMIN") ? "/admin/dashboard" : "/mucdich";
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
