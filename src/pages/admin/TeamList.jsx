import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const TeamList = () => {
  const navigate = useNavigate();

  // Dummy data (in real app, fetch from API or DB)
  const [teams, setTeams] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/80",
      name: "John Doe",
      email: "john@example.com",
      phone: "0912345678",
      address: "Yangon, Myanmar",
      department: "Engineering",
      position: "Senior Developer",
      status: true,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/80",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "0987654321",
      address: "Mandalay, Myanmar",
      department: "Marketing",
      position: "Manager",
      status: false,
    },
  ]);

  // Toggle status
  const handleStatusChange = (id) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === id ? { ...team, status: !team.status } : team
      )
    );
  };

  // Delete team
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      setTeams((prev) => prev.filter((team) => team.id !== id));
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        Team List
      </h2>
        <Link
          to="/piu/admin/add-team"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Team
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 p-2">Image</th>
            <th className="border border-gray-200 p-2">Name</th>
            <th className="border border-gray-200 p-2">Email</th>
            <th className="border border-gray-200 p-2">Phone</th>
            <th className="border border-gray-200 p-2">Address</th>
            <th className="border border-gray-200 p-2">Department</th>
            <th className="border border-gray-200 p-2">Position</th>
            <th className="border border-gray-200 p-2">Status</th>
            <th className="border border-gray-200 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id} className="text-center">
              <td className="border border-gray-200 p-2">
                <img
                  src={team.image}
                  alt={team.name}
                  className="w-16 h-16 rounded object-cover mx-auto"
                />
              </td>
              <td className="border border-gray-200 p-2">{team.name}</td>
              <td className="border border-gray-200 p-2">{team.email}</td>
              <td className="border border-gray-200 p-2">{team.phone}</td>
              <td className="border border-gray-200 p-2">{team.address}</td>
              <td className="border border-gray-200 p-2">{team.department}</td>
              <td className="border border-gray-200 p-2">{team.position}</td>
              <td className="border border-gray-200 p-2">
                <input
                  type="checkbox"
                  checked={team.status}
                  onChange={() => handleStatusChange(team.id)}
                />
              </td>
              <td className="border border-gray-200 p-2 space-x-2">
                <button
                  onClick={() => navigate(`/piu/admin/add-team/edit/${team.id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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

export default TeamList;
