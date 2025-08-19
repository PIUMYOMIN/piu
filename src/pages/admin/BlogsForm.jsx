import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // get blog id for edit

  const [blogs, setBlogs] = useState([
    // This can be replaced by API or context
    {
      id: 1,
      title: "First Blog",
      description: "Introduction to our website",
      content: "<p>Welcome to our site!</p>",
      author: "Admin",
      category: "General",
      date: "2025-01-10",
      image: "https://via.placeholder.com/50"
    },
    {
      id: 2,
      title: "Second Blog",
      description: "Updates and news",
      content: "<p>Latest updates here</p>",
      author: "Editor",
      category: "News",
      date: "2025-02-05",
      image: "https://via.placeholder.com/50"
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
    image: ""
  });

  useEffect(() => {
    if (editingBlog) {
      setFormData(editingBlog);
    }
  }, [editingBlog]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: URL.createObjectURL(files[0]) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingBlog) {
      console.log("Updating blog", formData);
      // Update in API or state
    } else {
      console.log("Creating new blog", formData);
      // Add to API or state
    }

    navigate("/piu/admin/blogs");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6">
        {editingBlog ? "Edit Blog" : "New Blog"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block mb-1">Content</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            className="bg-white"
            placeholder="Write your blog content..."
          />
        </div>
        <div>
          <label className="block mb-1">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Image</label>
          <input type="file" name="image" onChange={handleChange} />
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="w-20 h-20 mt-2 object-cover rounded"
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingBlog ? "Update Blog" : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default BlogsForm;
