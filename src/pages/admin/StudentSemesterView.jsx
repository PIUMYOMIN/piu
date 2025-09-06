// src/pages/admin/grades/YearView.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function StudentSemesterView() {
  const { studentId, year } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Optional: pass student data from previous page
  const student = location.state || {
    id: studentId,
    name: "Lucifer Morningstar",
    program: "ICT",
    courses: ["English", "Mathematics", "Computer Science"],
  };

  const semesters = ["first", "second"];

  const handleClickSemester = (sem) => {
    navigate(`/piu/admin/students/${student.id}/${year}/${sem}`, { state: student });
  };

  const yearLabel = {
    first: "First Year",
    second: "Second Year",
    third: "Third Year",
    fourth: "Fourth Year",
  }[year];

  return (
    <div className="p-6">
      {/* Page Header with Back Button */}
      <div className="bg-[#002147] px-6 py-4 rounded flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-white hover:text-gray-200"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-bold text-white">
          {student.name} - {student.program} ({yearLabel})
        </h2>
      </div>

      {/* Courses / Semester Table */}
      <table className="table-auto w-full mt-6 border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Studied Program</th>
            <th className="border px-4 py-2">Year</th>
            <th className="border px-4 py-2">First Semester</th>
            <th className="border px-4 py-2">Second Semester</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="border px-4 py-2">{student.name}</td>
            <td className="border px-4 py-2">{student.program}</td>
            <td className="border px-4 py-2">{yearLabel}</td>
            {semesters.map((sem) => (
              <td
                key={sem}
                className="border px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                onClick={() => handleClickSemester(sem)}
              >
                {sem === "first" ? "First Semester" : "Second Semester"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}