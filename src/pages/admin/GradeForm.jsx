// src/pages/admin/grades/GradeForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const MODULE_OPTIONS = [
  { code: "ICT101", label: "Introduction to Programming" },
  { code: "ICT102", label: "Computer Systems" },
  { code: "BUS201", label: "Marketing Fundamentals" },
  { code: "ENG110", label: "English Composition" },
];

const YEAR_OPTIONS = [
  { value: "first", label: "First Year" },
  { value: "second", label: "Second Year" },
  { value: "third", label: "Third Year" },
  { value: "fourth", label: "Fourth Year" },
];

export default function GradeForm() {
  const { studentId, semester, gradeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // If we came from SemesterView (edit mode)
  const passedStudent = location.state?.student;
  const passedGrade = location.state?.grade;

  // Check if we are editing
  const isEdit = Boolean(gradeId);

  const [form, setForm] = useState({
    studentName: "",
    year: "",
    semester: semester || "",
    moduleCode: "",
    assignment: "",
    marks: "",
    gpaPoint: "",
    gpaValue: "",
  });

  // Prefill when editing
  useEffect(() => {
    if (isEdit && passedStudent && passedGrade) {
      setForm({
        studentName: passedStudent.name,
        year: passedGrade.year || "",
        semester: semester,
        moduleCode: passedGrade.moduleCode || "",
        assignment: passedGrade.assignment || "",
        marks: passedGrade.marks || "",
        gpaPoint: passedGrade.gpaPoint || "",
        gpaValue: passedGrade.gpaValue || "",
      });
    }
  }, [isEdit, passedStudent, passedGrade, semester]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      console.log("Update grade:", { gradeId, studentId, semester, ...form });
    } else {
      console.log("Create new grade:", form);
    }

    navigate("/piu/admin/students/add-grading");
  };

  const title = isEdit ? "Edit Grading" : "Add Grading";
  const semesterLabel =
    semester === "first"
      ? "First Semester"
      : semester === "second"
      ? "Second Semester"
      : "";

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Page Title */}
      <div className="bg-[#002147] px-6 py-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name
            </label>
            <input
              type="text"
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              readOnly={isEdit}
              className={`w-full border rounded px-3 py-2 ${
                isEdit ? "bg-gray-100" : ""
              }`}
              required
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose Year
            </label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select year</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y.value} value={y.value}>
                  {y.label}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <input
              type="text"
              value={semesterLabel || form.semester}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Module Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Module Code
            </label>
            <select
              name="moduleCode"
              value={form.moduleCode}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select module</option>
              {MODULE_OPTIONS.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.code} — {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Assignment */}
          <div>
            <label className="block font-medium">Assignments</label>
            <select
              name="assignment"
              value={form.assignment}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Select Assignment --</option>
              <option value="English">English</option>
              <option value="Humanities">Humanities</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>

          {/* Marks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Marks
            </label>
            <input
              type="number"
              name="marks"
              value={form.marks}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min="0"
              max="100"
              required
            />
          </div>

          {/* GPA Point */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GPA Point
            </label>
            <input
              type="number"
              step="0.01"
              name="gpaPoint"
              value={form.gpaPoint}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* GPA Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GPA Value
            </label>
            <input
              type="text"
              name="gpaValue"
              value={form.gpaValue}
              onChange={handleChange}
              placeholder="A, B+, C, ..."
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
          >
            {isEdit ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
