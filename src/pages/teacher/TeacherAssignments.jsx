import React, { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../api/admin";
import { toStorageUrl } from "../../utils/api";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, Panel, StatCard, StudentHero } from "../../components/student/StudentUi";

export default function TeacherAssignments() {
  const { showSuccess, showError, Toast } = useFloatingToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [aData, cData, mData] = await Promise.all([
        adminApi.assignments.list(),
        adminApi.courses.list(),
        adminApi.modules.list(),
      ]);
      setAssignments(Array.isArray(aData) ? aData : []);
      setCourses(Array.isArray(cData) ? cData : []);
      setModules(Array.isArray(mData) ? mData : []);
    } catch (e) {
      setError(getApiErrorMessage(e, "Failed to load assignments"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const coursesById = useMemo(() => new Map(courses.map((c) => [String(c.id), c])), [courses]);
  const modulesById = useMemo(() => new Map(modules.map((m) => [String(m.id), m])), [modules]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assignments.filter((a) => {
      const course = coursesById.get(String(a.course_id));
      const module = modulesById.get(String(a.module_id));
      const matchSearch =
        !q ||
        String(a.name || "").toLowerCase().includes(q) ||
        String(course?.title || "").toLowerCase().includes(q) ||
        String(module?.module_code || "").toLowerCase().includes(q);
      const matchCourse = courseFilter === "all" || String(a.course_id) === courseFilter;
      return matchSearch && matchCourse;
    });
  }, [assignments, search, courseFilter, coursesById, modulesById]);

  const remove = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await adminApi.assignments.remove(id);
      await load();
      showSuccess("Assignment deleted.");
    } catch (e) {
      showError(getApiErrorMessage(e, "Failed to delete assignment"));
    }
  };

  if (loading) return <div className="mx-auto max-w-7xl space-y-6"><LoadingState label="Loading assignments..." /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Toast />
      <StudentHero
        eyebrow="Assignments"
        title="Manage Assignments"
        subtitle="View, review and delete course assignments. Students submit their work through the student portal."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Assignments" value={assignments.length} tone="blue" />
        <StatCard title="Linked to Courses" value={assignments.filter((a) => a.course_id).length} tone="green" />
        <StatCard title="With Files" value={assignments.filter((a) => a.attach_file).length} tone="purple" />
      </section>

      <Panel title="All Assignments">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search by name, course or module…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:max-w-xs"
          />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none sm:max-w-xs"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.title}</option>
            ))}
          </select>
        </div>

        {filtered.length ? (
          <div className="space-y-4">
            {filtered.map((a) => {
              const course = coursesById.get(String(a.course_id));
              const module = modulesById.get(String(a.module_id));
              return (
                <article
                  key={a.id}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{a.name}</h3>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {course?.title || "No course"}
                        {module ? ` · ${module.name}${module.module_code ? ` (${module.module_code})` : ""}` : ""}
                      </p>
                      {a.description && (
                        <p className="mt-2 text-sm text-gray-700 line-clamp-2">{a.description}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {a.attach_file && (
                        <a
                          href={toStorageUrl(a.attach_file)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                          Brief file
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(a.id)}
                        className="inline-flex rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState message={search || courseFilter !== "all" ? "No assignments match your filters." : "No assignments found."} />
        )}
      </Panel>
    </div>
  );
}
