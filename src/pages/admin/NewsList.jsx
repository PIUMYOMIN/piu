import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/admin";
import { toStorageUrl } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { useConfirmDelete } from "../../contexts/ConfirmContext";
import { getApiErrorMessage } from "../../utils/apiErrors";
import ManagementFilters from "../../components/admin/ManagementFilters";
import StatusToggle, { parseIsActive } from "../../components/admin/StatusToggle";

export default function NewsList() {
  const { user: authUser } = useAuth();
  const { showSuccess, showError, Toast } = useFloatingToast();
  const confirmDeleteAction = useConfirmDelete();
  const currentRole = String(
    authUser?.role?.name ??
      authUser?.role ??
      (Array.isArray(authUser?.roles) ? authUser.roles[0]?.name || authUser.roles[0] : "")
  ).toLowerCase();
  const isAdmin = currentRole === "admin";
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [togglingId, setTogglingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.news.list();
      setNews(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(getApiErrorMessage(e, "Failed to load news"));
      showError(getApiErrorMessage(e, "Failed to load news"));
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return news.filter((item) => {
      const matchesSearch =
        !q ||
        String(item?.title || "").toLowerCase().includes(q) ||
        String(item?.body || "").toLowerCase().includes(q);
      const isActive = parseIsActive(item?.is_active);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);
      return matchesSearch && matchesStatus;
    });
  }, [news, search, statusFilter]);

  const remove = async (item) => {
    const ok = await confirmDeleteAction({ itemName: item?.title, itemType: "news article" });
    if (!ok) return;
    try {
      await adminApi.news.remove(item.id);
      showSuccess(`"${item.title}" deleted successfully!`);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, "Failed to delete news"));
      showError(getApiErrorMessage(e, "Failed to delete news"));
    }
  };

  const toggleStatus = async (item) => {
    if (togglingId === item.id) return;
    setTogglingId(item.id);
    const wasActive = parseIsActive(item.is_active);
    try {
      const response = await adminApi.news.toggleActive(item.id);
      const nextActive = parseIsActive(response?.data?.is_active ?? !wasActive);
      setNews((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, is_active: nextActive } : row))
      );
      showSuccess(
        `"${item.title}" ${nextActive ? "published" : "unpublished"} successfully!`
      );
    } catch (e) {
      showError(getApiErrorMessage(e, "Failed to update news status"));
    } finally {
      setTogglingId(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <Toast />
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">News Management</h2>
        <p className="text-blue-100 mt-1">Manage news articles and announcements</p>
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
          searchPlaceholder="Search news..."
          showStatus
          statusValue={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Published" },
            { value: "inactive", label: "Draft" },
          ]}
          onReset={resetFilters}
          actions={
            <button
              type="button"
              onClick={() => navigate("/piu/admin/add-news")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Add News
            </button>
          }
        />

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Title</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Author</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Image</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Status</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-gray-500">
                    Loading news...
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((item) => {
                  const isActive = parseIsActive(item.is_active);
                  const img = toStorageUrl(item.image) || item.image;
                  return (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.user?.name || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {img ? (
                          <img src={img} alt={item.title} className="w-12 h-12 rounded object-cover" />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusToggle
                          checked={isActive}
                          loading={togglingId === item.id}
                          onChange={() => toggleStatus(item)}
                          activeLabel="Published"
                          inactiveLabel="Draft"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/piu/admin/add-news/edit/${item.id}`)}
                            className="px-3 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => remove(item)}
                              className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100"
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
                  <td colSpan="5" className="px-4 py-10 text-center text-gray-500">
                    No news articles found.
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
