import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  FaBook, FaBookOpen, FaChalkboardTeacher, FaChevronRight, FaClock,
  FaEnvelope, FaTachometerAlt, FaTimes, FaUserCog, FaUserGraduate, FaTasks,
} from 'react-icons/fa';
import {
  buildDashboardPath,
  findMenuIndexByTab,
  isDashboardTabActive,
  TEACHER_TABS,
} from '../../utils/dashboardTabs';
import { useAuth } from '../../contexts/AuthContext';

export const teacherMenu = [
  { title: 'Dashboard', icon: <FaTachometerAlt />, path: '/piu/teacher', tab: TEACHER_TABS.DASHBOARD },
  { title: 'Profile', icon: <FaUserCog />, path: '/piu/teacher/profile', tab: TEACHER_TABS.PROFILE },
  {
    title: 'Courses',
    icon: <FaBookOpen />,
    sub: [
      { name: 'My Courses', path: '/piu/teacher/courses', tab: TEACHER_TABS.COURSES },
      { name: 'Course Modules', path: '/piu/teacher/modules', tab: 'modules' },
    ],
  },
  {
    title: 'Assignments',
    icon: <FaTasks />,
    sub: [
      { name: 'Assignment List', path: '/piu/teacher/assignments', tab: 'assignments' },
    ],
  },
  {
    title: 'Students',
    icon: <FaUserGraduate />,
    sub: [
      { name: 'All Students', path: '/piu/teacher/students', tab: 'students' },
      { name: 'Grade Students', path: '/piu/teacher/grades', tab: TEACHER_TABS.GRADES },
    ],
  },
  {
    title: 'Attendance',
    icon: <FaClock />,
    sub: [
      { name: 'Mark Attendance', path: '/piu/teacher/attendance', tab: TEACHER_TABS.ATTENDANCE },
    ],
  },
  {
    title: 'Messages',
    icon: <FaEnvelope />,
    sub: [
      { name: 'Inbox', path: '/piu/teacher/inbox', tab: TEACHER_TABS.INBOX },
      { name: 'Sent', path: '/piu/teacher/sent', tab: TEACHER_TABS.SENT },
    ],
  },
];

const TeacherSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { logout } = useAuth();

  useEffect(() => {
    const menuIndex = findMenuIndexByTab(teacherMenu, searchParams, location.pathname);
    if (menuIndex >= 0 && teacherMenu[menuIndex]?.sub) {
      setOpenMenu(menuIndex);
    }
  }, [location.pathname, searchParams]);

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const itemIsActive = (item) => {
    if (item.sub) {
      return item.sub.some((subItem) =>
        isDashboardTabActive({
          tab: subItem.tab,
          path: subItem.path,
          pathname: location.pathname,
          searchParams,
        })
      );
    }
    return isDashboardTabActive({
      tab: item.tab,
      path: item.path,
      pathname: location.pathname,
      searchParams,
    });
  };

  const subItemIsActive = (subItem) =>
    isDashboardTabActive({
      tab: subItem.tab,
      path: subItem.path,
      pathname: location.pathname,
      searchParams,
    });

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-[84px] left-0 bottom-0 w-80 bg-gradient-to-b from-[#001933] to-[#002147] text-white z-40 overflow-y-auto scrollbar-hide
                    transition-transform duration-300 ease-in-out shadow-lg
                    lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between lg:hidden">
          <div className="font-medium text-sm">Teacher Menu</div>
          <button className="p-1 rounded-full hover:bg-[#002147]" onClick={toggleSidebar}>
            <FaTimes size={16} />
          </button>
        </div>

        <ul className="p-4 space-y-1">
          {teacherMenu.map((item, index) => {
            const hasSub = !!item.sub;
            const isItemActive = itemIsActive(item);

            return (
              <li key={item.title} className="mb-1">
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
                          openMenu === index ? 'rotate-90' : ''
                        } text-xs`}
                      />
                    </button>

                    {openMenu === index && (
                      <ul className="ml-10 mt-1 space-y-1 border-l border-gray-700 pl-4">
                        {item.sub.map((subItem) => (
                          <Link
                            key={subItem.tab}
                            to={buildDashboardPath(subItem.path, subItem.tab)}
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                          >
                            <li
                              className={`p-2 rounded text-sm transition-colors
                                        ${
                                          subItemIsActive(subItem)
                                            ? 'bg-[#003366] text-white'
                                            : 'hover:bg-[#002147] text-gray-300'
                                        }`}
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
                    to={buildDashboardPath(item.path, item.tab)}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  >
                    <div
                      className={`flex items-center w-full p-3 rounded-lg transition-all
                                ${isItemActive ? 'bg-[#003366]' : 'hover:bg-[#002147]'}`}
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

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              if (window.innerWidth < 1024) toggleSidebar();
              logout();
            }}
            className="flex items-center w-full p-3 rounded-lg hover:bg-red-900/20 text-red-300 transition-colors"
          >
            <span className="mr-3 text-sm">⏻</span>
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default TeacherSidebar;
