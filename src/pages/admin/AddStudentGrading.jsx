// src/pages/admin/grades/AddStudentGrading.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const mockStudents = [
  { id: 1, name: "Lucifer Morningstar", studentId: "ST001", program: "ICT" },
  { id: 2, name: "Chloe Decker", studentId: "ST002", program: "Business" },
  { id: 3, name: "Ella Lopez", studentId: "ST003", program: "ICT" },
];

export default function AddStudentGrading() {
  const students = useMemo(() => mockStudents, []);

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Page Title */}
      <div className="bg-[#002147] px-6 py-4">
        <h2 className="text-xl font-bold text-white">Add Student Grading</h2>
      </div>

      {/* Filter (optional placeholder for future) */}
      <div className="p-6 pt-4">
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filter by Program</label>
          <select className="border rounded px-3 py-2 text-sm">
            <option>All</option>
            <option>ICT</option>
            <option>Business</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="border p-2">#</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Student ID</th>
                <th className="border p-2 text-left">Study Program</th>
                <th className="border p-2 text-center">First Semester</th>
                <th className="border p-2 text-center">Second Semester</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={s.id} className="text-sm">
                  <td className="border p-2 text-center">{idx + 1}</td>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.studentId}</td>
                  <td className="border p-2">{s.program}</td>
                  <td className="border p-2 text-center">
                    <Link
                      to={`/piu/admin/students/add-grading/${s.id}/first/new`}
                      state={s}
                      className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add
                    </Link>
                  </td>
                  <td className="border p-2 text-center">
                    <Link
                      to={`/piu/admin/students/add-grading/${s.id}/second/new`}
                      state={s}
                      className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add
                    </Link>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td className="border p-4 text-center text-sm text-gray-500" colSpan={6}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
