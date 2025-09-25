import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt, FaUserCog, FaKey, FaUsers, FaGraduationCap, FaBookOpen,
  FaBlog, FaUniversity, FaNewspaper, FaListAlt, FaUsersCog, FaSlidersH, FaHandshake,
  FaCalendarAlt, FaBuilding, FaBriefcase, FaChalkboardTeacher, FaClock, FaImages,
  FaSuitcase, FaUserGraduate, FaEnvelope, FaTasks, FaBook, FaBookReader, FaChevronRight,
  FaTimes
} from "react-icons/fa";


// ----------------- ADMIN MENU -----------------
export const adminMenu = [
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
    title: "Admission", icon: <FaGraduationCap />, path: "piu/admin/admission",
  },
  {
    title: "All Courses", icon: <FaBookOpen />,
    sub: [
      { name: "Course List", path: "/piu/admin/list" },
      { name: "Add Course", path: "/piu/admin/new" },
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


// ----------------- TEACHER MENU (sample) -----------------
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


// ----------------- STUDENT MENU (sample) -----------------
export const studentMenu = [
  { title: "Dashboard", icon: <FaTachometerAlt />, path: "/piu/student" },
  { title: "Student Profile", icon: <FaUserCog />, path: "/piu/admin/student" },
  {
    title: "My Courses", icon: <FaBookReader />,
    sub: [
      { name: "Enrolled Courses", path: "/piu/student/courses" },
      { name: "Assignments", path: "/piu/student/assignments" },
      { name: "Grades", path: "/piu/student/grades" },
    ]
  },
  {
    title: "Attendance", icon: <FaClock />,
    path: "/piu/student/attendance"
  },
  {
    title: "Messages", icon: <FaEnvelope />,
    sub: [
      { name: "Inbox", path: "/piu/student/inbox" },
      { name: "Sent", path: "/piu/student/sent" },
    ]
  }
];


// ----------------- SIDEBAR COMPONENT -----------------
const AdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const role = "student"

  // Pick menu based on role
  let menuItems = [];
  if (role === "admin") menuItems = adminMenu;
  if (role === "teacher") menuItems = teacherMenu;
  if (role === "student") menuItems = studentMenu;

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-[84px] left-0 bottom-0 w-80 bg-[#001933] text-white z-40 overflow-y-auto scrollbar-hide transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Close button for mobile */}
        <button 
          className="lg:hidden absolute top-4 right-4 p-1 rounded-full bg-[#002147] hover:bg-[#003366]"
          onClick={toggleSidebar}
        >
          <FaTimes size={16} />
        </button>
        
        <ul className="p-3 space-y-0 mt-4 lg:mt-0">
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
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
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
                      <Link 
                        key={subIndex}
                        to={subItem.path}
                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                      >
                        <li className="p-1 hover:bg-[#002147] rounded cursor-pointer">
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

export default AdminSidebar;
