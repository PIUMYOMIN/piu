import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { adminApi } from "../../api/admin";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { YEAR_LABELS, getStudentDisplayName } from "../../utils/gradingHelpers";

export default function StudentYearView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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
        const data = await adminApi.students.get(id);
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
  }, [id, location.state]);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  if (!student) {
    return (
      <p className="p-6 text-red-600">{error || "Student not found."}</p>
    );
  }

  const years = Object.entries(YEAR_LABELS).map(([value, label]) => ({ value, label }));

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
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
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md">
          <p className="mb-2">
            <strong>Student ID:</strong> {student.studentId || "—"}
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
