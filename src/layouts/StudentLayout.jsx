import React from "react";
import StudentNavbar from "./../components/student/StudentNavbar"
import StudentSidebar from "./../components/student/StudentSidebar"
import { Outlet } from "react-router-dom";

// export default function StudentLayout() {
//   return (
//     <div className="font-roboto">
//       <div className="p-4 bg-blue-600 text-white">
//         <h1 className="text-xl font-bold">Student Dashboard</h1>
//       </div>

//       <main className="p-4 bg-gray-100 min-h-screen">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

export default function StudentLayout() {
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
      <StudentNavbar toggleSidebar={toggleSidebar} />

      <div className="flex pt-[84px]">
        <StudentSidebar
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