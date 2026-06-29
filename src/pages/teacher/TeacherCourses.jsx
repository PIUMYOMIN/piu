import React, { useEffect, useState } from "react";
import { teacherApi } from "../../api/teacher";
import { toStorageUrl } from "../../utils/api";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, Panel, StatCard, StudentHero } from "../../components/student/StudentUi";

export default function TeacherCourses() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await teacherApi.courses();
        if (mounted) setCourses(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setError(getApiErrorMessage(e, "Failed to load courses"));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = courses.filter((c) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      String(c.title || "").toLowerCase().includes(q) ||
      String(c.code || "").toLowerCase().includes(q)
    );
  });

  const active = courses.filter((c) => c.is_active);
  const withApplication = courses.filter((c) => c.application_open);

  if (loading) return <div className="mx-auto max-w-7xl space-y-6"><LoadingState label="Loading courses..." /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <StudentHero
        eyebrow="Courses"
        title="My Programs"
        subtitle="Programs assigned to you by the administrator. All students, modules, and assignments are scoped to these programs."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Courses" value={courses.length} tone="blue" />
        <StatCard title="Active Courses" value={active.length} tone="green" />
        <StatCard title="Open Applications" value={withApplication.length} tone="purple" />
      </section>

      <Panel title="Courses">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title or code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 md:max-w-sm"
          />
        </div>

        {filtered.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <article
                key={course.id}
                className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden"
              >
                {course.image ? (
                  <img
                    src={toStorageUrl(course.image)}
                    alt={course.title}
                    className="h-36 w-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <div className="h-36 w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <span className="text-3xl text-blue-300">📚</span>
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">{course.title}</h3>
                    <span
                      className={`shrink-0 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        course.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {course.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {course.code && (
                    <p className="text-xs text-gray-500 font-mono">{course.code}</p>
                  )}
                  {course.duration && (
                    <p className="text-xs text-gray-600">Duration: {course.duration}</p>
                  )}
                  {course.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">{course.description}</p>
                  )}
                  {course.application_open && (
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      Applications open
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message={search ? "No courses match your search." : "No courses found."} />
        )}
      </Panel>
    </div>
  );
}
