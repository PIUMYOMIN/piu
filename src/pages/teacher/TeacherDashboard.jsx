import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { teacherApi } from "../../api/teacher";
import ProfileAvatar from "../../components/common/ProfileAvatar";
import { EmptyState, LoadingState, Panel, QuickLink, StatCard, StudentHero } from "../../components/student/StudentUi";
import { TEACHER_TABS, buildDashboardPath } from "../../utils/dashboardTabs";

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-800 text-right break-all">{value || "—"}</span>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ courses: 0, assignments: 0, students: 0, modules: 0 });
  const [programs, setPrograms] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await teacherApi.dashboard();
        if (!mounted) return;
        setStats(data?.stats || { courses: 0, assignments: 0, students: 0, modules: 0 });
        setPrograms(Array.isArray(data?.assigned_programs) ? data.assigned_programs : []);
        setRecentAssignments(Array.isArray(data?.recent_assignments) ? data.recent_assignments : []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const name = user?.name || "Teacher";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <StudentHero
        eyebrow="Teacher Dashboard"
        title={`Welcome, ${name}`}
        subtitle="You only see students, modules, assignments, and grades for programs assigned to you."
      />

      {loading ? (
        <LoadingState label="Loading dashboard…" />
      ) : (
        <>
          {programs.length === 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              No programs are assigned to your account yet. Ask an administrator to assign your teaching programs in Admin → Users.
            </div>
          )}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="My Programs" value={stats.courses} tone="blue" note="Assigned to you" />
            <StatCard title="Program Modules" value={stats.modules} tone="purple" note="Linked to your programs" />
            <StatCard title="Assignments" value={stats.assignments} tone="green" note="In your programs only" />
            <StatCard title="Students" value={stats.students} tone="amber" note="Enrolled in your programs" />
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-1">
              <div className="flex flex-col items-center text-center">
                <ProfileAvatar user={user} size="lg" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{name}</h2>
                <p className="text-sm text-gray-500">{user?.email || "—"}</p>
                {programs.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {programs.map((course) => (
                      <span key={course.id} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
                        {course.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-6">
                <InfoRow label="Phone" value={user?.phone} />
                <InfoRow label="Programs" value={programs.map((p) => p.title).join(", ") || "None assigned"} />
              </div>
              <div className="mt-4">
                <Link
                  to="/piu/teacher/profile"
                  className="block w-full rounded-lg border border-gray-200 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <Panel
                title="Recent Assignments"
                action={
                  <Link to={buildDashboardPath("/piu/teacher/assignments", "assignments")} className="text-sm font-medium text-blue-700 hover:text-blue-900">
                    View all
                  </Link>
                }
              >
                {recentAssignments.length ? (
                  <ul className="space-y-3">
                    {recentAssignments.map((a) => (
                      <li key={a.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                        <p className="font-medium text-gray-900 text-sm">{a.name}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{a.course?.title || "Program"}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState message="No assignments in your assigned programs yet." />
                )}
              </Panel>

              <Panel title="Quick Actions">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <QuickLink to="/piu/teacher/courses" tab={TEACHER_TABS.COURSES} label="My Programs" tone="blue" />
                  <QuickLink to="/piu/teacher/modules" tab={TEACHER_TABS.MODULES} label="Program Modules" tone="purple" />
                  <QuickLink to="/piu/teacher/assignments" tab={TEACHER_TABS.ASSIGNMENTS} label="Assignments" tone="green" />
                  <QuickLink to="/piu/teacher/students" tab={TEACHER_TABS.STUDENTS} label="Students" tone="amber" />
                  <QuickLink to="/piu/teacher/grades" tab={TEACHER_TABS.GRADES} label="Grade Students" tone="blue" />
                </div>
              </Panel>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
