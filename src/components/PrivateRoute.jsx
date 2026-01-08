// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    console.log("🔍 PrivateRoute Debug:");
    console.log("- isAuthenticated:", isAuthenticated);
    console.log("- user:", user);
    console.log("- user?.role:", user?.role);
    console.log("- required role:", role);
    console.log("- localStorage token:", localStorage.getItem("token"));
    console.log("- localStorage user:", localStorage.getItem("user"));
    console.log("- loading:", loading);
  }, [isAuthenticated, user, role, loading]);

  if (loading) {
    console.log("⏳ PrivateRoute: Loading...");
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("❌ PrivateRoute: Not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // Check if user exists
  if (!user) {
    console.log("❌ PrivateRoute: User object is null, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // Check if user has role
  if (role && user.role !== role) {
    console.log(`❌ PrivateRoute: Role mismatch! User role: "${user.role}", Required: "${role}", Redirecting to /`);
    return <Navigate to="/" replace />;
  }

  console.log("✅ PrivateRoute: Access granted!");
  return children;
};

export default PrivateRoute;