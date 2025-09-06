import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AssignmentsList = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // Dummy sample data
    const sampleAssignments = [
      {
        id: 1,
        name: "English Composition",
        course: "ICT",
        moduleCode: "ENG101",
        testSubject: "Essay Writing",
      },
      {
        id: 2,
        name: "Introduction to Programming",
        course: "Computer Science",
        moduleCode: "CS101",
        testSubject: "JavaScript Basics",
      },
      {
        id: 3,
        name: "Database Systems",
        course: "Information Technology",
        moduleCode: "DB201",
        testSubject: "SQL Queries",
      },
      {
        id: 4,
        name: "Humanities",
        course: "ICT",
        moduleCode: "HUM102",
        testSubject: "Critical Thinking",
      },
    ];

    setAssignments(sampleAssignments);
  }, []);

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="text-blue-100 mt-1">Manage all assignments</p>
        </div>
        <Link
          to="/piu/admin/assignments/add"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
        >
          + Add Assignment
        </Link>
      </div>

      {/* Table */}
      <div className="p-6 overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Assignment</th>
              <th className="px-4 py-2 border">Course</th>
              <th className="px-4 py-2 border">Module Code</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? (
              assignments.map((a, index) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{a.name}</td>
                  <td className="px-4 py-2 border">{a.course}</td>
                  <td className="px-4 py-2 border">{a.moduleCode}</td>
                  <td className="px-4 py-2 border">
                    <Link
                      to={`/piu/admin/assignments/edit/${a.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500 border"
                >
                  No assignments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentsList;
