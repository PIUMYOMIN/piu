import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  FaBookOpen, FaTachometerAlt, FaUserCog, FaClock, FaEnvelope, FaChevronRight, FaTimes,
} from 'react-icons/fa';
import {
  buildDashboardPath,
  findMenuIndexByTab,
  isDashboardTabActive,
  TEACHER_TABS,
} from '../../utils/dashboardTabs';

export const teacherMenu = [
  { title: 'Dashboard', icon: <FaTachometerAlt />, path: '/piu/teacher', tab: TEACHER_TABS.DASHBOARD },
  { title: 'Teacher Profile', icon: <FaUserCog />, path: '/piu/teacher/profile', tab: TEACHER_TABS.PROFILE },
  {
    title: 'Courses',
    icon: <FaBookOpen />,
    tab: TEACHER_TABS.COURSES,
    sub: [
      { name: 'My Courses', path: '/piu/teacher/courses', tab: TEACHER_TABS.COURSES },
      { name: 'Create Assignment', path: '/piu/teacher/assignments/create', tab: TEACHER_TABS.CREATE_ASSIGNMENT },
      { name: 'Grade Students', path: '/piu/teacher/grades', tab: TEACHER_TABS.GRADES },
    ],
  },
  {
    title: 'Attendance',
    icon: <FaClock />,
    tab: TEACHER_TABS.ATTENDANCE,
    sub: [
      { name: 'Mark Attendance', path: '/piu/teacher/attendance', tab: TEACHER_TABS.ATTENDANCE },
      { name: 'Attendance Reports', path: '/piu/teacher/attendance-reports', tab: TEACHER_TABS.ATTENDANCE_REPORTS },
    ],
  },
  {
    title: 'Messages',
    icon: <FaEnvelope />,
    tab: TEACHER_TABS.INBOX,
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
        ></div>
      )}

      <aside
        className={`fixed top-[84px] left-0 bottom-0 w-80 bg-[#001933] text-white z-40 overflow-y-auto scrollbar-hide 
                    transition-transform duration-300 ease-in-out 
                    lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
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
            const isItemActive = itemIsActive(item);

            return (
              <li key={item.title} className="border-b border-gray-700">
                {hasSub ? (
                  <button
                    onClick={() => toggleMenu(index)}
                    className={`flex items-center justify-between w-full p-2 rounded ${
                      isItemActive ? 'bg-[#003366]' : 'hover:bg-[#002147]'
                    }`}
                  >
                    <div className="flex items-center text-sm py-2">
                      <span className="mr-3">{item.icon}</span>
                      {item.title}
                    </div>
                    <FaChevronRight
                      className={`transition-transform duration-200 ${
                        openMenu === index ? 'rotate-90' : ''
                      } text-xs`}
                    />
                  </button>
                ) : (
                  <Link
                    to={buildDashboardPath(item.path, item.tab)}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={`flex items-center justify-between w-full p-2 rounded 
                                ${isItemActive ? 'bg-[#003366]' : 'hover:bg-[#002147]'}`}
                  >
                    <div className="flex items-center text-sm py-2">
                      <span className="mr-3">{item.icon}</span>
                      {item.title}
                    </div>
                  </Link>
                )}

                {hasSub && openMenu === index && (
                  <ul className="pl-8 text-sm">
                    {item.sub.map((subItem) => (
                      <Link
                        key={subItem.tab}
                        to={buildDashboardPath(subItem.path, subItem.tab)}
                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                      >
                        <li
                          className={`p-1 rounded cursor-pointer 
                            ${
                              subItemIsActive(subItem)
                                ? 'bg-[#003366]'
                                : 'hover:bg-[#002147]'
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
