// src/pages/admin/grades/SemesterView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const StudentGradeView = () => {
  const { studentId, year, semester } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);

  const [totalCredit, setTotalCredit] = useState(0);
  const [gpaAverage, setGpaAverage] = useState(0);
  const [gradeValue, setGradeValue] = useState("");

  useEffect(() => {
    if (location.state) {
      // ✅ use the student passed via state
      setStudent(location.state);
    } else {
      // fallback (simulate fetch if no state is passed)
      setStudent({
        id: studentId,
        name: "Unknown Student",
        program: "ICT",
      });
    }

    // Dummy grades (you can replace with API call later)
    const fetchedGrades = [
      { id: 1, assignment: "English", moduleCode: "ENG110", credit: 3, gpaPoint: 3.7, gpaValue: "A-" },
      { id: 2, assignment: "Computer Science", moduleCode: "ICT101", credit: 4, gpaPoint: 3.5, gpaValue: "B+" },
      { id: 3, assignment: "Mathematics", moduleCode: "MTH201", credit: 3, gpaPoint: 3.2, gpaValue: "B" }
    ];

    setGrades(fetchedGrades);

    const totalC = fetchedGrades.reduce((acc, g) => acc + g.credit, 0);
    const gpaSum = fetchedGrades.reduce((acc, g) => acc + g.gpaPoint * g.credit, 0);
    setTotalCredit(totalC);
    const avg = gpaSum / totalC;
    setGpaAverage(avg.toFixed(2));

    if (avg >= 3.7) setGradeValue("A");
    else if (avg >= 3.0) setGradeValue("B");
    else if (avg >= 2.0) setGradeValue("C");
    else setGradeValue("F");
  }, [studentId, location.state]);

  const handleEdit = (grade) => {
    navigate(`/piu/admin/students/${studentId}/${year}/${semester}/edit/${grade.id}`, {
      state: { student, grade },
    });
  };

  const handleDelete = (gradeId) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      setGrades((prev) => prev.filter((g) => g.id !== gradeId));
    }
  };

  if (!student) return <p>Loading...</p>;

  const yearLabelMap = { first: "First Year", second: "Second Year", third: "Third Year", fourth: "Fourth Year" };
  const semLabel = semester === "first" ? "First Semester" : "Second Semester";

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="bg-[#002147] px-4 py-3 rounded flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="mr-3 text-white hover:text-gray-200 p-1">
          <FaArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-white font-bold text-xl">{student.name} — {semLabel}</h2>
          <p className="text-white text-sm">{student.program} — {yearLabelMap[year] || year}</p>
        </div>
      </div>

      {/* Student Info */}
      <div className="mb-4 border rounded p-4 bg-gray-50">
        <p><strong>Student Name:</strong> {student.name}</p>
        <p><strong>Study Program:</strong> {student.program}</p>
        <p><strong>Academic Year:</strong> {yearLabelMap[year] || year}</p>
        <p><strong>Semester:</strong> {semLabel}</p>
      </div>

      {/* Grades Table */}
      <table className="w-full border border-gray-300 table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">#</th>
            <th className="border px-3 py-2">Assignment</th>
            <th className="border px-3 py-2">Module Code</th>
            <th className="border px-3 py-2">Credit</th>
            <th className="border px-3 py-2">Grade Point</th>
            <th className="border px-3 py-2">Grade Value</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g, idx) => (
            <tr key={g.id} className="text-center hover:bg-gray-50">
              <td className="border px-3 py-2">{idx + 1}</td>
              <td className="border px-3 py-2">{g.assignment}</td>
              <td className="border px-3 py-2">{g.moduleCode}</td>
              <td className="border px-3 py-2">{g.credit}</td>
              <td className="border px-3 py-2">{g.gpaPoint}</td>
              <td className="border px-3 py-2 font-medium">{g.gpaValue}</td>
              <td className="border px-3 py-2 space-x-2">
                <button onClick={() => handleEdit(g)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(g.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* GPA Summary */}
      <div className="mt-4 p-4 bg-gray-50 rounded border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="font-semibold">Total Credit:</p>
            <p className="text-lg">{totalCredit}</p>
          </div>
          <div>
            <p className="font-semibold">Grade Point Average:</p>
            <p className="text-lg">{gpaAverage}</p>
          </div>
          <div>
            <p className="font-semibold">Grade Value:</p>
            <p className="text-lg font-bold">{gradeValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGradeView;
