import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { resolveUserRole } from "../utils/authRouting";

export default function RoleRoute({ children, allowedRoles = [], fallbackTo = "/piu/admin" }) {
  const { user, initialized } = useAuth();

  // Wait for auth to finish initializing before making a role decision.
  // Without this guard, user is null during the async getProfile() call and
  // RoleRoute would redirect everyone away before their session is confirmed.
  if (!initialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const role = resolveUserRole(user);
  const allow = allowedRoles.map((r) => String(r).toLowerCase());

  if (!allow.includes(role)) {
    return <Navigate to={fallbackTo} replace />;
  }

  return children;
}