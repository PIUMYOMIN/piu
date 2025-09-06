import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MOUList() {
  const navigate = useNavigate();

  const [mous, setMous] = useState([
    {
      id: 1,
      name: "Tech University",
      description: "Collaboration for research and student exchange",
      image: "https://images.unsplash.com/photo-1524178232400-38d816f003ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      status: "active",
      startDate: "2023-01-01",
      endDate: "2026-01-01",
      partner: "Tech University",
      category: "Research",
    },
    {
      id: 2,
      name: "Global Institute",
      description: "Joint curriculum development program",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      status: "inactive",
      startDate: "2022-06-15",
      endDate: "2025-06-15",
      partner: "Global Institute",
      category: "Curriculum",
    },
  ]);

  const handleStatusChange = (id) => {
    setMous((prev) =>
      prev.map((mou) =>
        mou.id === id
          ? { ...mou, status: mou.status === "active" ? "inactive" : "active" }
          : mou
      )
    );
  };

  const handleEdit = (mou) => {
    navigate("/piu/admin/mou/add", { state: { mou } });
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">MOU Management</h2>
        <p className="text-blue-100 mt-1">
          Manage Memorandums of Understanding with partner institutions
        </p>
      </div>

      <div className="p-6">
        {/* Add Button */}
        <div className="flex justify-end mb-6">
          <Link
            to="/piu/admin/mou/add"
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <i className="fas fa-plus-circle mr-2"></i>
            Add MOU
          </Link>
        </div>

        {/* MOU Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mous.map((mou) => (
            <div
              key={mou.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={mou.image}
                  alt={mou.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {mou.name}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      mou.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {mou.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {mou.description}
                </p>

                <div className="flex justify-between items-center">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={mou.status === "active"}
                        onChange={() => handleStatusChange(mou.id)}
                      />
                      <div
                        className={`block w-14 h-7 rounded-full ${
                          mou.status === "active" ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${
                          mou.status === "active"
                            ? "transform translate-x-7"
                            : ""
                        }`}
                      ></div>
                    </div>
                    <div className="ml-3 text-sm font-medium text-gray-700">
                      {mou.status === "active" ? "Deactivate" : "Activate"}
                    </div>
                  </label>

                  <button
                    onClick={() => handleEdit(mou)}
                    className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors"
                    title="Edit MOU"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {mous.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <i className="fas fa-file-contract text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No MOUs found
            </h3>
            <p className="text-gray-500">
              Get started by adding your first Memorandum of Understanding
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {mous.length} MOUs
        </div>
      </div>
    </div>
  );
}

export default MOUList;
