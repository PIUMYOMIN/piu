import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ModuleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    moduleCode: "",
    credit: "",
  });

  useEffect(() => {
    if (id) {
      // Fetch module by ID (replace with API later)
      const sampleModule = {
        id: 1,
        name: "Introduction to Programming",
        moduleCode: "CS101",
        credit: 3,
      };
      setFormData(sampleModule);
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      console.log("Updating module:", formData);
    } else {
      console.log("Adding module:", formData);
    }
    navigate("/piu/admin/modules");
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#002147]">
        {id ? "Edit Module" : "Add Module"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Module Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Module Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2"
          />
        </div>

        {/* Module Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Module Code
          </label>
          <input
            type="text"
            name="moduleCode"
            value={formData.moduleCode}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2"
          />
        </div>

        {/* Credit */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Credit
          </label>
          <input
            type="number"
            name="credit"
            value={formData.credit}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2"
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="bg-[#002147] text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {id ? "Update Module" : "Add Module"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModuleForm;
