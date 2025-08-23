import React, { useState } from "react";
import { Link } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Tech Conference 2025",
      location: "Yangon, Myanmar",
      date: "2025-09-10",
      image: "https://via.placeholder.com/80",
      status: true,
    },
    {
      id: 2,
      title: "AI Workshop",
      location: "Mandalay, Myanmar",
      date: "2025-11-05",
      image: "https://via.placeholder.com/80",
      status: false,
    },
  ]);

  const toggleStatus = (id) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, status: !event.status } : event
      )
    );
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        Event List
      </h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border border-gray-200 p-2">Image</th>
            <th className="border border-gray-200 p-2">Title</th>
            <th className="border border-gray-200 p-2">Location</th>
            <th className="border border-gray-200 p-2">Date</th>
            <th className="border border-gray-200 p-2">Status</th>
            <th className="border border-gray-200 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-gray-50">
              <td className="border border-gray-200 p-2">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-12 h-12 rounded object-cover"
                />
              </td>
              <td className="border border-gray-200 p-2">{event.title}</td>
              <td className="border border-gray-200 p-2">{event.location}</td>
              <td className="border border-gray-200 p-2">{event.date}</td>
              <td className="border border-gray-200 p-2 text-center">
                <input
                  type="checkbox"
                  checked={event.status}
                  onChange={() => toggleStatus(event.id)}
                />
              </td>
              <td className="border border-gray-200 p-2 space-x-2">
                <Link
                  to={`/piu/admin/events/edit/${event.id}`}
                  className="px-3 py-1 bg-yellow-400 text-white rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventList;
