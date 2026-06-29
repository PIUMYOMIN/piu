import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, Panel, StatCard, StudentHero } from "../../components/student/StudentUi";

function gpaColor(gpa) {
  if (gpa == null) return "text-gray-400";
  if (gpa >= 3.5) return "text-green-700";
  if (gpa >= 2.5) return "text-blue-700";
  if (gpa >= 1.5) return "text-amber-700";
  return "text-red-600";
}

export default function TeacherGrades() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gradingList, setGradingList] = useState([]);
  const [students, setStudents] = useState([]);
  const [years, setYears] = useState([]);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [gData, sData, yData] = await Promise.all([
          adminApi.students.list(),
          adminApi.students.list(),
          adminApi.meta.years(),
        ]);
        if (mounted) {
          setStudents(Array.isArray(sData) ? sData : []);
          setYears(Array.isArray(yData) ? yData : []);
        }
      } catch (e) {
        if (mounted) setError(getApiErrorMessage(e, "Failed to load grading data"));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const yearsById = useMemo(() => new Map(years.map((y) => [String(y.id), y])), [years]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const matchSearch =
        !q ||
        String(s.name || "").toLowerCase().includes(q) ||
        String(s.student_id || "").toLowerCase().includes(q);
      const yearId = s.year_id ?? s.year?.id;
      const matchYear = yearFilter === "all" || String(yearId) === yearFilter;
      return matchSearch && matchYear;
    });
  }, [students, search, yearFilter]);

  if (loading) return <div className="mx-auto max-w-7xl space-y-6"><LoadingState label="Loading grading data..." /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <StudentHero
        eyebrow="Grades"
        title="Student Grades"
        subtitle="Review grading records per student. Click a student to view detailed grade breakdowns by year and semester."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard title="Total Students" value={students.length} tone="blue" />
        <StatCard title="Showing" value={filtered.length} tone="purple" />
      </section>

      <Panel title="Student Grade Records">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search by name or student ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:max-w-xs"
          />
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none sm:max-w-xs"
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y.id} value={String(y.id)}>{y.name}</option>
            ))}
          </select>
        </div>

        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="pb-3 pr-4">Student</th>
                  <th className="pb-3 pr-4">Student ID</th>
                  <th className="pb-3 pr-4">Year</th>
                  <th className="pb-3 pr-4">GPA</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const yearId = s.year_id ?? s.year?.id;
                  const yearName = s.year?.name || yearsById.get(String(yearId))?.name || "—";
                  const gpa = s.average_gpa ?? s.gpa ?? null;
                  return (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-900">{s.name}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-gray-500">{s.student_id || "—"}</td>
                      <td className="py-3 pr-4 text-gray-600">{yearName}</td>
                      <td className="py-3 pr-4">
                        <span className={`font-semibold ${gpaColor(gpa)}`}>
                          {gpa != null ? Number(gpa).toFixed(2) : "—"}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link
                          to={`/piu/admin/students/${s.id}/grading`}
                          className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                          View grades
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message={search || yearFilter !== "all" ? "No students match your filters." : "No students found."} />
        )}
      </Panel>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>Note:</strong> Detailed grade entry and editing is managed in the admin grade forms. The "View grades" link opens the grade breakdown view.
      </div>
    </div>
  );
}
