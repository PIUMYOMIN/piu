import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(
    () => {
      if (!isLoading && !isAuthenticated) {
        navigate("/login");
      }
    },
    [isAuthenticated, isLoading]
  );

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
