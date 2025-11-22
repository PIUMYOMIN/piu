import { useState, useEffect } from "react";
import StudentNavbar from "./../components/student/StudentNavbar"
import StudentSidebar from "./../components/student/StudentSidebar"
import { Outlet } from "react-router-dom";

export default function StudentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [studentName, setStudentName] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch student name from free API
  useEffect(() => {
    async function fetchName() {
      try {
        const res = await fetch("https://randomuser.me/api/");
        const data = await res.json();

        const firstName = data.results[0].name.first;
        setStudentName(firstName);
      } catch (error) {
        console.log("Error loading student name", error);
      }
    }

    fetchName();
  }, []);

  // Auto-close sidebar on desktop
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
      <StudentNavbar
        toggleSidebar={toggleSidebar}
        studentName={studentName}
      />

      <div className="flex pt-[84px]">
        <StudentSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <main className="flex-1 p-4 sm:p-6 min-h-[calc(100vh-84px)] overflow-auto bg-gray-100 lg:ml-80 transition-all duration-300">
          <Outlet context={{studentName}}/>
        </main>
      </div>
    </div>
  );
}
