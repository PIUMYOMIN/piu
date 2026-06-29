import React, { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../api/admin";
import { toStorageUrl } from "../../utils/api";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, Panel, StatCard, StudentHero } from "../../components/student/StudentUi";

function getInitials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "S";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function TeacherStudents() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        const [sData, yData] = await Promise.all([
          adminApi.students.list(),
          adminApi.meta.years(),
        ]);
        if (mounted) {
          setStudents(Array.isArray(sData) ? sData : []);
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
  }, []);

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
      const matchYear =
        yearFilter === "all" || String(yearId) === yearFilter;
      return matchSearch && matchYear;
    });
  }, [students, search, yearFilter]);

  const activeCount = students.filter((s) => s.is_active || s.active).length;

  if (loading) return <div className="mx-auto max-w-7xl space-y-6"><LoadingState label="Loading students..." /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <StudentHero
        eyebrow="Students"
        title="Student Roster"
        subtitle="View enrolled students, their academic year, and contact details."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Students" value={students.length} tone="blue" />
        <StatCard title="Active" value={activeCount} tone="green" />
        <StatCard title="Showing" value={filtered.length} tone="purple" />
      </section>

      <Panel title="All Students">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search by name, ID or email…"
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => {
              const yearId = s.year_id ?? s.year?.id;
              const yearName = s.year?.name || yearsById.get(String(yearId))?.name || null;
              const isActive = s.is_active || s.active;
              return (
                <div
                  key={s.id}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  {s.profile || s.profile_image ? (
                    <img
                      src={toStorageUrl(s.profile || s.profile_image)}
                      alt={s.name}
                      className="h-12 w-12 rounded-full object-cover border border-gray-200 shrink-0"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-semibold text-sm">{getInitials(s.name)}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                    <p className="text-xs text-gray-500 font-mono truncate">{s.student_id || "—"}</p>
                    <p className="text-xs text-gray-500 truncate">{s.email || "—"}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {yearName && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{yearName}</span>
                      )}
                      <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState message={search || yearFilter !== "all" ? "No students match your filters." : "No students found."} />
        )}
      </Panel>
    </div>
  );
}
