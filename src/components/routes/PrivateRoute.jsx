//components/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, initialized, loading } = useAuth();

  if (!initialized || loading) {
    // Show a loading spinner while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check it
  if (requiredRole && user.role !== requiredRole) {
    // Role mismatch → redirect to appropriate dashboard or 403
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;