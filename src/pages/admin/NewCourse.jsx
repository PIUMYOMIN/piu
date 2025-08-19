import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
    <div className="w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-[#002147] px-6 py-4">
        <h2 className="text-xl font-bold text-white">
          {params.id ? "Edit Course" : "Add Course"}
        </h2>
      </div>

      <form className="p-6 space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) =>
                setFormData({ ...formData, description: value })
              }
              className="bg-white rounded-md border border-gray-300 focus:border-blue-500"
              placeholder="Write detailed description..."
            />
          </div>

          {/* Other inputs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Eligibility
            </label>
            <input
              type="text"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements
            </label>
            <input
              type="text"
              name="requirement"
              value={formData.requirement}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Fee
            </label>
            <input
              type="text"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Process
            </label>
            <input
              type="text"
              name="process"
              value={formData.process}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Seats
            </label>
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Category</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            {params.id ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
