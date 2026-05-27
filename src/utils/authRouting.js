export function resolveUserRole(user) {
  const roleFromField = user?.role?.name || user?.role;
  if (roleFromField) {
    const role = String(roleFromField).toLowerCase();
    return role === "faculty" ? "teacher" : role;
  }

  if (Array.isArray(user?.roles) && user.roles.length > 0) {
    const firstRole = user.roles[0];
    const role = String(firstRole?.name || firstRole).toLowerCase();
    return role === "faculty" ? "teacher" : role;
  }

  return "user";
}

export function getDashboardPathForRole(role) {
  switch (String(role || "").toLowerCase()) {
    case "admin":
    case "registrar":
      return "/piu/admin";
    case "teacher":
      return "/piu/teacher";
    case "student":
      return "/piu/student";
    case "user":
      return "/piu/user";
    default:
      return "/piu/user";
  }
}

export function getDashboardPathForUser(user) {
  return getDashboardPathForRole(resolveUserRole(user));
}
