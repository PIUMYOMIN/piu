import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { teacherApi } from "../../api/teacher";
import ProfileAvatar from "../../components/common/ProfileAvatar";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, Panel, StatCard, StudentHero } from "../../components/student/StudentUi";

export default function TeacherStudents() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [years, setYears] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const params = courseFilter !== "all" ? { course_id: courseFilter } : {};
        const [sData, cData, yData] = await Promise.all([
          teacherApi.students(params),
          teacherApi.courses(),
          adminApi.meta.years(),
        ]);
        if (mounted) {
          setStudents(Array.isArray(sData) ? sData : []);
          setCourses(Array.isArray(cData) ? cData : []);
          setYears(Array.isArray(yData) ? yData : []);
        }
      } catch (e) {
        if (mounted) setError(getApiErrorMessage(e, "Failed to load students"));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [courseFilter]);

  const yearsById = useMemo(() => new Map(years.map((y) => [String(y.id), y])), [years]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const matchSearch =
        !q ||
        String(s.name || "").toLowerCase().includes(q) ||
        String(s.student_id || "").toLowerCase().includes(q) ||
        String(s.email || "").toLowerCase().includes(q);
      const yearId = s.year_id ?? s.year?.id;
      const matchYear = yearFilter === "all" || String(yearId) === yearFilter;
      return matchSearch && matchYear;
    });
  }, [students, search, yearFilter]);

  const activeCount = students.filter((s) => s.is_active || s.active).length;

  if (loading) return <div className="mx-auto max-w-7xl space-y-6"><LoadingState label="Loading students..." /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <StudentHero
        eyebrow="Students"
        title="Program Students"
        subtitle="Students enrolled in your assigned programs only."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {courses.length === 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          No programs are assigned to your account. Ask an administrator to assign teaching programs in Admin → Users.
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Students" value={students.length} tone="blue" />
        <StatCard title="Active" value={activeCount} tone="green" />
        <StatCard title="Showing" value={filtered.length} tone="purple" />
      </section>

      <Panel title="Student Roster">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search by name, ID or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:max-w-xs"
          />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none sm:max-w-xs"
          >
            <option value="all">All My Programs</option>
            {courses.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.title}</option>
            ))}
          </select>
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => {
              const yearId = s.year_id ?? s.year?.id;
              const yearName = s.year?.name || yearsById.get(String(yearId))?.name || null;
              const programName = s.course?.title || null;
              const isActive = s.is_active || s.active;
              return (
                <div
                  key={s.id}
                  className="flex flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <ProfileAvatar user={s} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                      <p className="text-xs text-gray-500 font-mono truncate">{s.student_id || "—"}</p>
                      <p className="text-xs text-gray-500 truncate">{s.email || "—"}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {programName && (
                          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">{programName}</span>
                        )}
                        {yearName && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{yearName}</span>
                        )}
                        <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/piu/teacher/students/${s.id}/grades`}
                    className="mt-3 inline-flex justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    View / grade
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState message={search || yearFilter !== "all" || courseFilter !== "all" ? "No students match your filters." : "No students in your assigned programs."} />
        )}
      </Panel>
    </div>
  );
}
