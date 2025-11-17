// import React, { useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import AdminNavbar from "../components/admin/AdminNavbar";
// import AdminSidebar from "../components/admin/AdminSidebar";
// import { useAuth } from "../contexts/AuthContext";

// export default function AdminLayout() {
//   // const navigate = useNavigate();
//   // const { isAuthenticated, isLoading } = useAuth();

//   // useEffect(
//   //   () => {
//   //     if (!isLoading && !isAuthenticated) {
//   //       navigate("/piu/login");
//   //     }
//   //   },
//   //   [isAuthenticated, isLoading]
//   // );

//   return (
//     <div className="font-roboto">
//       <AdminNavbar />

//       <div className="flex pt-[84px]">
//         <aside className="fixed top-[84px] left-0 bottom-0 w-96 bg-[#001933] text-white z-40 overflow-y-auto scrollbar-hide">
//           <AdminSidebar />
//         </aside>
        
//         <main className="ml-96 flex-1 p-6 min-h-[calc(100vh-84px)] overflow-auto bg-gray-100">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import AdminNavbar from "../components/admin/AdminNavbar";
// import AdminSidebar from "../components/admin/AdminSidebar";
// import { useAuth } from "../contexts/AuthContext";

// export default function AdminLayout() {
//   // const navigate = useNavigate();
//   // const { isAuthenticated, isLoading } = useAuth();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // useEffect(
//   //   () => {
//   //     if (!isLoading && !isAuthenticated) {
//   //       navigate("/piu/login");
//   //     }
//   //   },
//   //   [isAuthenticated, isLoading]
//   // );

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   // Close sidebar when resizing to desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIsSidebarOpen(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <div className="font-roboto">
//       <AdminNavbar toggleSidebar={toggleSidebar} />

//       <div className="flex pt-[84px]">
//         <AdminSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
//         <main className={`flex-1 p-4 sm:p-6 min-h-[calc(100vh-84px)] overflow-auto bg-gray-100 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-80' : 'lg:ml-0'}`}>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import AdminNavbar from "../components/admin/AdminNavbar";
// import AdminSidebar from "../components/admin/AdminSidebar";
// import { useAuth } from "../contexts/AuthContext";

// export default function AdminLayout() {
//   // const navigate = useNavigate();
//   // const { isAuthenticated, isLoading } = useAuth();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // useEffect(
//   //   () => {
//   //     if (!isLoading && !isAuthenticated) {
//   //       navigate("/piu/login");
//   //     }
//   //   },
//   //   [isAuthenticated, isLoading]
//   // );

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   // Close sidebar when resizing to desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIsSidebarOpen(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <div className="font-roboto">
//       <AdminNavbar toggleSidebar={toggleSidebar} />

//       <div className="flex pt-[84px]">
//         <AdminSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
//         {/* Main content area with proper margin for sidebar */}
//         <main className={`flex-1 p-4 sm:p-6 min-h-[calc(100vh-84px)] overflow-auto bg-gray-100 transition-all duration-300 lg:ml-80`}>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Auto-close sidebar on desktop screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="font-roboto">
      <AdminNavbar toggleSidebar={toggleSidebar} />

      <div className="flex pt-[84px]">
        <AdminSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <main className="flex-1 p-4 sm:p-6 min-h-[calc(100vh-84px)] overflow-auto bg-gray-100 lg:ml-80 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
