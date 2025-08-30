import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function AddMOU() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingMou = location.state?.mou || null;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file: null,
    status: "draft",
    startDate: "",
    endDate: "",
    partner: "",
    category: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (editingMou) {
      setFormData({
        name: editingMou.name || "",
        description: editingMou.description || "",
        file: null,
        status: editingMou.status || "draft",
        startDate: editingMou.startDate || "",
        endDate: editingMou.endDate || "",
        partner: editingMou.partner || "",
        category: editingMou.category || ""
      });
      
      if (editingMou.imageUrl) {
        setPreviewUrl(editingMou.imageUrl);
      }
    }
  }, [editingMou]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "file" && files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, file });
      
      // Create preview for image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
    
    if (errors.description) {
      setErrors({
        ...errors,
        description: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "MOU name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.partner.trim()) {
      newErrors.partner = "Partner organization is required";
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("MOU submitted:", formData);
      setIsSubmitting(false);
      alert(editingMou ? "MOU Updated Successfully!" : "MOU Added Successfully!");
      navigate("/piu/admin/mous");
    }, 1500);
  };

  const handleCancel = () => {
    navigate("/piu/admin/mous");
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">
          {editingMou ? "Edit MOU" : "Add New MOU"}
        </h2>
        <p className="text-blue-100 mt-1">
          {editingMou 
            ? "Update the Memorandum of Understanding details" 
            : "Create a new Memorandum of Understanding with partner organizations"
          }
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* MOU Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              MOU Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                errors.name 
                  ? "border-red-500 focus:ring-red-200" 
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Enter MOU name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <i className="fas fa-exclamation-circle mr-1"></i>
                {errors.name}
              </p>
            )}
          </div>
            
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              value={formData.description}
              onChange={handleDescriptionChange}
              theme="snow"
              modules={modules}
              className={`h-48 mb-12 ${errors.description ? 'ql-error' : ''}`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <i className="fas fa-exclamation-circle mr-1"></i>
                {errors.description}
              </p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Upload MOU Document/Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="mt-2">
                    <img
                      src={previewUrl}
                      alt="MOU preview"
                      className="mx-auto h-32 w-auto object-contain"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Image preview
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="file"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file"
                          name="file"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, application/pdf"
                          onChange={handleChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  {editingMou ? "Updating..." : "Submitting..."}
                </>
              ) : (
                <>
                  <i className={`fas ${editingMou ? "fa-save" : "fa-file-contract"} mr-2`}></i>
                  {editingMou ? "Update MOU" : "Add MOU"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMOU;