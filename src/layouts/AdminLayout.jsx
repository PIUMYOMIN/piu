import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check if mobile and close sidebar on desktop
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false); // Always closed on desktop
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="font-roboto min-h-screen bg-gray-100">
      <AdminNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex pt-[64px] md:pt-[72px]">
        {/* Sidebar */}
        <AdminSidebar 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar}
        />
        
        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-6 min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-72px)] bg-gray-50 transition-all duration-300 
          ${isSidebarOpen && isMobile ? 'ml-0' : 'lg:ml-80'}`}>
          <div className="max-w-full lg:max-w-[calc(100vw-320px)] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}