import React, { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../api/admin";
import { toStorageUrl } from "../../api/axios";

function getUserRoleLabel(user) {
  const role = user?.role || (Array.isArray(user?.roles) ? user.roles[0] : "");
  return role ? String(role) : "user";
}

function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.[0] || "P";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "I";
  return (first + last).toUpperCase();
}

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState(null); // {mode:'create'|'edit', user, form}
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.users.list();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (
        String(u?.name || "").toLowerCase().includes(q) ||
        String(u?.email || "").toLowerCase().includes(q) ||
        String(u?.phone || "").toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  const openCreate = () => {
    setModal({
      mode: "create",
      user: null,
      form: { name: "", email: "", phone: "", role: "user", password: "", password_confirmation: "" },
    });
  };

  const openEdit = (user) => {
    setModal({
      mode: "edit",
      user,
      form: {
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role: getUserRoleLabel(user),
        password: "",
        password_confirmation: "",
      },
    });
  };

  const closeModal = () => setModal(null);

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setModal((prev) => (prev ? { ...prev, form: { ...prev.form, [name]: value } } : prev));
  };

  const save = async () => {
    if (!modal) return;
    setSaving(true);
    setError("");
    try {
      if (modal.mode === "create") {
        await adminApi.users.create(modal.form);
      } else {
        await adminApi.users.update(modal.user.id, modal.form);
      }
      closeModal();
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (user) => {
    if (!window.confirm(`Delete user "${user?.name || user?.email || user?.id}"?`)) return;
    setError("");
    try {
      await adminApi.users.remove(user.id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete user");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
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

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
          <div className="relative w-full sm:w-96">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name / email / phone..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-600">
            {loading ? "Loading..." : `Showing ${filtered.length} of ${users.length}`}
          </div>
        </div>

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
                filtered.map((user) => {
                  const img = toStorageUrl(user.profile_image) || user.profile_image || "";
                  const role = getUserRoleLabel(user);
                  return (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {img ? (
                          <img
                            src={img}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/80x80?text=PIU";
                            }}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                            {getInitials(user.name)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-3">{user.phone || "—"}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                          {role}
                        </span>
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
                          <button
                            type="button"
                            onClick={() => remove(user)}
                            className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md"
                          >
                            Delete
                          </button>
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
                    <option value="user">user</option>
                    <option value="student">student</option>
                    <option value="teacher">teacher</option>
                    <option value="admin">admin</option>
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