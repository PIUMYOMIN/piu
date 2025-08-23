import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddTeam = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    social1: "",
    social2: "",
    department: "",
    position: "",
    education: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    console.log("Team Data Submitted:", formData);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t mb-3"
        style={{ backgroundColor: "#002147" }}
      >
        Add Team Member
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="url"
          name="social1"
          placeholder="Social Link 1"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="url"
          name="social2"
          placeholder="Social Link 2"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Dropdowns */}
        <select
          name="department"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Department</option>
          <option value="Engineering">Engineering</option>
          <option value="Business">Business</option>
          <option value="Science">Science</option>
        </select>

        <select
          name="position"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Position</option>
          <option value="Professor">Professor</option>
          <option value="Lecturer">Lecturer</option>
          <option value="Assistant">Assistant</option>
        </select>

        {/* Education (Quill) */}
        <div>
          <label className="block mb-2 font-medium">Education</label>
          <ReactQuill
            theme="snow"
            value={formData.education}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, education: value }))
            }
          />
        </div>

        {/* File Input */}
        <div>
          <label className="block mb-2 font-medium">Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddTeam;
