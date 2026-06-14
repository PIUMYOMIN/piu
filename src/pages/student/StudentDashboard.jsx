import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { studentApi } from "../../api/student";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { buildDashboardPath, STUDENT_TABS } from "../../utils/dashboardTabs";
import {
  EmptyState,
  LoadingState,
  Panel,
  QuickLink,
  StatCard,
  StudentHero,
} from "../../components/student/StudentUi";
import GradeBreakdown from "../../components/student/GradeBreakdown";

const fallbackAvatar =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-800 text-right break-all">{value || "-"}</span>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
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
        if (mounted) setError(getApiErrorMessage(e, "Failed to load student dashboard"));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const student = dashboard?.student || user;
  const stats = dashboard?.stats || {};
  const enrolledProgram = dashboard?.enrolled_program;
  const gradesByYear = dashboard?.grade_summary?.by_year || [];

  const joinedAt = useMemo(() => {
    if (!student?.created_at) return "-";
    const date = new Date(student.created_at);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  }, [student?.created_at]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <LoadingState label="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <StudentHero
        eyebrow="Student Dashboard"
        title={`Welcome, ${student?.name || "Student"}`}
        subtitle="Track your enrolled program, grades, assignments, and academic progress."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Enrolled Program"
          value={stats.enrolled_program || "Not assigned"}
          note={stats.current_year ? `Current year: ${stats.current_year}` : "Program year pending"}
          tone="blue"
        />
        <StatCard
          title="Average GPA"
          value={stats.average_gpa ?? "N/A"}
          note={`${stats.graded_modules || 0} graded module${stats.graded_modules === 1 ? "" : "s"}`}
          tone="green"
        />
        <StatCard
          title="Assignments"
          value={`${stats.assignments_submitted || 0}/${stats.assignments_total || 0}`}
          note="Submitted assignments"
          tone="purple"
        />
        <StatCard
          title="Account Status"
          value={stats.account_status || "Unknown"}
          note={stats.attendance_rate != null ? `Attendance snapshot: ${stats.attendance_rate}%` : undefined}
          tone="amber"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <img
              src={student?.profile || student?.profile_image || fallbackAvatar}
              alt={student?.name || "Student"}
              className="h-24 w-24 rounded-full border-4 border-blue-100 object-cover"
              onError={(e) => {
                e.currentTarget.src = fallbackAvatar;
              }}
            />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">{student?.name || "Student"}</h2>
            <p className="text-sm text-gray-500">{student?.email || "-"}</p>
            <p className="mt-1 text-sm font-medium text-[#002147]">{student?.student_id || "-"}</p>
          </div>

          <div className="mt-6">
            <InfoRow label="Phone" value={student?.phone} />
            <InfoRow label="City" value={student?.city} />
            <InfoRow label="Country" value={student?.country} />
            <InfoRow label="Joined" value={joinedAt} />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Panel title="Attending Program">
            {enrolledProgram ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{enrolledProgram.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {enrolledProgram.description || "No program description available."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-700">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                      {enrolledProgram.year || "Year not set"}
                    </span>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">
                      {enrolledProgram.status}
                    </span>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-800">
                      {stats.modules_in_program || 0} curriculum modules
                    </span>
                  </div>
                </div>
                <Link
                  to={buildDashboardPath("/piu/student/courses", STUDENT_TABS.COURSES)}
                  className="inline-flex text-sm font-medium text-blue-700 hover:text-blue-900"
                >
                  View full program details →
                </Link>
              </div>
            ) : (
              <EmptyState message="You are not assigned to a program yet. Please contact the registrar office." />
            )}
          </Panel>

          <Panel
            title="Grading Points by Year & Semester"
            action={
              <Link
                to={buildDashboardPath("/piu/student/grades", STUDENT_TABS.GRADES)}
                className="text-sm font-medium text-blue-700 hover:text-blue-900"
              >
                View all
              </Link>
            }
          >
            {gradesByYear.length ? (
              <GradeBreakdown byYear={gradesByYear} compact />
            ) : (
              <EmptyState
                message="No grading records yet."
                actionLabel="Open grades"
                actionTo="/piu/student/grades"
                tab={STUDENT_TABS.GRADES}
              />
            )}
          </Panel>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel
          title="Pending Assignments"
          action={
            <Link
              to={buildDashboardPath("/piu/student/assignments", STUDENT_TABS.ASSIGNMENTS)}
              className="text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              View all
            </Link>
          }
        >
          {dashboard?.upcoming_assignments?.length ? (
            <ul className="space-y-3">
              {dashboard.upcoming_assignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <p className="font-medium text-gray-900">{assignment.name}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {assignment.module_name || assignment.course || "General assignment"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="No pending assignments right now." />
          )}
        </Panel>

        <Panel title="Quick Actions">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <QuickLink
              to="/piu/student/courses"
              tab={STUDENT_TABS.COURSES}
              label="My Program & Modules"
              tone="blue"
            />
            <QuickLink
              to="/piu/student/grades"
              tab={STUDENT_TABS.GRADES}
              label="Grading Results"
              tone="green"
            />
            <QuickLink
              to="/piu/student/assignments"
              tab={STUDENT_TABS.ASSIGNMENTS}
              label="Assignments"
              tone="purple"
            />
            <QuickLink
              to="/piu/student/attendance"
              tab={STUDENT_TABS.ATTENDANCE}
              label="Attendance"
              tone="amber"
            />
            <QuickLink
              to="/piu/student/profile"
              tab={STUDENT_TABS.PROFILE}
              label="My Profile"
              tone="blue"
            />
          </div>
        </Panel>
      </section>
    </div>
  );
}
