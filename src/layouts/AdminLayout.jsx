import React from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Update the path to your AuthContext

const AdminLayout = () => {
  const { isAuthenticated } = useAuth();

  console.log("isAuthenticated in AdminLayout:", isAuthenticated); // Add this line to check the value

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

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
};
