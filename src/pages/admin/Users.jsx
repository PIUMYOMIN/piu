import React, { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../api/admin";
import { useAuth } from "../../contexts/AuthContext";
import ProfileAvatar from "../../components/common/ProfileAvatar";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";
import ManagementFilters from "../../components/admin/ManagementFilters";

function normalizeRole(role) {
  const v = String(role || "").toLowerCase();
  return v === "faculty" ? "teacher" : v;
}

function getUserRoleLabel(user) {
  const role =
    user?.role?.name ||
    user?.role ||
    (Array.isArray(user?.roles) ? user.roles[0]?.name || user.roles[0] : "");
  return normalizeRole(role || "user");
}

function Users() {
  const { user: authUser } = useAuth();
  const { showSuccess, showError, Toast } = useFloatingToast();
  const currentRole = String(
    authUser?.role?.name ??
      authUser?.role ??
      (Array.isArray(authUser?.roles) ? authUser.roles[0]?.name || authUser.roles[0] : "")
  ).toLowerCase();
  const isAdmin = currentRole === "admin";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [updatingRoleId, setUpdatingRoleId] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);

  const [modal, setModal] = useState(null); // {mode:'create'|'edit', user, form}
  const [saving, setSaving] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [data, roles] = await Promise.all([adminApi.users.list(), adminApi.roles.list()]);
      setUsers(Array.isArray(data) ? data : []);
      setAvailableRoles(Array.isArray(roles) ? roles : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load users");
      showError(getApiErrorMessage(e, "Failed to load users"));
      setUsers([]);
      setAvailableRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    adminApi.courses.list().then((data) => {
      setAllCourses(Array.isArray(data) ? data : []);
    }).catch(() => setAllCourses([]));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        String(u?.name || "").toLowerCase().includes(q) ||
        String(u?.email || "").toLowerCase().includes(q) ||
        String(u?.phone || "").toLowerCase().includes(q);
      const matchesRole =
        roleFilter === "all" || getUserRoleLabel(u) === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  const roleOptions = useMemo(() => {
    const roles = [...new Set(users.map((u) => getUserRoleLabel(u)).filter(Boolean))].sort();
    return [
      { value: "all", label: "All Roles" },
      ...roles.map((role) => ({ value: role, label: role.charAt(0).toUpperCase() + role.slice(1) })),
    ];
  }, [users]);

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("all");
  };

  const openCreate = () => {
    setModal({
      mode: "create",
      user: null,
      form: {
        name: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
        password_confirmation: "",
        assignedCourseIds: [],
      },
    });
  };

  const openEdit = async (user) => {
    const role = getUserRoleLabel(user);
    let assignedCourseIds = [];
    if (role === "teacher") {
      setLoadingCourses(true);
      try {
        const res = await adminApi.users.assignedCourses(user.id);
        assignedCourseIds = (Array.isArray(res?.course_ids) ? res.course_ids : []).map(String);
      } catch {
        assignedCourseIds = [];
      } finally {
        setLoadingCourses(false);
      }
    }
    setModal({
      mode: "edit",
      user,
      form: {
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role,
        password: "",
        password_confirmation: "",
        assignedCourseIds,
      },
    });
  };

  const closeModal = () => setModal(null);

  const roleNames = useMemo(() => {
    const fromApi = (availableRoles || [])
      .map((r) => normalizeRole(r?.name || r))
      .filter(Boolean);
    const base = ["user", "student", "teacher", "registrar", "admin"];
    return Array.from(new Set([...base, ...fromApi]));
  }, [availableRoles]);

  const hasTeacherInApi = (availableRoles || []).some(
    (r) => String(r?.name || r || "").toLowerCase() === "teacher"
  );
  const hasFacultyInApi = (availableRoles || []).some(
    (r) => String(r?.name || r || "").toLowerCase() === "faculty"
  );

  const toApiRole = (role) => {
    const normalized = normalizeRole(role);
    if (normalized === "teacher" && !hasTeacherInApi && hasFacultyInApi) return "faculty";
    return normalized;
  };

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setModal((prev) => {
      if (!prev) return prev;
      const nextForm = { ...prev.form, [name]: value };
      if (name === "role" && normalizeRole(value) !== "teacher") {
        nextForm.assignedCourseIds = [];
      }
      return { ...prev, form: nextForm };
    });
  };

  const toggleAssignedCourse = (courseId) => {
    const key = String(courseId);
    setModal((prev) => {
      if (!prev) return prev;
      const current = new Set(prev.form.assignedCourseIds || []);
      if (current.has(key)) current.delete(key);
      else current.add(key);
      return { ...prev, form: { ...prev.form, assignedCourseIds: [...current] } };
    });
  };

  const save = async () => {
    if (!modal) return;
    setSaving(true);
    setError("");
    try {
      const payload = { ...modal.form, role: toApiRole(modal.form.role) };
      delete payload.assignedCourseIds;

      let userId = modal.user?.id;
      if (modal.mode === "create") {
        const created = await adminApi.users.create(payload);
        userId = created?.user?.id ?? created?.id;
        showSuccess("User created successfully!");
      } else {
        await adminApi.users.update(modal.user.id, payload);
        userId = modal.user.id;
        showSuccess("User updated successfully!");
      }

      if (normalizeRole(modal.form.role) === "teacher" && userId) {
        const courseIds = (modal.form.assignedCourseIds || []).map((id) => Number(id)).filter(Boolean);
        await adminApi.users.syncAssignedCourses(userId, courseIds);
      }

      closeModal();
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to save user");
      showError(getApiErrorMessage(e, "Failed to save user"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (user) => {
    if (!isAdmin) return;
    if (!window.confirm(`Delete user "${user?.name || user?.email || user?.id}"?`)) return;
    setError("");
    try {
      await adminApi.users.remove(user.id);
      showSuccess("User deleted successfully!");
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete user");
      showError(getApiErrorMessage(e, "Failed to delete user"));
    }
  };

  const assignRole = async (user, nextRole) => {
    setUpdatingRoleId(user.id);
    setError("");
    try {
      await adminApi.users.update(user.id, { role: toApiRole(nextRole) });
      showSuccess("User role updated successfully!");
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to assign role");
      showError(getApiErrorMessage(e, "Failed to assign role"));
    } finally {
      setUpdatingRoleId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Toast />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 mb-2 bg-[#002147] text-white rounded-t-lg">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <div className="text-blue-100 text-sm mt-1">Manage users (create, update, delete)</div>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-semibold"
        >
          + New User
        </button>
      </div>

      <div className="p-4">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <ManagementFilters
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name / email / phone..."
          filters={[
            {
              key: "role",
              value: roleFilter,
              onChange: setRoleFilter,
              options: roleOptions,
            },
          ]}
          onReset={resetFilters}
          summary={
            loading
              ? "Loading..."
              : `Showing ${paginatedUsers.length} of ${filtered.length} (total ${users.length})`
          }
        />

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedUsers.map((user) => {
                  const role = getUserRoleLabel(user);
                  return (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <ProfileAvatar user={user} size="sm" />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-3">{user.phone || "—"}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={role}
                            onChange={(e) => assignRole(user, e.target.value)}
                            disabled={updatingRoleId === user.id}
                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                          >
                            {roleNames.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                          {updatingRoleId === user.id && <span className="text-xs text-blue-600">Updating...</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(user)}
                            className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md"
                          >
                            Edit
                          </button>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => remove(user)}
                              className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <div>
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
            <div className="bg-[#002147] text-white p-5">
              <div className="text-lg font-bold">{modal.mode === "create" ? "New User" : "Edit User"}</div>
              <div className="text-blue-100 text-sm mt-1">Fill the fields and save.</div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    name="name"
                    value={modal.form.name}
                    onChange={onFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={modal.form.role}
                    onChange={onFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {roleNames.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={modal.form.email}
                    onChange={onFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    name="phone"
                    value={modal.form.phone}
                    onChange={onFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {modal.mode === "edit" ? "(optional)" : ""}
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={modal.form.password}
                    onChange={onFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                  <input
                    name="password_confirmation"
                    type="password"
                    value={modal.form.password_confirmation}
                    onChange={onFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                {normalizeRole(modal.form.role) === "teacher" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned Programs
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Select which programs this teacher can access. They will only see students, modules, assignments, and grades for these programs.
                    </p>
                    {loadingCourses ? (
                      <p className="text-sm text-gray-500">Loading program assignments…</p>
                    ) : allCourses.length ? (
                      <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 p-3 space-y-2">
                        {allCourses.map((course) => {
                          const checked = (modal.form.assignedCourseIds || []).includes(String(course.id));
                          return (
                            <label key={course.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleAssignedCourse(course.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span>{course.title}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No programs available.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;