import React, { useState, useEffect } from "react";

function AddSeminar({ editData }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    seat: "",
    city: "",
    country: "",
    image: null,
  });

  useEffect(() => {
    if (editData) {
      setForm(editData);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", form);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        {editData ? "Edit Seminar" : "Add Seminar"}
      </h2>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Seminar Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full"
        ></textarea>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seminar Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="number"
          name="seat"
          placeholder="Seat Capacity"
          value={form.seat}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="file"
          name="image"
          accept="image/png, image/jpeg"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editData ? "Update Seminar" : "Add Seminar"}
        </button>
      </form>
    </div>
  );
}

export default AddSeminar;
