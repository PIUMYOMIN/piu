// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
  }, [isAuthenticated, user, role, loading]);

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

  // Check if user has role
  if (role && user.role !== role) {

    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;