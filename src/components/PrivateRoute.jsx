// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children, role, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user exists
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const expectedRole = requiredRole || role;
  const currentRole = String(
    user?.role ?? (Array.isArray(user?.roles) ? user.roles[0] : "")
  ).toLowerCase();

  // Check if user has role
  if (expectedRole && currentRole !== String(expectedRole).toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;