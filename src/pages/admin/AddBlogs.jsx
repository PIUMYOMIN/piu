import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Getting Started with React Development",
      description: "A comprehensive guide for beginners starting with React.js",
      content: "<p>Welcome to React development! This guide will help you get started with modern web development.</p>",
      author: "John Developer",
      category: "Technology",
      date: "2025-01-10",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      status: "published",
      tags: ["react", "javascript", "webdev"]
    },
    {
      id: 2,
      title: "The Future of Artificial Intelligence",
      description: "Exploring the latest trends and future possibilities in AI",
      content: "<p>Artificial Intelligence is transforming industries and creating new opportunities.</p>",
      author: "Dr. Sarah Chen",
      category: "AI",
      date: "2025-02-05",
      image: "https://images.unsplash.com/photo-1677442135135-416f8aa26a5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      status: "published",
      tags: ["ai", "machine learning", "technology"]
    }
  ]);

  const editingBlog = location.state || blogs.find((b) => b.id === parseInt(id));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    category: "",
    date: "",
    image: null,
    status: "draft",
    tags: ""
  });

  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingBlog) {
      setFormData({
        title: editingBlog.title || "",
        description: editingBlog.description || "",
        content: editingBlog.content || "",
        author: editingBlog.author || "",
        category: editingBlog.category || "",
        date: editingBlog.date || "",
        image: null,
        status: editingBlog.status || "draft",
        tags: editingBlog.tags ? editingBlog.tags.join(", ") : ""
      });
      if (editingBlog.image) {
        setPreview(editingBlog.image);
      }
    }
  }, [editingBlog]);

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
      newErrors.title = "Blog title is required";
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
      console.log(editingBlog ? "Updating blog:" : "Creating new blog:", formData);
      setIsSubmitting(false);
      alert(editingBlog ? "Blog updated successfully!" : "Blog created successfully!");
      navigate("/piu/admin/blogs");
    }, 1500);
  };

  const handleCancel = () => {
    navigate("/piu/admin/blogs");
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
    "Technology",
    "AI",
    "Web Development",
    "Data Science",
    "Programming",
    "Design",
    "Business",
    "Education",
    "Lifestyle",
    "Travel"
  ];

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">
          {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
        </h2>
        <p className="text-blue-100 mt-1">
          {editingBlog 
            ? "Update your blog post details below" 
            : "Share your thoughts and ideas with a new blog post"
          }
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter blog title"
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
                placeholder="Enter brief description that will appear in blog listings"
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
                Publish Date <span className="text-red-500">*</span>
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

            {/* Tags */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                placeholder="Enter tags separated by commas (e.g., react, javascript, web)"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate tags with commas for better categorization
              </p>
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
              className="h-96 mb-24"
              placeholder="Write your blog content here..."
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
                    alt="Blog preview"
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
                  {editingBlog ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <i className={`fas ${editingBlog ? "fa-save" : "fa-edit"} mr-2`}></i>
                  {editingBlog ? "Update Blog" : "Create Blog"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogsForm;