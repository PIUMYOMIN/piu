import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DepartmentList = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([
    { id: 1, name: "Computer Science" },
    { id: 2, name: "Business Administration" },
  ]);

  const handleDelete = (id) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  const handleEdit = (dept) => {
    navigate(`/piu/admin/departments/edit/${dept.id}`, { state: dept });
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        Departments List
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
          {departments.map((dept) => (
            <tr key={dept.id} className="text-center">
              <td className="border p-2">{dept.id}</td>
              <td className="border p-2">{dept.name}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(dept)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dept.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <Link
          to="/piu/admin/departments/new"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Department
        </Link>
      </div>
    </div>
  );
};

export default DepartmentList;
