// import React, { useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import { FaSignOutAlt } from "react-icons/fa";

// export default function adminSidebar() {
//   const navigate = useNavigate();
//   // const { logout } = useAuth();
//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };
//   return <div>
//       <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
//         <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
//           <ul className="space-y-2 font-medium">
//             <li>
//               <Link to="/admin" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//                 <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
//                   <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
//                   <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
//                 </svg>
//                 <span className="ms-3">Dashboard</span>
//               </Link>
//             </li>
//             <li>
//               <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//                 <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
//                   <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
//                 </svg>
//                 <span className="flex-1 ms-3 whitespace-nowrap">Kanban</span>
//                 <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
//                   Pro
//                 </span>
//               </a>
//             </li>
//             <li>
//               <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//                 <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
//                 </svg>
//                 <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
//                 <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
//                   3
//                 </span>
//               </a>
//             </li>
//             <li>
//               <Link to="/admin/users" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//                 <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
//                   <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
//                 </svg>
//                 <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
//               </Link>
//             </li>
//             <li>
//               <Link to="/piu/admin/courses" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//                 <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
//                   <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
//                 </svg>
//                 <span className="flex-1 ms-3 whitespace-nowrap">Courses</span>
//               </Link>
//             </li>
//             <li>
//               <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//                 <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
//                   <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
//                 </svg>
//                 <span className="flex-1 ms-3 whitespace-nowrap">
//                   Products
//                 </span>
//               </a>
//             </li>
//             <li>
//               <button /*onClick={handleLogout}*/ className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//                 <FaSignOutAlt className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
//                 <span className="flex-1 ms-3 whitespace-nowrap">Log out</span>
//               </button>
//             </li>
//           </ul>
//         </div>
//       </aside>
//     </div>;
// }



import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt, FaUserCog, FaKey, FaUsers, FaGraduationCap, FaBookOpen,
  FaBlog, FaUniversity, FaNewspaper, FaListAlt, FaUsersCog, FaSlidersH, FaHandshake,
  FaCalendarAlt, FaBuilding, FaBriefcase, FaChalkboardTeacher, FaClock, FaImages,
  FaSuitcase, FaUserGraduate, FaEnvelope, FaTasks, FaBook, FaBookReader, FaChevronRight
} from "react-icons/fa";

