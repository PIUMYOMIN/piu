import React from "react";
import CategoryForm from "./CategoryForm";

const CategoryModal = ({ isOpen, onClose, category = null, mode = "create", onSuccess }) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {mode === "edit" ? "Edit Category" : "Add New Category"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {mode === "edit" 
                ? "Update the category information" 
                : "Create a new course category"
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <CategoryForm 
            category={category}
            onSuccess={handleSuccess}
            onCancel={onClose}
            mode={mode}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;