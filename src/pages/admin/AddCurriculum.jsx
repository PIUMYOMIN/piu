import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddCurriculum = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Example options
  const courses = ["Bachelor of Computer Science", "Master of Business Administration"];
  const years = ["1", "2", "3", "4"];
  const moduleCodes = ["CS101", "CS102", "MBA201", "MBA202"];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    year: "",
    moduleCode: "",
  });

  // Prefill data if editing
  useEffect(() => {
    if (params.id && location.state) {
      setFormData(location.state);
    }
  }, [params.id, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Curriculum:", formData);
    navigate("/piu/admin/curriculum-list");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-[#002147] px-6 py-4 rounded-t">
        <h2 className="text-xl font-bold text-white">
          {params.id ? "Edit Curriculum" : "Add Curriculum"}
        </h2>
      </div>

      <form
        className="bg-white shadow-md rounded-b-lg p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Enter curriculum description..."
          />
        </div>

        {/* Course */}
        <div>
          <label className="block mb-1 font-medium">Course</label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Course</option>
            {courses.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block mb-1 font-medium">Year</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Year</option>
            {years.map((y, i) => (
              <option key={i} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Module Code */}
        <div>
          <label className="block mb-1 font-medium">Module Code</label>
          <select
            name="moduleCode"
            value={formData.moduleCode}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Module Code</option>
            {moduleCodes.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {params.id ? "Update Curriculum" : "Add Curriculum"}
        </button>
      </form>
    </div>
  );
};

export default AddCurriculum;
