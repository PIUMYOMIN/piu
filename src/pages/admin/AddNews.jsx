import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NewsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [news, setNews] = useState([
    {
      id: 1,
      title: "University Announces New Research Center",
      description: "Groundbreaking research facility to open next semester",
      content: "<p>Welcome to our new research center focused on AI and machine learning!</p>",
      author: "Admin",
      category: "Research",
      date: "2025-01-10",
      image: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      status: "published"
    },
    {
      id: 2,
      title: "Annual Science Fair Results",
      description: "Students showcase innovative projects at science fair",
      content: "<p>Congratulations to all participants in our annual science fair!</p>",
      author: "Editor",
      category: "Events",
      date: "2025-02-05",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      status: "published"
    }
  ]);

  const editingNew = location.state || news.find((n) => n.id === parseInt(id));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    category: "",
    date: "",
    image: null,
    status: "draft"
  });

  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingNew) {
      setFormData({
        title: editingNew.title || "",
        description: editingNew.description || "",
        content: editingNew.content || "",
        author: editingNew.author || "",
        category: editingNew.category || "",
        date: editingNew.date || "",
        image: null,
        status: editingNew.status || "draft"
      });
      if (editingNew.image) {
        setPreview(editingNew.image);
      }
    }
  }, [editingNew]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
    
    if (errors.content) {
      setErrors({
        ...errors,
        content: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "News title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.content.trim() || formData.content === "<p><br></p>") {
      newErrors.content = "Content is required";
    }
    
    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    }
    
    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
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
      console.log(editingNew ? "Updating news:" : "Creating new news:", formData);
      setIsSubmitting(false);
      alert(editingNew ? "News updated successfully!" : "News created successfully!");
      navigate("/piu/admin/news");
    }, 1500);
  };

  const handleCancel = () => {
    navigate("/piu/admin/news");
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const categories = [
    "News",
    "Events",
    "Research",
    "Admissions",
    "Academics",
    "Campus Life",
    "Sports",
    "Alumni"
  ];

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">
          {editingNew ? "Edit News Article" : "Create New News Article"}
        </h2>
        <p className="text-blue-100 mt-1">
          {editingNew 
            ? "Update the news article details below" 
            : "Write a new news article for your institution"
          }
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                News Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter news title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.title 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Enter brief description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.description 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                placeholder="Enter author name"
                value={formData.author}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.author 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                required
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.author}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.category 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.category}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.date 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                required
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.date}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              className="h-64 mb-20"
              placeholder="Write your news content here..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <i className="fas fa-exclamation-circle mr-1"></i>
                {errors.content}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image
            </label>
            <div className="flex items-center space-x-6">
              {preview && (
                <div className="flex-shrink-0">
                  <img
                    src={preview}
                    alt="News preview"
                    className="h-32 w-48 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 5MB. Recommended: 16:9 aspect ratio
                </p>
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
                  {editingNew ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <i className={`fas ${editingNew ? "fa-save" : "fa-plus-circle"} mr-2`}></i>
                  {editingNew ? "Update News" : "Create News"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsForm;