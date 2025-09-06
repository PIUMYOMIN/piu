import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    course: "",
    moduleCode: "",
    testSubject: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/assignments/${id}`)
        .then((res) => res.json())
        .then((data) => setFormData(data))
        .catch((err) => console.error("Error fetching assignment:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (id) {
      // Update
      fetch(`http://localhost:5000/assignments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then(() => {
          alert("Assignment updated successfully!");
          navigate("/piu/admin/assignments");
        })
        .finally(() => setIsSubmitting(false));
    } else {
      // Add new
      fetch("http://localhost:5000/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then(() => {
          alert("Assignment added successfully!");
          navigate("/piu/admin/assignments");
        })
        .finally(() => setIsSubmitting(false));
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">
          {id ? "Edit Assignment" : "Add Assignment"}
        </h2>
        <p className="text-blue-100 mt-1">
          {id
            ? "Update assignment details"
            : "Fill in the details to add a new assignment"}
        </p>
      </div>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Assignment Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter assignment name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Course
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose course</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Engineering">Engineering</option>
              <option value="Medicine">Medicine</option>
            </select>
          </div>

          {/* Module Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Module Code
            </label>
            <select
              name="moduleCode"
              value={formData.moduleCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose module code</option>
              <option value="CS101">CS101</option>
              <option value="BA201">BA201</option>
              <option value="ENG301">ENG301</option>
              <option value="MED401">MED401</option>
            </select>
          </div>

          {/* Test Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Subject
            </label>
            <select
              name="moduleCode"
              value={formData.moduleCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose Test Subject</option>
              <option value="CS101">CS101</option>
              <option value="BA201">BA201</option>
              <option value="ENG301">ENG301</option>
              <option value="MED401">MED401</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-auto px-6 py-3 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {isSubmitting
                ? id
                  ? "Updating Assignment..."
                  : "Adding Assignment..."
                : id
                ? "Update Assignment"
                : "Add Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignment;
