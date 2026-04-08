import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/admin";
import { toStorageUrl } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

export default function BlogsList() {
  const { user: authUser } = useAuth();
  const currentRole = String(
    authUser?.role?.name ??
      authUser?.role ??
      (Array.isArray(authUser?.roles) ? authUser.roles[0]?.name || authUser.roles[0] : "")
  ).toLowerCase();
  const isAdmin = currentRole === "admin";
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.blogs.list();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (b) =>
        String(b?.title || "").toLowerCase().includes(q) ||
        String(b?.description || "").toLowerCase().includes(q)
    );
  }, [blogs, search]);

  const remove = async (blog) => {
    if (!isAdmin) return;
    if (!window.confirm(`Delete blog "${blog?.title}"?`)) return;
    try {
      await adminApi.blogs.remove(blog.id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete blog");
    }
  };

  const toggleStatus = async (blog) => {
    try {
      await adminApi.blogs.toggleActive(blog.id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to toggle status");
    }
  };

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <p className="text-blue-100 mt-1">Manage and organize blog posts</p>
      </div>

      <div className="p-6">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="flex justify-between items-center mb-6 gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs..."
            className="px-4 py-2 w-full sm:w-72 border border-gray-300 rounded-lg"
          />
          <button onClick={() => navigate("/piu/admin/add-blog")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            New Blog
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Title</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Description</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Image</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Status</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{blog.title}</td>
                    <td className="px-4 py-3 max-w-md truncate">{blog.description}</td>
                    <td className="px-4 py-3">
                      <img
                        src={toStorageUrl(blog.image) || blog.image || "https://via.placeholder.com/100x60?text=Blog"}
                        alt={blog.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${blog.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {blog.is_active ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => toggleStatus(blog)} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
                          {blog.is_active ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => navigate(`/piu/admin/add-blog/edit/${blog.id}`)}
                          className="px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700"
                        >
                          Edit
                        </button>
                        {isAdmin && (
                          <button onClick={() => remove(blog)} className="px-3 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700">
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No blogs found
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
