import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function resolveRole(user) {
  const role = String(
    user?.role?.name ??
      user?.role ??
      (Array.isArray(user?.roles) ? user.roles[0]?.name || user.roles[0] : "")
  ).toLowerCase();
  return role === "faculty" ? "teacher" : role;
}

export default function RoleRoute({ children, allowedRoles = [], fallbackTo = "/piu/admin" }) {
  const { user } = useAuth();
  const role = resolveRole(user);
  const allow = allowedRoles.map((r) => String(r).toLowerCase());

  if (!allow.includes(role)) {
    return <Navigate to={fallbackTo} replace />;
  }

  return children;
}
