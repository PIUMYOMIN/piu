import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { FaChevronRight, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { getVisibleAdminMenu } from '../../config/adminMenu';
import { resolveUserRole } from '../../utils/authRouting';
import {
  buildDashboardPath,
  findMenuIndexByTab,
  isDashboardTabActive,
} from '../../utils/dashboardTabs';

const AdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const role = resolveUserRole(user);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [openMenu, setOpenMenu] = useState(null);

  const visibleMenu = useMemo(() => getVisibleAdminMenu(role), [role]);
  const menuTitle = role === 'registrar' ? 'Registrar Menu' : 'Admin Menu';

  useEffect(() => {
    const menuIndex = findMenuIndexByTab(visibleMenu, searchParams, location.pathname);
    if (menuIndex >= 0 && visibleMenu[menuIndex]?.sub) {
      setOpenMenu(menuIndex);
    }
  }, [location.pathname, searchParams, visibleMenu]);

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
        className={`fixed top-16 md:top-18 left-0 bottom-0 w-80 bg-gradient-to-b from-[#001933] to-[#002147] text-white z-40 overflow-y-auto scrollbar-hide 
                    transition-transform duration-300 ease-in-out shadow-lg
                    lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between lg:hidden">
          <div className="font-medium">{menuTitle}</div>
          <button
            className="p-1 rounded-full hover:bg-[#002147]"
            onClick={toggleSidebar}
          >
            <FaTimes size={16} />
          </button>
        </div>

        <ul className="p-4 space-y-1">
          {visibleMenu.map((item, index) => {
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
                              className={`p-2 rounded transition-colors
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

        <div className="p-4 border-t border-gray-700 mt-auto">
          <button
            onClick={() => {
              if (window.innerWidth < 1024) toggleSidebar();
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
