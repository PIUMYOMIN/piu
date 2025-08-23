import React, { useState } from "react";

const SliderList = () => {
  // Example data
  const [sliders, setSliders] = useState([
    { id: 1, image: "https://via.placeholder.com/150", title: "Welcome Banner", status: true },
    { id: 2, image: "https://via.placeholder.com/150", title: "New Courses", status: false },,
    { id: 3, image: "https://via.placeholder.com/150", title: "New Teams", status: false },
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-[#002147] px-6 py-4 rounded-t">
        <h2 className="text-xl font-bold text-white">Slider Management</h2>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-b-lg p-6">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {sliders.map((slider) => (
              <tr key={slider.id}>
                <td className="border px-4 py-2 text-center">{slider.id}</td>
                <td className="border px-4 py-2 text-center">
                  <img
                    src={slider.image}
                    alt={slider.title}
                    className="h-12 mx-auto rounded"
                  />
                </td>
                <td className="border px-4 py-2">{slider.title}</td>
                <td className="border px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={slider.status}
                    readOnly
                  />
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleEditClick(slider)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Form */}
        {editingSlider && (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-bold mb-4">Edit Slider</h3>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editingSlider.title}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block mb-1 font-medium">Image</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  name="image"
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                {editingSlider.image && (
                  <img
                    src={editingSlider.image}
                    alt="Preview"
                    className="h-16 mt-2 rounded"
                  />
                )}
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="status"
                  checked={editingSlider.status}
                  onChange={handleChange}
                />
                <span>Active</span>
              </div>

              {/* Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingSlider(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderList;
