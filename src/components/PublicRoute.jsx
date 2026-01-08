// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Redirect based on user role
    if (user?.role === "admin") {
      return <Navigate to="/piu/admin" replace />;
    } else if (user?.role === "student") {
      return <Navigate to="/piu/student" replace />;
    } else if (user?.role === "teacher") {
      return <Navigate to="/piu/teacher" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicRoute;