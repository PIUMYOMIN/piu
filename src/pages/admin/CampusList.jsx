import React, { useState } from "react";
import { Link } from "react-router-dom";

function CampusList() {
  const [campuses, setCampuses] = useState([
    {
      id: 1,
      name: "Main Campus",
      location: "Yangon",
      image: "https://via.placeholder.com/100"
    },
    {
      id: 2,
      name: "Branch Campus",
      location: "Mandalay",
      image: "https://via.placeholder.com/100"
    }
  ]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold text-white p-4 rounded-t" style={{ backgroundColor: "#002147" }}>
        Campus List
      </h2>

      <table className="w-full mt-4 border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-200 p-2">Image</th>
            <th className="border border-gray-200 p-2">Name</th>
            <th className="border border-gray-200 p-2">Location</th>
            <th className="border border-gray-200 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campuses.map((campus) => (
            <tr key={campus.id} className="text-center">
              <td className="border border-gray-200 p-2">
                <img src={campus.image} alt={campus.name} className="w-16 h-16 object-cover mx-auto rounded" />
              </td>
              <td className="border border-gray-200 p-2">{campus.name}</td>
              <td className="border border-gray-200 p-2">{campus.location}</td>
              <td className="border border-gray-200 p-2">
                <Link
                  to={`/piu/admin/campus/${campus.id}/edit`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CampusList;
