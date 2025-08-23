import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddPosition = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingPosition = location.state;

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (editingPosition) {
      setFormData({
        name: editingPosition.name || "",
      });
    }
  }, [editingPosition]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    navigate("/piu/admin/positions");
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        {editingPosition ? "Edit Position" : "Add Position"}
      </h2>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label className="block font-medium">Position Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {editingPosition ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddPosition;
