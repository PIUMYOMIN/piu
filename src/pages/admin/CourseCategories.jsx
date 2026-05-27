import React, { useState, useEffect } from "react";
import { 
  FaSpinner, FaPlus, FaEdit, FaTrash, FaSearch, 
  FaTag, FaSort, FaSortUp, FaSortDown
} from "react-icons/fa";
import { adminApi } from "../../api/admin";
import CategoryModal from "./CategoryModal";

const CourseCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminApi.categories.list();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load course categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null, mode = "create") => {
    setSelectedCategory(category);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSuccess = () => {
    fetchCategories(); // Refresh the list
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === "asc"
      ? <FaSortUp className="text-purple-600" />
      : <FaSortDown className="text-purple-600" />;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await adminApi.categories.remove(id);
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(error.response?.data?.message || "Failed to delete category. It might be in use.");
    }
  };

  const filteredCategories = categories
    .filter((category) => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) return true;
      return (
        category.name?.toLowerCase().includes(term) ||
        category.description?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      const aValue = sortConfig.key === "courses_count"
        ? Number(a.courses_count || 0)
        : String(a[sortConfig.key] || "").toLowerCase();
      const bValue = sortConfig.key === "courses_count"
        ? Number(b.courses_count || 0)
        : String(b[sortConfig.key] || "").toLowerCase();

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header and Controls */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Course Categories</h1>
            <p className="text-gray-600 mt-1">Manage your course categories</p>
          </div>
          <button
            onClick={() => handleOpenModal(null, "create")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Category
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>
        <div className="text-sm text-gray-500">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_120px] gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
          <button
            type="button"
            onClick={() => handleSort("name")}
            className="flex items-center gap-2 text-left"
          >
            Category {getSortIcon("name")}
          </button>
          <button
            type="button"
            onClick={() => handleSort("courses_count")}
            className="flex items-center gap-2 text-left"
          >
            Courses {getSortIcon("courses_count")}
          </button>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <FaSpinner className="mr-2 animate-spin" />
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-12 text-center">
            <FaTag className="mx-auto mb-3 text-3xl text-gray-300" />
            <p className="font-medium text-gray-700">No categories found</p>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try a different search term." : "Create your first course category."}
            </p>
          </div>
        ) : (
          filteredCategories.map(category => (
            <div key={category.id} className="grid grid-cols-[1fr_120px_120px] gap-4 border-b border-gray-200 p-4 hover:bg-gray-50">
              <div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                )}
                {category.user?.name && (
                  <p className="text-xs text-gray-400 mt-1">Created by {category.user.name}</p>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-700">
                {category.courses_count || 0}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleOpenModal(category, "edit")}
                  className="rounded-md p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                  title="Edit category"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                  title={category.courses_count > 0 ? "Remove courses before deleting this category" : "Delete category"}
                  disabled={category.courses_count > 0}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
        mode={modalMode}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default CourseCategories;
