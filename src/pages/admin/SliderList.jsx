import React, { useState } from "react";

const SliderList = () => {
  // Example data with better images
  const [sliders, setSliders] = useState([
    { 
      id: 1, 
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80", 
      title: "Welcome Banner", 
      status: true 
    },
    { 
      id: 2, 
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80", 
      title: "New Courses", 
      status: false 
    },
    { 
      id: 3, 
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80", 
      title: "New Teams", 
      status: false 
    },
  ]);

  const [editingSlider, setEditingSlider] = useState(null);

  const handleEditClick = (slider) => {
    setEditingSlider({ ...slider });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEditingSlider((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? URL.createObjectURL(files[0]) : value,
    }));
  };

  const handleSave = () => {
    setSliders((prev) =>
      prev.map((s) => (s.id === editingSlider.id ? editingSlider : s))
    );
    setEditingSlider(null);
  };

  const toggleStatus = (id) => {
    setSliders((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: !s.status } : s))
    );
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">Slider Management</h2>
        <p className="text-blue-100 mt-1">Manage homepage sliders and banners</p>
      </div>

      <div className="p-6">
        {/* Slider Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map((slider) => (
            <div key={slider.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={slider.image}
                  alt={slider.title}
                  className="w-full h-full object-cover"
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
                  
                  <button
                    onClick={() => handleEditClick(slider)}
                    className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors"
                    title="Edit slider"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Form Modal */}
        {editingSlider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              {/* Modal Header */}
              <div className="bg-[#002147] p-6 text-white rounded-t-xl">
                <h3 className="text-xl font-bold">Edit Slider</h3>
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
                    value={editingSlider.title}
                    onChange={handleChange}
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
                        src={editingSlider.image}
                        alt="Preview"
                        className="h-16 w-24 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        name="image"
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
                    name="status"
                    checked={editingSlider.status}
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
        {sliders.length === 0 && (
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
          Showing {sliders.length} sliders
        </div>
      </div>
    </div>
  );
};

export default SliderList;