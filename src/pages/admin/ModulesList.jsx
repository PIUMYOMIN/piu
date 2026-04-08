import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin";

export default function ModulesList() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.modules.list();
      setModules(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load modules");
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return modules;
    return modules.filter((m) => {
      return (
        String(m?.name || "").toLowerCase().includes(q) ||
        String(m?.module_code || "").toLowerCase().includes(q)
      );
    });
  }, [modules, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const remove = async (module) => {
    if (!window.confirm(`Delete module "${module?.name}"?`)) return;
    setError("");
    try {
      await adminApi.modules.remove(module.id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete module");
    }
  };

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
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

        <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search module name/code..."
            className="w-full sm:w-80 border border-gray-300 rounded-lg px-4 py-2"
          />
          <div className="text-sm text-gray-600">
            {loading ? "Loading..." : `Showing ${paginated.length} of ${filtered.length}`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Module Name</th>
                <th className="px-4 py-2 border">Module Code</th>
                <th className="px-4 py-2 border">Credit</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 border">
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
                    <td className="px-4 py-2 border space-x-4">
                      <Link to={`/piu/admin/modules/edit/${m.id}`} className="text-blue-600 hover:underline">
                        Edit
                      </Link>
                      <button className="text-red-600 hover:underline" onClick={() => remove(m)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500 border">
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
