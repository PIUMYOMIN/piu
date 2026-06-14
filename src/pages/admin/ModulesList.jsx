import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { useAuth } from "../../contexts/AuthContext";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";
import ManagementFilters from "../../components/admin/ManagementFilters";

export default function ModulesList() {
  const { showSuccess, showError, Toast } = useFloatingToast();
  const { user: authUser } = useAuth();
  const currentRole = String(
    authUser?.role?.name ??
      authUser?.role ??
      (Array.isArray(authUser?.roles) ? authUser.roles[0]?.name || authUser.roles[0] : "")
  ).toLowerCase();
  const isAdmin = currentRole === "admin";
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [usageFilter, setUsageFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.modules.list();
      setModules(Array.isArray(data) ? data : []);
    } catch (e) {
      showError(getApiErrorMessage(e, "Failed to load modules"));
      setError(getApiErrorMessage(e, "Failed to load modules"));
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getUsageCount = (module) => {
    return Number(module?.curriculums_count || 0)
      + Number(module?.assignments_count || 0)
      + Number(module?.subjects_count || 0)
      + Number(module?.gradings_count || 0)
      + Number(module?.student_assignments_count || 0);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return modules.filter((m) => {
      const matchesSearch =
        !q ||
        String(m?.name || "").toLowerCase().includes(q) ||
        String(m?.module_code || "").toLowerCase().includes(q);
      const usage = getUsageCount(m);
      const matchesUsage =
        usageFilter === "all" ||
        (usageFilter === "in-use" && usage > 0) ||
        (usageFilter === "unused" && usage === 0);
      return matchesSearch && matchesUsage;
    });
  }, [modules, search, usageFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, usageFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const remove = async (module) => {
    if (!isAdmin) return;
    if (!window.confirm(`Delete module "${module?.name}"?`)) return;
    setError("");
    try {
      await adminApi.modules.remove(module.id);
      await load();
      showSuccess(`Module "${module?.name}" deleted successfully!`);
    } catch (e) {
      showError(getApiErrorMessage(e, "Failed to delete module"));
      setError(getApiErrorMessage(e, "Failed to delete module"));
    }
  };

  const resetFilters = () => {
    setSearch("");
    setUsageFilter("all");
  };

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <Toast />
      <div className="bg-[#002147] p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Modules</h2>
          <p className="text-blue-100 mt-1">Manage all course modules</p>
        </div>
        <Link to="/piu/admin/modules/add" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white">
          + Add Module
        </Link>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <ManagementFilters
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search module name/code..."
          filters={[
            {
              key: "usage",
              value: usageFilter,
              onChange: setUsageFilter,
              options: [
                { value: "all", label: "All Modules" },
                { value: "in-use", label: "In Use" },
                { value: "unused", label: "Unused" },
              ],
            },
          ]}
          onReset={resetFilters}
          summary={loading ? "Loading..." : `Showing ${paginated.length} of ${filtered.length}`}
        />

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Module Name</th>
                <th className="px-4 py-2 border">Module Code</th>
                <th className="px-4 py-2 border">Credit</th>
                <th className="px-4 py-2 border">Used In</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500 border">
                    Loading modules...
                  </td>
                </tr>
              )}

              {!loading &&
                paginated.map((m, index) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="px-4 py-2 border">{m.name}</td>
                    <td className="px-4 py-2 border">{m.module_code}</td>
                    <td className="px-4 py-2 border">{m.credit}</td>
                    <td className="px-4 py-2 border">
                      <span className={getUsageCount(m) > 0 ? "text-amber-700" : "text-gray-500"}>
                        {getUsageCount(m)}
                      </span>
                    </td>
                    <td className="px-4 py-2 border space-x-4">
                      <Link to={`/piu/admin/modules/edit/${m.id}`} className="text-blue-600 hover:underline">
                        Edit
                      </Link>
                      {isAdmin && (
                        <button
                          className="text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => remove(m)}
                          disabled={getUsageCount(m) > 0}
                          title={getUsageCount(m) > 0 ? "Remove related records before deleting this module" : "Delete module"}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 border">
                    No modules found
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
    </div>
  );
}
