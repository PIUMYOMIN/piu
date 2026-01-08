import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt, FaUserCog, FaKey, FaUsers, FaGraduationCap, FaBookOpen,
  FaBlog, FaUniversity, FaNewspaper, FaListAlt, FaUsersCog, FaSlidersH,
  FaHandshake, FaCalendarAlt, FaBuilding, FaBriefcase, FaChalkboardTeacher,
  FaClock, FaImages, FaSuitcase, FaUserGraduate, FaEnvelope, FaTasks,
  FaBook, FaBookReader, FaChevronRight, FaTimes, FaSignOutAlt
} from "react-icons/fa";

// ----------------- ADMIN MENU -----------------
const adminMenu = [
  { title: "Dashboard", icon: <FaTachometerAlt />, path: "/piu/admin" },
  { title: "Profile Setting", icon: <FaUserCog />, path: "/piu/admin/profile" },
  { title: "Change Password", icon: <FaKey />, path: "/piu/admin/change-password" },

  {
    title: "Users", icon: <FaUsers />,
    sub: [
      { name: "All Users", path: "/piu/admin/users" },
      { name: "User Role", path: "/piu/admin/users-role" },
      { name: "User Permission", path: "/piu/admin/user-permission" }
    ]
  },
  {
    title: "Admission", icon: <FaGraduationCap />, path: "/piu/admin/admission",
  },
  {
    title: "All Courses", icon: <FaBookOpen />,
    sub: [
      { name: "Course List", path: "/piu/admin/course-list" },
      { name: "Add Course", path: "/piu/admin/new" },
    ]
  },
  {
    title: "Course Categories", icon: <FaListAlt />,
    sub: [
      { name: "Categories", path: "/piu/admin/course-categories" }
    ]
  },
  {
    title: "All Blogs", icon: <FaBlog />,
    sub: [
      { name: "Blog List", path: "/piu/admin/blog-list" },
      { name: "Add Blog", path: "/piu/admin/add-blog" },
    ]
  },
  {
    title: "All News", icon: <FaNewspaper />,
    sub: [
      { name: "News List", path: "/piu/admin/news" },
      { name: "Add News", path: "/piu/admin/add-news" },
    ]
  },
  {
    title: "Events", icon: <FaCalendarAlt />,
    sub: [
      { name: "Event List", path: "/piu/admin/event-list" },
      { name: "Add Event", path: "/piu/admin/add-event" },
    ]
  },
  {
    title: "All Campus", icon: <FaUniversity />,
    sub: [
      { name: "Campus List", path: "/piu/admin/campus-list" },
      { name: "Add Campus", path: "/piu/admin/new-campus" },
    ]
  },
  {
    title: "Curriculums", icon: <FaListAlt />,
    sub: [
      { name: "Curriculum List", path: "/piu/admin/curriculum-list" },
      { name: "Add Curriculum", path: "/piu/admin/add-curriculum" },
    ]
  },
  {
    title: "Teams", icon: <FaUsersCog />,
    sub: [
      { name: "Team List", path: "/piu/admin/team-list" },
      { name: "Add Team", path: "/piu/admin/add-team" },
    ]
  },
  {
    title: "Slider", icon: <FaSlidersH />, path: "/piu/admin/slider"
  },
  {
    title: "MOU Partnership", icon: <FaHandshake />,
    sub: [
      { name: "All MOU", path: "/piu/admin/mou" },
      { name: "Add MOU", path: "/piu/admin/mou/add" },
    ]
  },
  {
    title: "Departments", icon: <FaBuilding />,
    sub: [
      { name: "Department List", path: "/piu/admin/departments" },
      { name: "Add Department", path: "/piu/admin/departments/new" },
    ]
  },
  {
    title: "Positions", icon: <FaBriefcase />,
    sub: [
      { name: "Position List", path: "/piu/admin/positions" },
      { name: "Add Position", path: "/piu/admin/positions/new" },
    ]
  },
  {
    title: "Seminar", icon: <FaChalkboardTeacher />,
    sub: [
      { name: "Seminar List", path: "/piu/admin/seminars" },
      { name: "Add Seminar", path: "/piu/admin/seminars/add" },
    ]
  },
  {
    title: "Students", icon: <FaUserGraduate />,
    sub: [
      { name: "All Students", path: "/piu/admin/students" },
      { name: "Add Student", path: "/piu/admin/students/add" },
      { name: "Add Student Grading", path: "/piu/admin/students/add-grading" },
      { name: "Student Grading", path: "/piu/admin/students/grading" }
    ]
  },
  {
    title: "Gallery", icon: <FaImages />,
    sub: [
      { name: "Gallery List", path: "/piu/admin/gallery" },
      { name: "Add Gallery", path: "/piu/admin/gallery/add" },
    ]
  },
  {
    title: "Assignments", icon: <FaTasks />,
    sub: [
      { name: "Assignment List", path: "/piu/admin/assignments" },
      { name: "Add Assignment", path: "/piu/admin/assignments/add" },
    ]
  },
  {
    title: "Course Modules", icon: <FaBook />,
    sub: [
      { name: "Module List", path: "/piu/admin/modules" },
      { name: "Add Module", path: "/piu/admin/modules/add" },
    ]
  },
  {
    title: "Exam Time Table", icon: <FaClock />,
    sub: [
      { name: "Time Table List", path: "/piu/admin/timetable-list" },
      { name: "Add Time Table", path: "/piu/admin/add-timetable" },
      { name: "Exam Sessions", path: "/piu/admin/exam-sessions" }
    ]
  },
  {
    title: "Job Vacants", icon: <FaSuitcase />,
    sub: [
      { name: "Job List", path: "/piu/admin/job-list" },
      { name: "Add Job", path: "/piu/admin/add-job" },
      { name: "Job Categories", path: "/piu/admin/job-categories" }
    ]
  },
  {
    title: "Mail Box", icon: <FaEnvelope />,
    sub: [
      { name: "Inbox", path: "/piu/admin/inbox" },
      { name: "Sent Mails", path: "/piu/admin/sent-mails" },
      { name: "Drafts", path: "/piu/admin/drafts" }
    ]
  },
  {
    title: "Subjects", icon: <FaBookReader />,
    sub: [
      { name: "Subject List", path: "/piu/admin/subject-list" },
      { name: "Add Subject", path: "/piu/admin/add-subject" },
      { name: "Subject Categories", path: "/piu/admin/subject-categories" }
    ]
  }
];

const AdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  // Highlight active item
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`fixed top-16 md:top-18 left-0 bottom-0 w-80 bg-gradient-to-b from-[#001933] to-[#002147] text-white z-40 overflow-y-auto scrollbar-hide 
                    transition-transform duration-300 ease-in-out shadow-lg
                    lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between lg:hidden">
          <div className="font-medium">Admin Menu</div>
          <button
            className="p-1 rounded-full hover:bg-[#002147]"
            onClick={toggleSidebar}
          >
            <FaTimes size={16} />
          </button>
        </div>

        <ul className="p-4 space-y-1">
          {adminMenu.map((item, index) => {
            const hasSub = !!item.sub;
            const isItemActive = isActive(item.path) || (item.sub?.some(subItem => isActive(subItem.path)));

            return (
              <li key={index} className="mb-1">
                {hasSub ? (
                  <>
                    <button
                      onClick={() => toggleMenu(index)}
                      className={`flex items-center justify-between w-full p-3 rounded-lg transition-all
                                  ${isItemActive ? 'bg-[#003366]' : 'hover:bg-[#002147]'}`}
                    >
                      <div className="flex items-center text-sm">
                        <span className="mr-3 text-blue-300">{item.icon}</span>
                        {item.title}
                      </div>
                      <FaChevronRight
                        className={`transition-transform duration-200 ${
                          openMenu === index ? "rotate-90" : ""
                        } text-xs`}
                      />
                    </button>
                    
                    {openMenu === index && (
                      <ul className="ml-10 mt-1 space-y-1 border-l border-gray-700 pl-4">
                        {item.sub.map((subItem, subIndex) => (
                          <Link 
                            key={subIndex} 
                            to={subItem.path}
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                          >
                            <li
                              className={`p-2 rounded transition-colors
                                        ${isActive(subItem.path) 
                                          ? 'bg-[#003366] text-white' 
                                          : 'hover:bg-[#002147] text-gray-300'}`}
                            >
                              {subItem.name}
                            </li>
                          </Link>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  >
                    <div
                      className={`flex items-center w-full p-3 rounded-lg transition-all
                                ${isActive(item.path) 
                                  ? 'bg-[#003366]' 
                                  : 'hover:bg-[#002147]'}`}
                    >
                      <span className="mr-3 text-blue-300">{item.icon}</span>
                      <span className="text-sm">{item.title}</span>
                    </div>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Footer with logout */}
        <div className="p-4 border-t border-gray-700 mt-auto">
          <button
            onClick={() => {
              if (window.innerWidth < 1024) toggleSidebar();
              // Trigger logout
            }}
            className="flex items-center w-full p-3 rounded-lg hover:bg-red-900/20 text-red-300 transition-colors"
          >
            <FaSignOutAlt className="mr-3" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;