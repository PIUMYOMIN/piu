import React, { useState } from "react";
import AddSeminar from "./AddSeminar";

function SeminarList() {
  const [seminars, setSeminars] = useState([
    {
      id: 1,
      name: "AI in Education",
      description: "Exploring AI's impact on modern classrooms",
      date: "2025-09-01",
      startTime: "10:00",
      endTime: "12:00",
      location: "Yangon",
      seat: "100",
      city: "Yangon",
      country: "Myanmar",
      image: "https://via.placeholder.com/100",
    },
  ]);

  const [editData, setEditData] = useState(null);

  const handleDelete = (id) => {
    setSeminars(seminars.filter((seminar) => seminar.id !== id));
  };

  const handleEdit = (seminar) => {
    setEditData(seminar);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t mb-4"
        style={{ backgroundColor: "#002147" }}
      >
        All Seminars
      </h2>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">#</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {seminars.map((seminar) => (
            <tr key={seminar.id}>
              <td className="border p-2">{seminar.id}</td>
              <td className="border p-2">
                <img
                  src={seminar.image}
                  alt={seminar.name}
                  className="w-16 h-16 object-cover"
                />
              </td>
              <td className="border p-2">{seminar.name}</td>
              <td className="border p-2">{seminar.startTime}</td>
              <td className="border p-2">{seminar.date}</td>
              <td className="border p-2">{seminar.location}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(seminar)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(seminar.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit form shows up if editData exists */}
      {editData && (
        <div className="mt-6">
          <AddSeminar editData={editData} />
        </div>
      )}
    </div>
  );
}

export default SeminarList;
