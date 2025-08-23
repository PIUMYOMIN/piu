import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MOUList() {
  const navigate = useNavigate();

  const [mous, setMous] = useState([
    {
      id: 1,
      name: "Tech University",
      description: "Collaboration for research and student exchange",
      image: "https://via.placeholder.com/100",
      status: true,
    },
    {
      id: 2,
      name: "Global Institute",
      description: "Joint curriculum development program",
      image: "https://via.placeholder.com/100",
      status: false,
    },
  ]);

  const handleStatusChange = (id) => {
    setMous((prev) =>
      prev.map((mou) =>
        mou.id === id ? { ...mou, status: !mou.status } : mou
      )
    );
  };

  const handleEdit = (mou) => {
    navigate("/piu/admin/mou/add", { state: { mou } });
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        MOU List
      </h2>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {mous.map((mou) => (
              <tr key={mou.id}>
                <td className="border p-2">{mou.id}</td>
                <td className="border p-2">
                  <img
                    src={mou.image}
                    alt={mou.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="border p-2">{mou.name}</td>
                <td className="border p-2">{mou.description}</td>
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={mou.status}
                    onChange={() => handleStatusChange(mou.id)}
                  />
                </td>
                <td className="border p-2 text-center">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(mou)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/piu/admin/mou/add"
        className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded"
      >
        Add MOU
      </Link>
    </div>
  );
}

export default MOUList;
