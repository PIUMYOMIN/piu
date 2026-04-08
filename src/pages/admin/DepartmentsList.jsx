import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminApi from "../../api/admin";
import { useAuth } from "../../contexts/AuthContext";

export default function DepartmentList() {
  const { user: authUser } = useAuth();
  const currentRole = String(
    authUser?.role?.name ??
      authUser?.role ??
      (Array.isArray(authUser?.roles) ? authUser.roles[0]?.name || authUser.roles[0] : "")
  ).toLowerCase();
  const isAdmin = currentRole === "admin";
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.departments.list();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load departments");
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter(
      (d) =>
        String(d?.name || "").toLowerCase().includes(q) ||
        String(d?.code || "").toLowerCase().includes(q)
    );
  }, [departments, searchTerm]);

  const remove = async (department) => {
    if (!isAdmin) return;
    if (!window.confirm(`Delete department "${department?.name}"?`)) return;
    try {
      await adminApi.departments.remove(department.id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete department");
    }
  };

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">Department Management</h2>
        <p className="text-blue-100 mt-1">Manage academic departments</p>
      </div>

      <div className="p-6">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-full sm:w-72 border border-gray-300 rounded-lg"
          />
          <Link to="/piu/admin/departments/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Add Department
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Description</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{dept.name}</td>
                    <td className="px-4 py-3 max-w-md truncate">{dept.description || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/piu/admin/departments/edit/${dept.id}`, { state: dept })}
                          className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        {isAdmin && (
                          <button onClick={() => remove(dept)} className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded">
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
