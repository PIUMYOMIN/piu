import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ModulesList = () => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    // Sample Data (replace with API later)
    const sampleModules = [
      { id: 1, name: "Introduction to Programming", moduleCode: "CS101", credit: 3 },
      { id: 2, name: "Database Systems", moduleCode: "CS202", credit: 4 },
      { id: 3, name: "Computer Networks", moduleCode: "CS303", credit: 3 },
    ];
    setModules(sampleModules);
  }, []);

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Modules</h2>
          <p className="text-blue-100 mt-1">Manage all course modules</p>
        </div>
        <Link
          to="/piu/admin/modules/add"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
        >
          + Add Module
        </Link>
      </div>

      {/* Table */}
      <div className="p-6 overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Module Name</th>
              <th className="px-4 py-2 border">Module Code</th>
              <th className="px-4 py-2 border">Credit</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.length > 0 ? (
              modules.map((m, index) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{m.name}</td>
                  <td className="px-4 py-2 border">{m.moduleCode}</td>
                  <td className="px-4 py-2 border">{m.credit}</td>
                  <td className="px-4 py-2 border space-x-4">
                    <Link
                      to={`/piu/admin/modules/edit/${m.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500 border"
                >
                  No modules found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModulesList;
