import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function NewCourse() {
  const location = useLocation();
  const params = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eligibility: "",
    requirement: "",
    fee: "",
    process: "",
    startDate: "",
    endDate: "",
    duration: "",
    seats: "",
    category: "",
    image: null,
  });

  // Load data if editing
  useEffect(() => {
    if (params.id && location.state) {
      setFormData({
        title: location.state.name || "",
        description: location.state.description || "",
        eligibility: location.state.eligibility || "",
        requirement: location.state.requirement || "",
        fee: location.state.fee || "",
        process: location.state.process || "",
        startDate: location.state.startDate || "",
        endDate: location.state.endDate || "",
        duration: location.state.duration || "",
        seats: location.state.seats || "",
        category: location.state.category || "",
        image: location.state.image || null,
      });
    }
  }, [params.id, location.state]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      {/* Page Title */}
      <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        {params.id ? "Edit Course" : "Add Course"}
      </h2>

      <form className="p-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />
          <input
            type="text"
            name="eligibility"
            placeholder="Eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="requirement"
            placeholder="Course Requirement"
            value={formData.requirement}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="fee"
            placeholder="Course Fee"
            value={formData.fee}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="process"
            placeholder="Application Process"
            value={formData.process}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="seats"
            placeholder="Total Seats"
            value={formData.seats}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Category</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
          </select>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {params.id ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}
