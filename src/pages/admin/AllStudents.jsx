import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AllStudents = () => {
  const navigate = useNavigate();

  // Dummy data
  const [students] = useState([
    { id: 1, name: "Lucifer", studentId: "ST001", program: "ICT" },
    { id: 2, name: "Alice", studentId: "ST002", program: "Business" },
  ]);

  const [filter, setFilter] = useState("");

  const filteredStudents = students.filter((s) =>
    filter ? s.program === filter : true
  );

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold bg-[#002147] text-white px-4 py-2 rounded">
        All Students
      </h2>

      {/* Filter */}
      <div className="my-4">
        <label className="mr-2 font-medium">Filter by Study Program:</label>
        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="ICT">ICT</option>
          <option value="Business">Business</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Student ID</th>
            <th className="border p-2">Study Program</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={student.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{student.name}</td>
              <td className="border p-2">{student.studentId}</td>
              <td className="border p-2">{student.program}</td>
              <td className="border p-2">
                <button
                  onClick={() =>
                    navigate(`/piu/admin/students/${student.id}/details`)
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <Link
          to="/piu/admin/students/add"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Student
        </Link>
      </div>
    </div>
  );
};

export default AllStudents;
