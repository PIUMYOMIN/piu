import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout() {
  // const navigate = useNavigate();
  // const { isAuthenticated, isLoading } = useAuth();

  // useEffect(
  //   () => {
  //     if (!isLoading && !isAuthenticated) {
  //       navigate("/piu/login");
  //     }
  //   },
  //   [isAuthenticated, isLoading]
  // );

  return (
    <div className="font-roboto">
      <AdminNavbar />

      <div className="flex pt-[84px]">
        <aside className="fixed top-[84px] left-0 bottom-0 w-96 bg-[#001933] text-white z-40 overflow-y-auto scrollbar-hide">
          <AdminSidebar />
        </aside>
        
        <main className="ml-96 flex-1 p-6 min-h-[calc(100vh-84px)] overflow-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
