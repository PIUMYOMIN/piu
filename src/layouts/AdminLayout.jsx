import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth(); // Get isLoading from useAuth

  useEffect(
    () => {
      console.log("isAuthenticated in AdminLayout:", isAuthenticated);

      if (!isLoading && !isAuthenticated) {
        // Check isLoading
        navigate("/login");
        console.log("Redirecting to /login");
      }
    },
    [isAuthenticated, isLoading]
  ); // Add isLoading to dependency array

  return (
    <div className="font-roboto">
      <div className="w-full mx-auto box-border overflow-hidden">
        <AdminNavbar />
        <AdminSidebar />
        <div className="p-4 sm:ml-64">
          <div className="rounded-lg dark:border-gray-700 mt-14">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
