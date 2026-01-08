import React, { useState, useEffect } from "react";
import { FaSpinner, FaSave, FaTimes, FaTag, FaInfoCircle, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import api from "../../api/axios";

const CategoryForm = ({ category = null, onSuccess, onCancel, mode = "create" }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with category data if editing
  useEffect(() => {
    if (category && mode === "edit") {
      setFormData({
        name: category.name || "",
        description: category.description || ""
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        description: ""
      });
    }
    setErrors({});
  }, [category, mode]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    } else if (formData.name.trim().length > 255) {
      newErrors.name = "Category name cannot exceed 255 characters";
    }
    
    if (formData.description && formData.description.trim().length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (mode === "edit" && category) {
        // Update existing category
        await api.put(`/api/v2/course-categories/${category.id}`, formData);
        showToast(`Category "${formData.name}" updated successfully!`, "success");
      } else {
        // Create new category
        await api.post("/api/v2/course-categories", formData);
        showToast(`Category "${formData.name}" created successfully!`, "success");
      }
      
      // Reset form
      setFormData({
        name: "",
        description: ""
      });
      setErrors({});
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("❌ Error saving category:", error);
      
      // Handle validation errors from API
      if (error.response?.status === 422) {
        const apiErrors = error.response.data.errors || {};
        setErrors(apiErrors);
        showToast("Please fix the form errors", "error");
      } else {
        const errorMessage = error.response?.data?.message || "Failed to save category. Please try again.";
        showToast(errorMessage, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const Toast = () => {
    if (!toast) return null;

    const bgColor = toast.type === "success" ? "bg-green-50 border-green-200" : 
                   toast.type === "error" ? "bg-red-50 border-red-200" : 
                   "bg-yellow-50 border-yellow-200";
    
    const textColor = toast.type === "success" ? "text-green-800" : 
                     toast.type === "error" ? "text-red-800" : 
                     "text-yellow-800";
    
    const icon = toast.type === "success" ? <FaCheck className="text-green-500" /> : 
                toast.type === "error" ? <FaExclamationTriangle className="text-red-500" /> : 
                <FaInfoCircle className="text-yellow-500" />;

    return (
      <div className="fixed top-4 right-4 z-50 animate-slideIn">
        <div className={`flex items-center p-4 mb-3 rounded-lg border ${bgColor} ${textColor} shadow-lg max-w-md`}>
          <div className="text-lg mr-3">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Toast />
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-700 p-6 text-white">
          <div className="flex items-center">
            <FaTag className="text-2xl mr-3" />
            <div>
              <h2 className="text-xl font-bold">
                {mode === "edit" ? "Edit Category" : "Create New Category"}
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                {mode === "edit" 
                  ? "Update the category details below" 
                  : "Fill in the details to create a new course category"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Name Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors
                          ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="e.g., Bachelor, Master, Certificate"
                disabled={isSubmitting}
                autoFocus
              />
              {errors.name && (
                <div className="absolute right-3 top-3">
                  <FaExclamationTriangle className="text-red-500" />
                </div>
              )}
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FaExclamationTriangle className="mr-1" size={12} />
                {errors.name}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter a descriptive name for the category (2-255 characters)
            </p>
          </div>

          {/* Description Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors min-h-[100px]
                          ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Describe the category (e.g., Undergraduate degree programs)"
                disabled={isSubmitting}
                rows="4"
              />
              {errors.description && (
                <div className="absolute right-3 top-3">
                  <FaExclamationTriangle className="text-red-500" />
                </div>
              )}
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FaExclamationTriangle className="mr-1" size={12} />
                {errors.description}
              </p>
            )}
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-500">
                Provide additional details about this category
              </p>
              <p className={`text-xs ${formData.description.length > 1000 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.description.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                disabled={isSubmitting}
              >
                <FaTimes className="inline mr-2" />
                Cancel
              </button>
            )}
            
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg hover:from-purple-700 hover:to-indigo-800 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  {mode === "edit" ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  {mode === "edit" ? 'Update Category' : 'Create Category'}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preview Section (Optional) */}
        {formData.name.trim() && (
          <div className="px-6 pb-6">
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                Category Preview
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
                      <FaTag className="text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {formData.name}
                    </h4>
                    {formData.description ? (
                      <p className="mt-1 text-gray-600 text-sm">
                        {formData.description}
                      </p>
                    ) : (
                      <p className="mt-1 text-gray-400 text-sm italic">
                        No description provided
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryForm;