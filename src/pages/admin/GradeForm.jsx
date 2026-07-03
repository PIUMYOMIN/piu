import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { adminApi } from "../../api/admin";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";
import {
  YEAR_LABELS,
  getStudentDisplayName,
  markToGradePoint,
  markToGradeValue,
  resolveSemesterIdFromSlug,
  resolveYearIdFromSlug,
  semesterLabelFromSlug,
} from "../../utils/gradingHelpers";

const EMPTY_FORM = {
  assignment_id: "",
  module_id: "",
  mark: "",
  grade_point: "",
  grade_value: "",
};

export default function GradeForm() {
  const { studentId, year, semester, gradeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess, showError, Toast } = useFloatingToast();

  const isEdit = Boolean(gradeId);
  const passedStudent = location.state?.student;
  const passedGrade = location.state?.grade;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [student, setStudent] = useState(passedStudent || null);
  const [assignments, setAssignments] = useState([]);
  const [modules, setModules] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);

  const courseId = student?.course_id ?? student?.course?.id;
  const yearId = resolveYearIdFromSlug(years, year);
  const semesterId = resolveSemesterIdFromSlug(semesters, semester);
  const semesterLabel = semesterLabelFromSlug(semester);
  const yearLabel = YEAR_LABELS[year] || year;

  const gradeViewPath = `/piu/admin/students/${studentId}/${year}/${semester}`;

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const programParams = { student_id: studentId };

        const [studentData, assignmentsData, modulesData, yearsData, semestersData] = await Promise.all([
          passedStudent ? Promise.resolve(passedStudent) : adminApi.students.get(studentId),
          adminApi.assignments.list(programParams),
          adminApi.modules.list(programParams),
          adminApi.meta.years(),
          adminApi.meta.semesters(),
        ]);

        if (!mounted) return;

        const resolvedStudent = passedStudent || studentData;
        setStudent(resolvedStudent);
        setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
        setModules(Array.isArray(modulesData) ? modulesData : []);
        setYears(Array.isArray(yearsData) ? yearsData : []);
        setSemesters(Array.isArray(semestersData) ? semestersData : []);

        if (isEdit && passedGrade) {
          setForm({
            assignment_id: String(passedGrade.assignment_id || ""),
            module_id: String(passedGrade.module_id || ""),
            mark: passedGrade.mark != null ? String(passedGrade.mark) : "",
            grade_point:
              passedGrade.grade_point != null
                ? String(passedGrade.grade_point)
                : passedGrade.gpaPoint != null
                  ? String(passedGrade.gpaPoint)
                  : "",
            grade_value: passedGrade.grade_value || passedGrade.gpaValue || "",
          });
        } else if (isEdit && gradeId) {
          const result = await adminApi.grades.forStudent(studentId);
          const grade = (Array.isArray(result?.data) ? result.data : []).find(
            (g) => String(g.id) === String(gradeId)
          );
          if (grade) {
            setForm({
              assignment_id: String(grade.assignment_id || ""),
              module_id: String(grade.module_id || ""),
              mark: grade.mark != null ? String(grade.mark) : "",
              grade_point: grade.grade_point != null ? String(grade.grade_point) : "",
              grade_value: grade.grade_value || "",
            });
          }
        }
      } catch (err) {
        if (!mounted) return;
        setError(getApiErrorMessage(err, "Failed to load grade form"));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [studentId, gradeId, isEdit, passedStudent, passedGrade]);

  const assignmentsById = useMemo(
    () => new Map(assignments.map((a) => [String(a.id), a])),
    [assignments]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "assignment_id" && value) {
        const assignment = assignmentsById.get(String(value));
        if (assignment?.module_id) next.module_id = String(assignment.module_id);
      }
      if (name === "mark" && value !== "") {
        next.grade_point = markToGradePoint(value);
        next.grade_value = markToGradeValue(value);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student || !courseId || !yearId) {
      showError("Missing student or academic year information.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        mark: Number(form.mark),
        grade_point: Number(form.grade_point),
        grade_value: form.grade_value,
      };

      if (isEdit) {
        await adminApi.grades.update(gradeId, {
          ...payload,
          semester_id: semesterId || undefined,
        });
        showSuccess("Grade updated.");
      } else {
        await adminApi.grades.save({
          student_id: Number(studentId),
          course_id: Number(courseId),
          assignment_id: Number(form.assignment_id),
          module_id: Number(form.module_id),
          year_id: Number(yearId),
          semester_id: semesterId || undefined,
          ...payload,
        });
        showSuccess("Grade recorded.");
      }

      navigate(gradeViewPath, {
        state: {
          ...student,
          name: getStudentDisplayName(student),
          studentId: student.student_id || student.studentId || "",
          program: student.program || student.course?.title || "",
        },
      });
    } catch (err) {
      showError(getApiErrorMessage(err, isEdit ? "Failed to update grade" : "Failed to save grade"));
    } finally {
      setSaving(false);
    }
  };

  const studentName = getStudentDisplayName(student);
  const programName = student?.program || student?.course?.title || "—";

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-full overflow-hidden rounded-xl bg-white p-8 text-center text-gray-500 shadow-md">
        Loading grade form...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-full overflow-hidden rounded-xl bg-white shadow-md">
      <Toast />
      <div className="bg-[#002147] px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link to={gradeViewPath} className="text-white hover:text-gray-200">
            <FaArrowLeft />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              {isEdit ? "Edit Grading" : "Add Grading"}
            </h2>
            <p className="mt-1 text-sm text-blue-100">
              {studentName} — {programName} — {yearLabel} — {semesterLabel}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Student Name</label>
            <input
              type="text"
              value={studentName}
              readOnly
              className="w-full rounded border bg-gray-100 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Academic Year</label>
            <input
              type="text"
              value={yearLabel}
              readOnly
              className="w-full rounded border bg-gray-100 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Semester</label>
            <input
              type="text"
              value={semesterLabel}
              readOnly
              className="w-full rounded border bg-gray-100 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Study Program</label>
            <input
              type="text"
              value={programName}
              readOnly
              className="w-full rounded border bg-gray-100 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Assignment</label>
            <select
              name="assignment_id"
              value={form.assignment_id}
              onChange={handleChange}
              required
              disabled={isEdit}
              className="w-full rounded border px-3 py-2 disabled:bg-gray-100"
            >
              <option value="">Select assignment</option>
              {assignments.map((a) => (
                <option key={a.id} value={String(a.id)}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Module</label>
            <select
              name="module_id"
              value={form.module_id}
              onChange={handleChange}
              required
              disabled={isEdit}
              className="w-full rounded border px-3 py-2 disabled:bg-gray-100"
            >
              <option value="">Select module</option>
              {modules.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.module_code ? `${m.module_code} — ` : ""}
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mark (0–100)</label>
            <input
              type="number"
              name="mark"
              value={form.mark}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Grade Point</label>
            <input
              type="number"
              name="grade_point"
              value={form.grade_point}
              onChange={handleChange}
              min="0"
              max="4"
              step="0.1"
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Grade Value</label>
            <input
              type="text"
              name="grade_value"
              value={form.grade_value}
              onChange={handleChange}
              placeholder="A, B+, C, ..."
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Submit"}
          </button>
          <Link
            to={gradeViewPath}
            className="rounded border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
