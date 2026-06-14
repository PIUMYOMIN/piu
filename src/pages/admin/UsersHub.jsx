import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Users from './Users';
import UserRoles from './UserRoles';
import PermissionsPage from './PermissionsPage';
import { ADMIN_TABS } from '../../utils/dashboardTabs';

const USER_TABS = [
  { id: ADMIN_TABS.USER, label: 'All Users' },
  { id: ADMIN_TABS.ROLES, label: 'User Roles' },
  { id: ADMIN_TABS.PERMISSIONS, label: 'User Permissions' },
];

export default function UsersHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || ADMIN_TABS.USER;
  const activeTab = USER_TABS.some((item) => item.id === tab) ? tab : ADMIN_TABS.USER;

  const setTab = (nextTab) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('tab', nextTab);
      return params;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {USER_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              activeTab === item.id
                ? 'bg-[#002147] text-white border-[#002147]'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {activeTab === ADMIN_TABS.USER && <Users />}
      {activeTab === ADMIN_TABS.ROLES && <UserRoles />}
      {activeTab === ADMIN_TABS.PERMISSIONS && <PermissionsPage />}
    </div>
  );
}
