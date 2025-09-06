import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function StudentYearView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (location.state) {
      setStudent(location.state);
    } else {
      // fallback if no state (simulate fetch)
      setStudent({
        id,
        name: "Unknown Student",
        program: "ICT",
        studentId: `ST${String(id).padStart(3, "0")}`,
      });
    }
  }, [id, location.state]);

  if (!student) return <p className="p-6">Loading...</p>;

  const years = [
    { value: "first", label: "First Year" },
    { value: "second", label: "Second Year" },
    { value: "third", label: "Third Year" },
    { value: "fourth", label: "Fourth Year" },
  ];

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Page Header with Back Button */}
      <div className="bg-[#002147] px-6 py-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-white hover:text-gray-200"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-bold text-white">
          {student.name} — Grading Overview
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="mb-2">
            <strong>Student ID:</strong> {student.studentId}
          </p>
          <p>
            <strong>Program:</strong> {student.program}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Academic Years</h3>
          <div className="grid grid-cols-1 gap-3">
            {years.map((y) => (
              <button
                key={y.value}
                onClick={() =>
                  navigate(`/piu/admin/students/${student.id}/grading/${y.value}`, {
                    state: student,
                  })
                }
                className="w-full text-left p-4 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                {y.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}