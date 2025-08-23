import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PositionList = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([
    { id: 1, name: "Professor" },
    { id: 2, name: "Assistant Professor" },
    { id: 3, name: "Lecturer" },
  ]);

  const handleDelete = (id) => {
    setPositions(positions.filter((pos) => pos.id !== id));
  };

  const handleEdit = (pos) => {
    navigate(`/piu/admin/positions/edit/${pos.id}`, { state: pos });
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        Positions List
      </h2>

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos) => (
            <tr key={pos.id} className="text-center">
              <td className="border p-2">{pos.id}</td>
              <td className="border p-2">{pos.name}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(pos)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pos.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <Link
          to="/piu/admin/positions/new"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Position
        </Link>
      </div>
    </div>
  );
};

export default PositionList;
