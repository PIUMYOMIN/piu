export const ACCOUNT_TYPES = {
  STAFF: 'staff',
  STUDENT: 'student',
};

export const STUDENT_DEFAULT_PASSWORD = 'piustudent';

export const STAFF_ROLES = ['admin', 'teacher', 'registrar', 'user'];

export function resolveUserRole(user) {
  const roleFromField = user?.role?.name || user?.role;
  if (roleFromField) {
    const role = String(roleFromField).toLowerCase();
    return role === 'faculty' ? 'teacher' : role;
  }

  if (Array.isArray(user?.roles) && user.roles.length > 0) {
    const firstRole = user.roles[0];
    const role = String(firstRole?.name || firstRole).toLowerCase();
    return role === 'faculty' ? 'teacher' : role;
  }

  return 'user';
}

export function resolveAccountType(user, fallback = ACCOUNT_TYPES.STAFF) {
  if (user?.account_type) {
    return String(user.account_type).toLowerCase();
  }

  if (resolveUserRole(user) === 'student') {
    return ACCOUNT_TYPES.STUDENT;
  }

  return fallback;
}

export function getDashboardPathForRole(role) {
  switch (String(role || '').toLowerCase()) {
    case 'admin':
    case 'registrar':
      return '/piu/admin';
    case 'teacher':
      return '/piu/teacher';
    case 'student':
      return '/piu/student';
    case 'user':
      return '/piu/user';
    default:
      return '/piu/user';
  }
}

export function getDashboardPathForUser(user) {
  return getDashboardPathForRole(resolveUserRole(user));
}

export function getAuthenticatedHomePath(user) {
  const role = resolveUserRole(user);
  const path = getDashboardPathForRole(role);

  if (role === 'student') {
    return `${path}?tab=dashboard`;
  }
  if (role === 'teacher') {
    return `${path}?tab=dashboard`;
  }
  if (role === 'admin' || role === 'registrar') {
    return `${path}?tab=dashboard`;
  }

  return path;
}
