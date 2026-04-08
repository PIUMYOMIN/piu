// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    const role = String(
      user?.role?.name ??
        user?.role ??
        (Array.isArray(user?.roles) ? user.roles[0]?.name || user.roles[0] : "")
    ).toLowerCase();

    // Redirect based on user role
    if (role === "admin") {
      return <Navigate to="/piu/admin" replace />;
    } else if (role === "registrar") {
      return <Navigate to="/piu/admin" replace />;
    } else if (role === "student") {
      return <Navigate to="/piu/student" replace />;
    } else if (role === "teacher") {
      return <Navigate to="/piu/admin" replace />;
    } else if (role === "user" || role === "") {
      return <Navigate to="/piu/user" replace />;
    } else {
      return <Navigate to="/piu/user" replace />;
    }
  }

  return children;
};

export default PublicRoute;