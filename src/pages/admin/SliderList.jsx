import React, { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../api/admin";
import { toStorageUrl } from "../../api/axios";

const emptyForm = {
  title: "",
  description: "",
  tag_link: "",
  image_tag: "",
  slide_image: null,
  is_active: true,
};

const SliderList = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingSlider, setEditingSlider] = useState(null); // {mode:'edit'|'create', data: {...}}

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.slides.list();
      setSliders(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load slides");
      setSliders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const normalized = useMemo(() => {
    return sliders.map((s) => ({
      ...s,
      image: s.slide_image || s.image || s.image_url,
      status: typeof s.is_active === "boolean" ? s.is_active : Boolean(s.status),
    }));
  }, [sliders]);

  const openCreate = () => setEditingSlider({ mode: "create", data: { ...emptyForm } });
  const openEdit = (s) =>
    setEditingSlider({
      mode: "edit",
      id: s.id,
      data: {
        title: s.title || "",
        description: s.description || "",
        tag_link: s.tag_link || "",
        image_tag: s.image_tag || "",
        slide_image: null,
        is_active: typeof s.is_active === "boolean" ? s.is_active : Boolean(s.status),
        preview: s.slide_image || s.image || "",
      },
    });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEditingSlider((prev) => {
      if (!prev) return prev;
      const next = { ...prev };
      const nextData = { ...next.data };
      if (type === "checkbox") nextData[name] = checked;
      else if (files && files[0]) {
        nextData[name] = files[0];
        nextData.preview = URL.createObjectURL(files[0]);
      } else nextData[name] = value;
      next.data = nextData;
      return next;
    });
  };

  const handleSave = async () => {
    if (!editingSlider) return;
    try {
      setError("");
      const formData = new FormData();
      formData.append("title", editingSlider.data.title);
      formData.append("description", editingSlider.data.description || "");
      if (editingSlider.data.image_tag) formData.append("image_tag", editingSlider.data.image_tag);
      if (editingSlider.data.tag_link) formData.append("tag_link", editingSlider.data.tag_link);
      if (typeof editingSlider.data.is_active === "boolean") formData.append("is_active", editingSlider.data.is_active ? "1" : "0");
      if (editingSlider.data.slide_image instanceof File) {
        formData.append("slide_image", editingSlider.data.slide_image);
      }

      if (editingSlider.mode === "create") {
        await adminApi.slides.create(formData);
      } else {
        await adminApi.slides.update(editingSlider.id, formData);
      }

      setEditingSlider(null);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to save slide");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    try {
      await adminApi.slides.remove(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete slide");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await adminApi.slides.toggleActive(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to update status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Slider Management</h2>
            <p className="text-blue-100 mt-1">Manage homepage sliders and banners</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-semibold"
          >
            + New Slide
          </button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="py-10 text-center text-gray-500">Loading slides...</div>
        )}

        {/* Slider Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {normalized.map((slider) => (
              <div key={slider.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={toStorageUrl(slider.image) || slider.image || "https://via.placeholder.com/600x300?text=PIU"}
                  alt={slider.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/600x300?text=PIU";
                  }}
                />
              </div>
              
              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{slider.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      slider.status
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {slider.status ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={slider.status}
                        onChange={() => toggleStatus(slider.id)}
                      />
                      <div className={`block w-14 h-7 rounded-full ${slider.status ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${slider.status ? 'transform translate-x-7' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm font-medium text-gray-700">
                      {slider.status ? "Deactivate" : "Activate"}
                    </div>
                  </label>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(slider)}
                      className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors"
                      title="Edit slider"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slider.id)}
                      className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-md transition-colors"
                      title="Delete slider"
                    >
                      <i className="fas fa-trash mr-2"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Edit Form Modal */}
        {editingSlider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              {/* Modal Header */}
              <div className="bg-[#002147] p-6 text-white rounded-t-xl">
                <h3 className="text-xl font-bold">
                  {editingSlider.mode === "create" ? "New Slide" : "Edit Slide"}
                </h3>
                <p className="text-blue-100 mt-1">Update slider details</p>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editingSlider.data.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editingSlider.data.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={
                          editingSlider.data.preview ||
                          toStorageUrl(editingSlider.data.slide_image) ||
                          "https://via.placeholder.com/240x160?text=PIU"
                        }
                        alt="Preview"
                        className="h-16 w-24 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        name="slide_image"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="status"
                    name="is_active"
                    checked={editingSlider.data.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="status" className="ml-2 block text-sm text-gray-700">
                    Active Slider
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setEditingSlider(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && normalized.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <i className="fas fa-images text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No sliders found</h3>
            <p className="text-gray-500">
              Get started by adding your first slider
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {normalized.length} sliders
        </div>
      </div>
    </div>
  );
};

export default SliderList;