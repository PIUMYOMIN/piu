import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";

function CampusForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    image: null, // file object
  });

  const [preview, setPreview] = useState(null); // preview url

  useEffect(() => {
    if (id) {
      // fetch campus by id
      const existingCampus = {
        id: 1,
        name: "Main Campus",
        location: "Yangon",
        description: "<p>This is PIU main campus.</p>",
        image: null,
      };
      setFormData(existingCampus);
      setPreview("https://via.placeholder.com/150");
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuillChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const campusData = new FormData();
    campusData.append("name", formData.name);
    campusData.append("location", formData.location);
    campusData.append("description", formData.description);
    if (formData.image) {
      campusData.append("image", formData.image);
    }

    if (id) {
      console.log("Updating campus:", campusData);
    } else {
      console.log("Creating new campus:", campusData);
    }

    // POST campusData to backend
    navigate("/piu/admin/campus-list");
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        {id ? "Edit Campus" : "New Campus"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block font-medium">Campus Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <ReactQuill theme="snow" value={formData.description} onChange={handleQuillChange} />
        </div>

        <div>
          <label className="block font-medium">Campus Image</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {id ? "Update Campus" : "Add Campus"}
        </button>
      </form>
    </div>
  );
}

export default CampusForm;
