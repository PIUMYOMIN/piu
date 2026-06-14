export const ADMIN_TABS = {
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  CHANGE_PASSWORD: 'change-password',
  USER: 'user',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  ADMISSION: 'admission',
  COURSES: 'courses',
  ADD_COURSE: 'add-course',
  COURSE_CATEGORIES: 'course-categories',
  BLOGS: 'blogs',
  ADD_BLOG: 'add-blog',
  NEWS: 'news',
  ADD_NEWS: 'add-news',
  EVENTS: 'events',
  ADD_EVENT: 'add-event',
  CAMPUS: 'campus',
  ADD_CAMPUS: 'add-campus',
  CURRICULUMS: 'curriculums',
  ADD_CURRICULUM: 'add-curriculum',
  TEAMS: 'teams',
  ADD_TEAM: 'add-team',
  SLIDER: 'slider',
  MOU: 'mou',
  ADD_MOU: 'add-mou',
  DEPARTMENTS: 'departments',
  ADD_DEPARTMENT: 'add-department',
  POSITIONS: 'positions',
  ADD_POSITION: 'add-position',
  SEMINARS: 'seminars',
  ADD_SEMINAR: 'add-seminar',
  STUDENTS: 'students',
  ADD_STUDENT: 'add-student',
  ADD_GRADING: 'add-grading',
  GRADING: 'grading',
  GALLERY: 'gallery',
  ADD_GALLERY: 'add-gallery',
  ASSIGNMENTS: 'assignments',
  ADD_ASSIGNMENT: 'add-assignment',
  MODULES: 'modules',
  ADD_MODULE: 'add-module',
};

export const STUDENT_TABS = {
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  CHANGE_PASSWORD: 'change-password',
  COURSES: 'courses',
  ASSIGNMENTS: 'assignments',
  GRADES: 'grades',
  ATTENDANCE: 'attendance',
  INBOX: 'inbox',
  SENT: 'sent',
};

export const TEACHER_TABS = {
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  COURSES: 'courses',
  CREATE_ASSIGNMENT: 'create-assignment',
  GRADES: 'grades',
  ATTENDANCE: 'attendance',
  ATTENDANCE_REPORTS: 'attendance-reports',
  INBOX: 'inbox',
  SENT: 'sent',
};

export function buildDashboardPath(path, tab) {
  if (!path) return path;
  if (!tab) return path;

  const [pathname, existingQuery = ''] = String(path).split('?');
  const params = new URLSearchParams(existingQuery);
  params.set('tab', tab);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function getActiveDashboardTab(searchParams, fallback = null) {
  return searchParams.get('tab') || fallback;
}

function normalizePath(pathname = '') {
  if (!pathname) return '/';
  return pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
}

function pathMatches(pathname, itemPath) {
  const current = normalizePath(pathname);
  const target = normalizePath(itemPath);
  if (!target) return false;
  return current === target || current.startsWith(`${target}/`);
}

export function isDashboardTabActive({ tab, path, pathname, searchParams }) {
  const activeTab = searchParams.get('tab');

  if (activeTab && tab) {
    return activeTab === tab;
  }

  if (tab && !activeTab && path) {
    return pathMatches(pathname, path);
  }

  if (path) {
    return pathMatches(pathname, path);
  }

  return false;
}

export function findMenuIndexByTab(menu, searchParams, pathname) {
  const activeTab = searchParams.get('tab');
  if (activeTab) {
    const byTab = menu.findIndex(
      (item) =>
        item.tab === activeTab || item.sub?.some((subItem) => subItem.tab === activeTab)
    );
    if (byTab >= 0) return byTab;
  }

  return menu.findIndex(
    (item) =>
      pathMatches(pathname, item.path) ||
      item.sub?.some((subItem) => pathMatches(pathname, subItem.path))
  );
}
