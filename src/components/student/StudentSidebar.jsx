import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  FaBookReader, FaUserCog, FaClock, FaEnvelope, FaChevronRight, FaTimes,
} from 'react-icons/fa';
import {
  buildDashboardPath,
  findMenuIndexByTab,
  isDashboardTabActive,
  STUDENT_TABS,
} from '../../utils/dashboardTabs';

export const studentMenu = [
  { title: 'Profile', icon: <FaUserCog />, path: '/piu/student', tab: STUDENT_TABS.PROFILE },
  {
    title: 'My Courses',
    icon: <FaBookReader />,
    tab: STUDENT_TABS.COURSES,
    sub: [
      { name: 'Enrolled Courses', path: '/piu/student/courses', tab: STUDENT_TABS.COURSES },
      { name: 'Assignments', path: '/piu/student/assignments', tab: STUDENT_TABS.ASSIGNMENTS },
      { name: 'Grades', path: '/piu/student/grades', tab: STUDENT_TABS.GRADES },
    ],
  },
  {
    title: 'Attendance',
    icon: <FaClock />,
    path: '/piu/student/attendance',
    tab: STUDENT_TABS.ATTENDANCE,
  },
  {
    title: 'Messages',
    icon: <FaEnvelope />,
    tab: STUDENT_TABS.INBOX,
    sub: [
      { name: 'Inbox', path: '/piu/student/inbox', tab: STUDENT_TABS.INBOX },
      { name: 'Sent', path: '/piu/student/sent', tab: STUDENT_TABS.SENT },
    ],
  },
];

const StudentSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const menuIndex = findMenuIndexByTab(studentMenu, searchParams, location.pathname);
    if (menuIndex >= 0 && studentMenu[menuIndex]?.sub) {
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
          {studentMenu.map((item, index) => {
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

export default StudentSidebar;
