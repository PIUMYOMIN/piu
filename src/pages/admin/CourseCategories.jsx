import React, { useState, useEffect } from "react";
import { 
  FaSpinner, FaPlus, FaEdit, FaTrash, FaSearch, 
  FaTag, FaSort, FaSortUp, FaSortDown, FaFilter
} from "react-icons/fa";
import api from "../../api/axios";
import CategoryModal from "./CategoryModal";

const CourseCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v2/course-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await api.delete(`/api/v2/course-categories/${id}`);
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. It might be in use.");
    }
  };

  // ... rest of the CourseCategories component code (sorting, filtering, etc.)

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

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Table content */}
        {categories.map(category => (
          <div key={category.id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(category, "edit")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
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