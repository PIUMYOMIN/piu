import React, { useEffect, useMemo, useState } from "react";
import { teacherApi } from "../../api/teacher";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, Panel, StatCard, StudentHero } from "../../components/student/StudentUi";

export default function TeacherModules() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const params = courseFilter !== "all" ? { course_id: courseFilter } : {};
        const [mData, cData] = await Promise.all([
          teacherApi.modules(params),
          teacherApi.courses(),
        ]);
        if (mounted) {
          setModules(Array.isArray(mData) ? mData : []);
          setCourses(Array.isArray(cData) ? cData : []);
        }
      } catch (e) {
        if (mounted) setError(getApiErrorMessage(e, "Failed to load modules"));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [courseFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return modules.filter(
      (m) =>
        !q ||
        String(m.name || "").toLowerCase().includes(q) ||
        String(m.module_code || "").toLowerCase().includes(q)
    );
  }, [modules, search]);

  if (loading) return <div className="mx-auto max-w-7xl space-y-6"><LoadingState label="Loading modules..." /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <StudentHero
        eyebrow="Course Modules"
        title="Program Modules"
        subtitle="Modules linked to your assigned programs through curricula or assignments."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Modules" value={modules.length} tone="blue" />
        <StatCard title="Showing" value={filtered.length} tone="purple" />
        <StatCard title="With Assignments" value={modules.filter((m) => Number(m.assignments_count || 0) > 0).length} tone="amber" />
      </section>

      <Panel title="Modules">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search by name or code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 md:max-w-sm"
          />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none md:max-w-xs"
          >
            <option value="all">All My Programs</option>
            {courses.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.title}</option>
            ))}
          </select>
        </div>

        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="pb-3 pr-4">Code</th>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Credit Hours</th>
                  <th className="pb-3 pr-4">Assignments</th>
                  <th className="pb-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 pr-4 font-mono text-xs text-gray-600 whitespace-nowrap">
                      {m.module_code || "—"}
                    </td>
                    <td className="py-3 pr-4 font-medium text-gray-900 whitespace-nowrap">
                      {m.name}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{m.credit_hours ?? m.credit ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        Number(m.assignments_count || 0) > 0
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {m.assignments_count || 0}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600 max-w-xs">
                      <p className="line-clamp-2">{m.description || "—"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message={search || courseFilter !== "all" ? "No modules match your filters." : "No modules found for your programs."} />
        )}
      </Panel>
    </div>
  );
}
