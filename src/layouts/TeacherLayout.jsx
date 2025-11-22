import { useState, useEffect } from "react";
import TeacherNavbar from "../components/teacher/TeacherNavbar";
import TeacherSidebar from "../components/teacher/TeacherSidebar";
import { Outlet } from "react-router-dom";

export default function TeacherLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [teacherName, setTeacherName] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch teacher name from free API
  useEffect(() => {
    async function fetchTeacherName() {
      try {
        const res = await fetch("https://randomuser.me/api/");
        const data = await res.json();

        const firstName = data.results[0].name.first;
        setTeacherName(firstName);
      } catch (err) {
        console.log("Failed to load teacher name", err);
      }
    }

    fetchTeacherName();
  }, []);

  // Auto-close sidebar on large screens
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
      <TeacherNavbar
        toggleSidebar={toggleSidebar}
        teacherName={teacherName}
      />

      <div className="flex pt-[84px]">
        <TeacherSidebar
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
