import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { resolveUserRole } from "../utils/authRouting";

export default function RoleRoute({ children, allowedRoles = [], fallbackTo = "/piu/admin" }) {
  const { user } = useAuth();
  const role = resolveUserRole(user);
  const allow = allowedRoles.map((r) => String(r).toLowerCase());

  if (!allow.includes(role)) {
    return <Navigate to={fallbackTo} replace />;
  }

  return children;
}
