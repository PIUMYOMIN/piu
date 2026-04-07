import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { toStorageUrl } from "../../utils/api";

const AddGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    image_tag: "",
    link1: "",
    link2: "",
    image: null,
    is_active: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // Prefill when editing
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        if (id) {
          const g = await adminApi.gallery.get(id);
          if (!mounted) return;
          setFormData({
            image_tag: g?.image_tag || "",
            link1: g?.link1 || "",
            link2: g?.link2 || "",
            image: null,
            is_active: typeof g?.is_active === "boolean" ? g.is_active : true,
          });
          setImagePreview(toStorageUrl(g?.image) || g?.image || "");
        }
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load gallery item");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files?.[0] || null;
      setFormData({ ...formData, [name]: file });
      if (file) setImagePreview(URL.createObjectURL(file));
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const fd = new FormData();
      fd.append("image_tag", formData.image_tag);
      if (formData.link1) fd.append("link1", formData.link1);
      if (formData.link2) fd.append("link2", formData.link2);
      fd.append("is_active", formData.is_active ? "1" : "0");
      if (formData.image instanceof File) fd.append("image", formData.image);

      if (id) await adminApi.gallery.update(id, fd);
      else await adminApi.gallery.create(fd);

      navigate("/piu/admin/gallery");
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || "Failed to save gallery item");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-[#002147] text-white px-5 py-3 rounded-t-lg shadow-md">
        <h2 className="text-xl font-semibold flex items-center">
          <i className="fas fa-images mr-2"></i>
          {id ? "Edit Gallery Item" : "Add New Gallery Item"}
        </h2>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-b-lg shadow-md p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading form...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Tag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Tag <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="image_tag"
              value={formData.image_tag}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a descriptive tag for this image"
              required
            />
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Link 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link 1
              </label>
              <input
                type="text"
                name="link1"
                value={formData.link1}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            </div>

            {/* Link 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link 2
              </label>
              <input
                type="text"
                name="link2"
                value={formData.link2}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image <span className="text-red-500">*</span>
            </label>

            {imagePreview && (
              <div className="mb-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-28 w-full max-w-md object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/800x400?text=PIU";
                  }}
                />
              </div>
            )}

            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
                <input 
                  type="file" 
                  name="image" 
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleChange} 
                  className="hidden" 
                  required={!id}
                />
              </label>
            </div>
            {formData.image && (
              <p className="mt-2 text-sm text-green-600">
                <i className="fas fa-check-circle mr-1"></i>
                {formData.image.name} selected
              </p>
            )}
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label className="font-medium text-gray-700">Active</label>
              <p className="text-gray-500">Display this image in the gallery</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/piu/admin/gallery")}
              className="px-5 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <i className="fas fa-save mr-2"></i>
              {id ? "Update Gallery Item" : "Add Gallery Item"}
            </button>
          </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddGallery;