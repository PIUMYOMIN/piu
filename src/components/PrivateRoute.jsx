import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children, role }) {
  const { isAuthenticated, role: userRole, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
