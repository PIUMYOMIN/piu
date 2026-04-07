import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { toStorageUrl } from "../../api/axios";

const GalleryList = () => {
  const navigate = useNavigate();

  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.gallery.list();
      setGallery(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load gallery");
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = (id) => {
    navigate(`/piu/admin/gallery/add/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    setError("");
    try {
      await adminApi.gallery.remove(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete image");
    }
  };

  const toggleStatus = async (id) => {
    setError("");
    try {
      await adminApi.gallery.toggleActive(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to update status");
    }
  };

  // Filter gallery items based on search and status filter
  const filteredGallery = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return gallery.filter((item) => {
      const tag = String(item.image_tag || "");
      const matchesSearch = !q || tag.toLowerCase().includes(q);

      const isActive =
        typeof item.is_active === "boolean"
          ? item.is_active
          : String(item.is_active ?? "").toLowerCase() === "true";

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);

      return matchesSearch && matchesStatus;
    });
  }, [gallery, searchTerm, statusFilter]);

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <p className="text-blue-100 mt-1">Manage your gallery images and banners</p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search by tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div className="relative w-full sm:w-40">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-filter text-gray-400"></i>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate("/piu/admin/gallery/add")}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full sm:w-auto"
          >
            <i className="fas fa-plus-circle mr-2"></i>
            Add Image
          </button>
        </div>

        {/* Gallery Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link 1
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link 2
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    Loading gallery...
                  </td>
                </tr>
              )}

              {!loading && filteredGallery.length > 0 ? (
                filteredGallery.map((item, index) => {
                  const isActive =
                    typeof item.is_active === "boolean"
                      ? item.is_active
                      : String(item.is_active ?? "").toLowerCase() === "true";
                  const img = toStorageUrl(item.image) || item.image || "";
                  return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                        {img ? (
                          <img 
                            src={img} 
                            alt={item.image_tag || "Gallery"} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/160x120?text=PIU";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <i className="fas fa-image text-xl"></i>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.image_tag}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 truncate max-w-xs">
                      {item.link1 ? (
                        <a href={item.link1} className="hover:underline" target="_blank" rel="noopener noreferrer">
                          {item.link1}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 truncate max-w-xs">
                      {item.link2 ? (
                        <a href={item.link2} className="hover:underline" target="_blank" rel="noopener noreferrer">
                          {item.link2}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                          title="Edit image"
                        >
                          <i className="fas fa-edit mr-1"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                          title="Delete image"
                        >
                          <i className="fas fa-trash-alt mr-1"></i>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              ) : (
                !loading && (
                  <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <i className="fas fa-image text-4xl text-gray-300 mb-3"></i>
                      <p className="text-lg font-medium">No gallery images found</p>
                      <p className="text-sm mt-1">
                        {searchTerm || statusFilter !== "all" 
                          ? "Try adjusting your search or filters" 
                          : "Get started by adding your first image"
                        }
                      </p>
                    </div>
                  </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredGallery.length} of {gallery.length} images
        </div>
      </div>
    </div>
  );
};

export default GalleryList;