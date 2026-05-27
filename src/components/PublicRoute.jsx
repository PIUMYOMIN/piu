// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardPathForUser } from "../utils/authRouting";

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
    return <Navigate to={getDashboardPathForUser(user)} replace />;
  }

  return children;
};

export default PublicRoute;
