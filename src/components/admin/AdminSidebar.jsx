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
                  <Link 
                    key={subIndex}
                    to={subItem.path}
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
  );
};

export default AdminSidebar;




