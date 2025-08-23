import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddDepartment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingDepartment = location.state;

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (editingDepartment) {
      setFormData({
        name: editingDepartment.name || "",
      });
    }
  }, [editingDepartment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    navigate("/piu/admin/departments");
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        {editingDepartment ? "Edit Department" : "Add Department"}
      </h2>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Department Name */}
        <div>
          <label className="block font-medium">Department Name</label>
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
          {editingDepartment ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;
