import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";

const AddEvent = () => {
  const { id } = useParams(); // get event id from URL (if editing)
  const navigate = useNavigate();

  // Dummy events (in real project, fetch from API or context)
  const dummyEvents = [
    {
      id: 1,
      title: "Tech Conference 2025",
      location: "Yangon, Myanmar",
      description: "<p>Biggest tech conference in Myanmar.</p>",
      date: "2025-09-10",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: "AI Workshop",
      location: "Mandalay, Myanmar",
      description: "<p>Hands-on workshop about AI and ML.</p>",
      date: "2025-11-05",
      image: "https://via.placeholder.com/150",
    },
  ];

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    date: "",
    image: null,
  });

  // Prefill if editing
  useEffect(() => {
    if (id) {
      const eventToEdit = dummyEvents.find((ev) => ev.id === parseInt(id));
      if (eventToEdit) {
        setFormData({
          title: eventToEdit.title,
          location: eventToEdit.location,
          description: eventToEdit.description,
          date: eventToEdit.date,
          image: eventToEdit.image, // will show existing image
        });
      }
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      console.log("Updated Event:", formData);
      alert("Event updated successfully!");
    } else {
      console.log("New Event Submitted:", formData);
      alert("New event added successfully!");
    }
    navigate("/piu/admin/event-list"); // go back to list
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t mb-3"
        style={{ backgroundColor: "#002147" }}
      >
         {id ? "Edit Event" : "Add Event"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Quill Editor */}
        <div>
          <label className="block mb-2 font-medium">Description</label>
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, description: value }))
            }
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block mb-2 font-medium">Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg"
            onChange={handleChange}
            className="w-full"
          />
          {id && typeof formData.image === "string" && (
            <img
              src={formData.image}
              alt="Event"
              className="mt-2 w-32 h-32 rounded object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {id ? "Update Event" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
