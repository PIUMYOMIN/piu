import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {FaBookOpen, FaTachometerAlt, FaUserCog, FaClock, FaEnvelope, FaChevronRight, FaTimes } from "react-icons/fa";

// ----------------- Teacher MENU -----------------
export const teacherMenu = [
  { title: "Dashboard", icon: <FaTachometerAlt />, path: "/piu/teacher" },
  { title: "Teacher Profile", icon: <FaUserCog />, path: "/piu/teacher/profile" },
  {
    title: "Courses", icon: <FaBookOpen />,
    sub: [
      { name: "My Courses", path: "/piu/teacher/courses" },
      { name: "Create Assignment", path: "/piu/teacher/assignments/create" },
      { name: "Grade Students", path: "/piu/teacher/grades" },
    ]
  },
  {
    title: "Attendance", icon: <FaClock />,
    sub: [
      { name: "Mark Attendance", path: "/piu/teacher/attendance" },
      { name: "Attendance Reports", path: "/piu/teacher/attendance-reports" },
    ]
  },
  {
    title: "Messages", icon: <FaEnvelope />,
    sub: [
      { name: "Inbox", path: "/piu/teacher/inbox" },
      { name: "Sent", path: "/piu/teacher/sent" },
    ]
  }
];

const TeacherSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  // Highlight active item
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`fixed top-[84px] left-0 bottom-0 w-80 bg-[#001933] text-white z-40 overflow-y-auto scrollbar-hide 
                    transition-transform duration-300 ease-in-out 
                    lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          className="lg:hidden absolute top-4 right-4 p-1 rounded-full bg-[#002147] hover:bg-[#003366]"
          onClick={toggleSidebar}
        >
          <FaTimes size={16} />
        </button>

        <ul className="p-3 space-y-0 mt-4 lg:mt-0">
          {teacherMenu.map((item, index) => {
            const hasSub = !!item.sub;

            return (
              <li key={index} className="border-b border-gray-700">
                {hasSub ? (
                  <button
                    onClick={() => toggleMenu(index)}
                    className="flex items-center justify-between w-full p-2 hover:bg-[#002147] rounded"
                  >
                    <div className="flex items-center text-sm py-2">
                      <span className="mr-3">{item.icon}</span>
                      {item.title}
                    </div>
                    <FaChevronRight
                      className={`transition-transform duration-200 ${
                        openMenu === index ? "rotate-90" : ""
                      } text-xs`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center justify-between w-full p-2 rounded 
                                ${
                                  isActive(item.path)
                                    ? "bg-[#003366]"
                                    : "hover:bg-[#002147]"
                                }`}
                  >
                    <div className="flex items-center text-sm py-2">
                      <span className="mr-3">{item.icon}</span>
                      {item.title}
                    </div>
                  </Link>
                )}

                {hasSub && openMenu === index && (
                  <ul className="pl-8 text-sm">
                    {item.sub.map((subItem, subIndex) => (
                      <Link key={subIndex} to={subItem.path}>
                        <li
                          className={`p-1 rounded cursor-pointer 
                            ${
                              isActive(subItem.path)
                                ? "bg-[#003366]"
                                : "hover:bg-[#002147]"
                            }`}
                        >
                          {subItem.name}
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
};

export default TeacherSidebar;
