import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function AddMOU() {
  const location = useLocation();
  const editingMou = location.state?.mou || null;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    if (editingMou) {
      setFormData({
        name: editingMou.name,
        description: editingMou.description,
        file: null,
      });
    }
  }, [editingMou]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("MOU submitted:", formData);
    alert(editingMou ? "MOU Updated!" : "MOU Added!");
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        {editingMou ? "Edit MOU" : "Add MOU"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <ReactQuill
            value={formData.description}
            onChange={handleDescriptionChange}
            theme="snow"
          />
        </div>

        <div>
          <label className="block font-medium">Upload Image</label>
          <input
            type="file"
            name="file"
            accept="image/png, image/jpeg"
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingMou ? "Update MOU" : "Add MOU"}
        </button>
      </form>
    </div>
  );
}

export default AddMOU;
