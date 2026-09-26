import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store";

export default function RequireAdmin() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}