export const menuItems = [
  { title: "Dashboard", icon: <FaTachometerAlt />, path: "/piu/admin" },
  { title: "Profile Setting", icon: <FaUserCog />, path: "/piu/admin/profile-setting" },
  { title: "Change Password", icon: <FaKey />, path: "/piu/admin/change-password" },

  {
    title: "Users", icon: <FaUsers />,
    sub: [
      { name: "All Users", path: "/piu/admin/users" },
      { name: "User Role", path: "/piu/admin/user-role" },
      { name: "User Permission", path: "/piu/admin/user-permission" }
    ]
  },
  {
    title: "Admission", icon: <FaGraduationCap />,
    sub: [
      { name: "All Admissions", path: "/piu/admin/all-admissions" },
      { name: "Pending Admissions", path: "/piu/admin/pending-admissions" },
      { name: "Rejected Admissions", path: "/piu/admin/rejected-admissions" }
    ]
  },
  {
    title: "All Courses", icon: <FaBookOpen />,
    sub: [
      { name: "Course List", path: "/piu/admin/courses" },
      { name: "Add Course", path: "/piu/admin/add-course" },
      { name: "Course Categories", path: "/piu/admin/course-categories" }
    ]
  },
  {
    title: "All Blogs", icon: <FaBlog />,
    sub: [
      { name: "Blog List", path: "/piu/admin/blog-list" },
      { name: "Add Blog", path: "/piu/admin/add-blog" },
      { name: "Blog Categories", path: "/piu/admin/blog-categories" }
    ]
  },
  {
    title: "All Campus", icon: <FaUniversity />,
    sub: [
      { name: "Campus List", path: "/piu/admin/campus-list" },
      { name: "Add Campus", path: "/piu/admin/add-campus" },
      { name: "Campus Departments", path: "/piu/admin/campus-departments" }
    ]
  },
  {
    title: "All News", icon: <FaNewspaper />,
    sub: [
      { name: "News List", path: "/piu/admin/news-list" },
      { name: "Add News", path: "/piu/admin/add-news" },
      { name: "News Categories", path: "/piu/admin/news-categories" }
    ]
  },
  {
    title: "Curriculums", icon: <FaListAlt />,
    sub: [
      { name: "Curriculum List", path: "/piu/admin/curriculum-list" },
      { name: "Add Curriculum", path: "/piu/admin/add-curriculum" },
      { name: "Curriculum Categories", path: "/piu/admin/curriculum-categories" }
    ]
  },
  {
    title: "Teams", icon: <FaUsersCog />,
    sub: [
      { name: "Team List", path: "/piu/admin/team-list" },
      { name: "Add Team", path: "/piu/admin/add-team" },
      { name: "Team Roles", path: "/piu/admin/team-roles" }
    ]
  },
  {
    title: "Slider", icon: <FaSlidersH />,
    sub: [
      { name: "Slider List", path: "/piu/admin/slider-list" },
      { name: "Add Slider", path: "/piu/admin/add-slider" },
      { name: "Slider Settings", path: "/piu/admin/slider-settings" }
    ]
  },
  {
    title: "MOU Partnership", icon: <FaHandshake />,
    sub: [
      { name: "All MOU", path: "/piu/admin/all-mou" },
      { name: "Add MOU", path: "/piu/admin/add-mou" },
      { name: "MOU Categories", path: "/piu/admin/mou-categories" }
    ]
  },
  {
    title: "Events", icon: <FaCalendarAlt />,
    sub: [
      { name: "Event List", path: "/piu/admin/event-list" },
      { name: "Add Event", path: "/piu/admin/add-event" },
      { name: "Event Categories", path: "/piu/admin/event-categories" }
    ]
  },
  {
    title: "Departments", icon: <FaBuilding />,
    sub: [
      { name: "Department List", path: "/piu/admin/department-list" },
      { name: "Add Department", path: "/piu/admin/add-department" },
      { name: "Department Heads", path: "/piu/admin/department-heads" }
    ]
  },
  {
    title: "Positions", icon: <FaBriefcase />,
    sub: [
      { name: "Position List", path: "/piu/admin/position-list" },
      { name: "Add Position", path: "/piu/admin/add-position" },
      { name: "Position Categories", path: "/piu/admin/position-categories" }
    ]
  },
  {
    title: "Seminar", icon: <FaChalkboardTeacher />,
    sub: [
      { name: "Seminar List", path: "/piu/admin/seminar-list" },
      { name: "Add Seminar", path: "/piu/admin/add-seminar" },
      { name: "Seminar Categories", path: "/piu/admin/seminar-categories" }
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
    title: "Gallery", icon: <FaImages />,
    sub: [
      { name: "Gallery List", path: "/piu/admin/gallery-list" },
      { name: "Add Gallery", path: "/piu/admin/add-gallery" },
      { name: "Gallery Categories", path: "/piu/admin/gallery-categories" }
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
    title: "Students", icon: <FaUserGraduate />,
    sub: [
      { name: "Student List", path: "/piu/admin/student-list" },
      { name: "Add Student", path: "/piu/admin/add-student" },
      { name: "Student Categories", path: "/piu/admin/student-categories" }
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
    title: "Assignments", icon: <FaTasks />,
    sub: [
      { name: "Assignment List", path: "/piu/admin/assignment-list" },
      { name: "Add Assignment", path: "/piu/admin/add-assignment" },
      { name: "Assignment Categories", path: "/piu/admin/assignment-categories" }
    ]
  },
  {
    title: "Course Modules", icon: <FaBook />,
    sub: [
      { name: "Module List", path: "/piu/admin/module-list" },
      { name: "Add Module", path: "/piu/admin/add-module" },
      { name: "Module Categories", path: "/piu/admin/module-categories" }
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

const AdminSidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  return (
    // <aside className="bg-[#001933] text-white fixed top-[84px] left-0 bottom-0 shadow-lg z-40 overflow-y-auto scrollbar-hide">
      <ul className="p-3 space-y-0">
        {menuItems.map((item, index) => {
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
                    className={`transition-transform duration-200 ${openMenu === index ? "rotate-90" : ""} text-xs`}
                  />
                </button>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center justify-between w-full p-2 hover:bg-[#002147] rounded"
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
                    <Link to={subItem.path}>
                      <li
                        key={subIndex}
                        className="p-1 hover:bg-[#002147] rounded cursor-pointer"
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
    // </aside>
  );
};

export default AdminSidebar;




