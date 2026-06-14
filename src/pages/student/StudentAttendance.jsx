import React, { useEffect, useState } from "react";
import { studentApi } from "../../api/student";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, Panel, StatCard, StudentHero } from "../../components/student/StudentUi";

export default function StudentAttendance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await studentApi.dashboard();
        if (mounted) setDashboard(data);
      } catch (e) {
        if (mounted) setError(getApiErrorMessage(e, "Failed to load attendance information"));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <LoadingState label="Loading attendance overview..." />
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const program = dashboard?.enrolled_program;
  const student = dashboard?.student;

  const attendanceRows = [
    {
      label: "Program Attendance",
      value: program ? "Enrolled" : "Not enrolled",
      detail: program?.title || "No program assigned",
    },
    {
      label: "Academic Year",
      value: stats.current_year || "Not set",
      detail: "Current study year",
    },
    {
      label: "Portal Access",
      value: stats.account_status || "Unknown",
      detail: student?.is_active ? "You can access the student portal" : "Portal access is disabled",
    },
    {
      label: "Attendance Snapshot",
      value: stats.attendance_rate != null ? `${stats.attendance_rate}%` : "N/A",
      detail: "Based on your active enrollment status",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <StudentHero
        eyebrow="Attendance"
        title="Program Attendance Overview"
        subtitle="See your enrollment attendance status and academic participation summary."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Enrollment Status"
          value={program?.status || "Not enrolled"}
          note={program?.title}
          tone="blue"
        />
        <StatCard
          title="Attendance Rate"
          value={stats.attendance_rate != null ? `${stats.attendance_rate}%` : "N/A"}
          note="Snapshot from active enrollment"
          tone="green"
        />
        <StatCard
          title="Graded Participation"
          value={stats.graded_modules || 0}
          note="Modules with recorded grades"
          tone="purple"
        />
      </section>

      <Panel title="Attendance Summary">
        {program ? (
          <div className="space-y-3">
            {attendanceRows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{row.label}</p>
                  <p className="text-sm text-gray-500">{row.detail}</p>
                </div>
                <span className="text-sm font-semibold text-[#002147]">{row.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="Attendance tracking will appear once you are enrolled in a program." />
        )}
      </Panel>

      <Panel title="Participation Notes">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
          Detailed session-by-session attendance will be connected when the attendance module is enabled.
          For now, this page reflects your enrolled program, portal access, and graded academic participation.
        </div>
      </Panel>
    </div>
  );
}
