import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store";

export default function RequireAuth() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/connexion" replace />;
  }

  return <Outlet />;
}