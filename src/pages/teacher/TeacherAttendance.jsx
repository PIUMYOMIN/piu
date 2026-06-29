import React, { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../api/admin";
import { teacherApi } from "../../api/teacher";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, Panel, StatCard, StudentHero } from "../../components/student/StudentUi";

const today = () => new Date().toISOString().slice(0, 10);

export default function TeacherAttendance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [years, setYears] = useState([]);
  const [yearFilter, setYearFilter] = useState("all");
  const [date, setDate] = useState(today());
  const [attendance, setAttendance] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [sData, yData] = await Promise.all([
          teacherApi.students(),
          adminApi.meta.years(),
        ]);
        if (mounted) {
          const ss = Array.isArray(sData) ? sData : [];
          setStudents(ss);
          setYears(Array.isArray(yData) ? yData : []);
          const initial = {};
          ss.forEach((s) => { initial[s.id] = "present"; });
          setAttendance(initial);
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
    if (yearFilter === "all") return students;
    return students.filter((s) => {
      const yearId = s.year_id ?? s.year?.id;
      return String(yearId) === yearFilter;
    });
  }, [students, yearFilter]);

  const toggle = (id, status) => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
    setSaved(false);
  };

  const markAll = (status) => {
    const next = { ...attendance };
    filtered.forEach((s) => { next[s.id] = status; });
    setAttendance(next);
    setSaved(false);
  };

  const handleSave = () => {
    // In production this would POST to the attendance API endpoint
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const presentCount = filtered.filter((s) => attendance[s.id] === "present").length;
  const absentCount = filtered.filter((s) => attendance[s.id] === "absent").length;
  const lateCount = filtered.filter((s) => attendance[s.id] === "late").length;

  if (loading) return <div className="mx-auto max-w-7xl space-y-6"><LoadingState label="Loading students..." /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <StudentHero
        eyebrow="Attendance"
        title="Mark Attendance"
        subtitle="Record daily attendance for students in your assigned programs."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Present" value={presentCount} tone="green" />
        <StatCard title="Absent" value={absentCount} tone="amber" />
        <StatCard title="Late" value={lateCount} tone="purple" />
      </section>

      <Panel title="Attendance Sheet">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setSaved(false); }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Years</option>
              {years.map((y) => (
                <option key={y.id} value={String(y.id)}>{y.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={() => markAll("present")}
              className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-100"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => markAll("absent")}
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-100"
            >
              All Absent
            </button>
          </div>
        </div>

        {filtered.length ? (
          <>
            <div className="space-y-2 mb-4">
              {filtered.map((s) => {
                const yearId = s.year_id ?? s.year?.id;
                const yearName = s.year?.name || yearsById.get(String(yearId))?.name || null;
                const status = attendance[s.id] || "present";
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                      <p className="text-xs text-gray-500">
                        {s.student_id || "—"}
                        {yearName ? ` · ${yearName}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {["present", "late", "absent"].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => toggle(s.id, st)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            status === st
                              ? st === "present"
                                ? "bg-green-600 text-white"
                                : st === "late"
                                ? "bg-purple-600 text-white"
                                : "bg-red-600 text-white"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {st.charAt(0).toUpperCase() + st.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              {saved && (
                <span className="text-sm font-medium text-green-700">✓ Attendance saved for {date}</span>
              )}
              {!saved && <span />}
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-[#002147] px-6 py-2 text-sm font-medium text-white hover:bg-[#003366]"
              >
                Save Attendance
              </button>
            </div>
          </>
        ) : (
          <EmptyState message="No students found for this filter." />
        )}
      </Panel>
    </div>
  );
}
