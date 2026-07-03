import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { adminApi } from "../../api/admin";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { YEAR_LABELS, getStudentDisplayName } from "../../utils/gradingHelpers";

export default function StudentSemesterView() {
  const { studentId, year } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [student, setStudent] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state) {
      setStudent(location.state);
      setLoading(false);
      return;
    }

    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await adminApi.students.get(studentId);
        if (!mounted) return;
        setStudent({
          ...data,
          name: getStudentDisplayName(data),
          studentId: data.student_id || data.studentId || "",
          program: data.course?.title || data.program || "Unassigned",
        });
      } catch (err) {
        if (!mounted) return;
        setError(getApiErrorMessage(err, "Failed to load student"));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [studentId, location.state]);

  const yearLabel = YEAR_LABELS[year] || year;
  const semesters = [
    { slug: "first", label: "First Semester" },
    { slug: "second", label: "Second Semester" },
  ];

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  if (!student) {
    return <p className="p-6 text-red-600">{error || "Student not found."}</p>;
  }

  const handleClickSemester = (sem) => {
    navigate(`/piu/admin/students/${student.id}/${year}/${sem}`, { state: student });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-[#002147] px-4 py-4 rounded flex items-center sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-white hover:text-gray-200"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-lg font-bold text-white sm:text-xl">
          {student.name} - {student.program} ({yearLabel})
        </h2>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
                key={sem.slug}
                className="border px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                onClick={() => handleClickSemester(sem.slug)}
              >
                {sem.label}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
