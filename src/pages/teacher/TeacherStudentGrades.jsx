import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { teacherApi } from "../../api/teacher";
import ProfileAvatar from "../../components/common/ProfileAvatar";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, Panel, StudentHero } from "../../components/student/StudentUi";

const EMPTY_FORM = {
  assignment_id: "",
  module_id: "",
  year_id: "",
  mark: "",
  grade_point: "",
  grade_value: "",
};

function markToGradePoint(mark) {
  const m = Number(mark);
  if (Number.isNaN(m)) return "";
  if (m >= 90) return "4.0";
  if (m >= 80) return "3.5";
  if (m >= 70) return "3.0";
  if (m >= 60) return "2.5";
  if (m >= 50) return "2.0";
  return "1.0";
}

function markToGradeValue(mark) {
  const m = Number(mark);
  if (Number.isNaN(m)) return "";
  if (m >= 90) return "A";
  if (m >= 80) return "B+";
  if (m >= 70) return "B";
  if (m >= 60) return "C+";
  if (m >= 50) return "C";
  return "F";
}

export default function TeacherStudentGrades() {
  const { id } = useParams();
  const { showSuccess, showError, Toast } = useFloatingToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [modules, setModules] = useState([]);
  const [years, setYears] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const courseId = student?.course_id ?? student?.course?.id;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await teacherApi.studentGrades(id);
      const s = result?.student || null;
      setStudent(s);
      setGrades(Array.isArray(result?.data) ? result.data : []);

      const cid = s?.course_id ?? s?.course?.id;
      const params = cid ? { course_id: cid } : {};
      const [aData, mData, yData] = await Promise.all([
        teacherApi.assignments(params),
        teacherApi.modules(params),
        adminApi.meta.years(),
      ]);
      setAssignments(Array.isArray(aData) ? aData : []);
      setModules(Array.isArray(mData) ? mData : []);
      setYears(Array.isArray(yData) ? yData : []);
    } catch (e) {
      setError(getApiErrorMessage(e, "Failed to load student grades"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const modulesById = useMemo(() => new Map(modules.map((m) => [String(m.id), m])), [modules]);
  const assignmentsById = useMemo(() => new Map(assignments.map((a) => [String(a.id), a])), [assignments]);

  const onFormChange = (e) => {
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

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (grade) => {
    setEditingId(grade.id);
    setForm({
      assignment_id: String(grade.assignment_id || ""),
      module_id: String(grade.module_id || ""),
      year_id: String(grade.year_id || ""),
      mark: grade.mark != null ? String(grade.mark) : "",
      grade_point: grade.grade_point != null ? String(grade.grade_point) : "",
      grade_value: grade.grade_value || "",
    });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!student || !courseId) return;
    setSaving(true);
    try {
      const payload = {
        student_id: student.id,
        course_id: courseId,
        assignment_id: Number(form.assignment_id),
        module_id: Number(form.module_id),
        year_id: Number(form.year_id),
        mark: Number(form.mark),
        grade_point: Number(form.grade_point),
        grade_value: form.grade_value,
      };

      if (editingId) {
        await teacherApi.updateGrade(editingId, {
          mark: payload.mark,
          grade_point: payload.grade_point,
          grade_value: payload.grade_value,
        });
        showSuccess("Grade updated.");
      } else {
        await teacherApi.saveGrade(payload);
        showSuccess("Grade recorded.");
      }
      resetForm();
      await load();
    } catch (err) {
      showError(getApiErrorMessage(err, "Failed to save grade"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (gradeId) => {
    if (!window.confirm("Delete this grade record?")) return;
    try {
      await teacherApi.deleteGrade(gradeId);
      showSuccess("Grade deleted.");
      if (editingId === gradeId) resetForm();
      await load();
    } catch (err) {
      showError(getApiErrorMessage(err, "Failed to delete grade"));
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <LoadingState label="Loading grades..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Toast />
      <StudentHero
        eyebrow="Grades"
        title={student?.name ? `${student.name} — Grades` : "Student Grades"}
        subtitle="Add and manage grades for this student within your assigned program."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <Link
          to="/piu/teacher/grades"
          className="inline-flex rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          ← Back to grade list
        </Link>
      </div>

      {student && (
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <ProfileAvatar user={student} size="md" />
          <div>
            <p className="font-semibold text-gray-900">{student.name}</p>
            <p className="text-sm text-gray-500 font-mono">{student.student_id || "—"}</p>
            <p className="text-sm text-gray-500">{student.course?.title || "Program"}</p>
          </div>
        </div>
      )}

      <Panel title={editingId ? "Edit Grade" : "Add Grade"}>
        <form onSubmit={save} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Assignment</label>
            <select
              name="assignment_id"
              value={form.assignment_id}
              onChange={onFormChange}
              required
              disabled={Boolean(editingId)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
            >
              <option value="">Select assignment</option>
              {assignments.map((a) => (
                <option key={a.id} value={String(a.id)}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Module</label>
            <select
              name="module_id"
              value={form.module_id}
              onChange={onFormChange}
              required
              disabled={Boolean(editingId)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
            >
              <option value="">Select module</option>
              {modules.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.module_code ? `${m.module_code} — ` : ""}{m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Academic Year</label>
            <select
              name="year_id"
              value={form.year_id}
              onChange={onFormChange}
              required
              disabled={Boolean(editingId)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
            >
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y.id} value={String(y.id)}>{y.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mark (0–100)</label>
            <input
              type="number"
              name="mark"
              min="0"
              max="100"
              step="0.01"
              value={form.mark}
              onChange={onFormChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Grade Point</label>
            <input
              type="number"
              name="grade_point"
              min="0"
              max="4"
              step="0.1"
              value={form.grade_point}
              onChange={onFormChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Grade Value</label>
            <input
              type="text"
              name="grade_value"
              value={form.grade_value}
              onChange={onFormChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Grade" : "Save Grade"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </Panel>

      <Panel title="Grade Records">
        {grades.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="pb-3 pr-4">Assignment</th>
                  <th className="pb-3 pr-4">Module</th>
                  <th className="pb-3 pr-4">Year</th>
                  <th className="pb-3 pr-4">Mark</th>
                  <th className="pb-3 pr-4">Grade</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => {
                  const assignment = g.assignment || assignmentsById.get(String(g.assignment_id));
                  const module = g.module || modulesById.get(String(g.module_id));
                  return (
                    <tr key={g.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 pr-4">{assignment?.name || "—"}</td>
                      <td className="py-3 pr-4">{module?.module_code || module?.name || "—"}</td>
                      <td className="py-3 pr-4">{g.year?.name || "—"}</td>
                      <td className="py-3 pr-4 font-medium">{g.mark ?? "—"}</td>
                      <td className="py-3 pr-4">{g.grade_value || "—"} ({g.grade_point ?? "—"})</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(g)}
                            className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700 hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(g.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No grades recorded yet for this student in your programs." />
        )}
      </Panel>
    </div>
  );
}
