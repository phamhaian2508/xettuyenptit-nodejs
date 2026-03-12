import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="screen-center">Đang tải dữ liệu...</div>;
  }

  if (!user) {
    return <Navigate to="/user/login" replace state={{ from: location }} />;
  }

  return children;
}
