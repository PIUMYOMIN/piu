import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { adminApi } from "../../api/admin";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, Panel, QuickLink, StatCard, StudentHero } from "../../components/student/StudentUi";
import { TEACHER_TABS, buildDashboardPath } from "../../utils/dashboardTabs";

const fallbackAvatar =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";

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
  const [recentAssignments, setRecentAssignments] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [aData, cData, sData, mData] = await Promise.all([
          adminApi.assignments.list(),
          adminApi.courses.list(),
          adminApi.students.list(),
          adminApi.modules.list(),
        ]);
        if (mounted) {
          const assignments = Array.isArray(aData) ? aData : [];
          setStats({
            courses: Array.isArray(cData) ? cData.length : 0,
            assignments: assignments.length,
            students: Array.isArray(sData) ? sData.length : 0,
            modules: Array.isArray(mData) ? mData.length : 0,
          });
          setRecentAssignments(assignments.slice(0, 5));
        }
      } catch (e) {
        // Non-critical: dashboard shows zeros on failure
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const name = user?.name || "Teacher";
  const role = String(
    user?.role?.name ?? user?.role ?? (Array.isArray(user?.roles) ? user.roles[0]?.name || user.roles[0] : "teacher")
  ).toUpperCase();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <StudentHero
        eyebrow="Teacher Dashboard"
        title={`Welcome, ${name}`}
        subtitle="Manage your courses, assignments, students, and attendance from one place."
      />

      {loading ? (
        <LoadingState label="Loading dashboard…" />
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Courses" value={stats.courses} tone="blue"
              note="Available in the system" />
            <StatCard title="Course Modules" value={stats.modules} tone="purple"
              note="Modules in the library" />
            <StatCard title="Assignments" value={stats.assignments} tone="green"
              note="Across all courses" />
            <StatCard title="Students" value={stats.students} tone="amber"
              note="Enrolled students" />
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-1">
              <div className="flex flex-col items-center text-center">
                <img
                  src={user?.profile || user?.profile_image || user?.avatar || fallbackAvatar}
                  alt={name}
                  className="h-24 w-24 rounded-full border-4 border-blue-100 object-cover"
                  onError={(e) => { e.currentTarget.src = fallbackAvatar; }}
                />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{name}</h2>
                <p className="text-sm text-gray-500">{user?.email || "—"}</p>
                <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {role}
                </span>
              </div>
              <div className="mt-6">
                <InfoRow label="Phone" value={user?.phone} />
                <InfoRow label="Department" value={user?.department} />
                <InfoRow label="Status" value="Active" />
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
                  <Link
                    to={buildDashboardPath("/piu/teacher/assignments", "assignments")}
                    className="text-sm font-medium text-blue-700 hover:text-blue-900"
                  >
                    View all
                  </Link>
                }
              >
                {recentAssignments.length ? (
                  <ul className="space-y-3">
                    {recentAssignments.map((a) => (
                      <li
                        key={a.id}
                        className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                      >
                        <p className="font-medium text-gray-900 text-sm">{a.name}</p>
                        {a.description && (
                          <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{a.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState message="No assignments yet." />
                )}
              </Panel>

              <Panel title="Quick Actions">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <QuickLink
                    to="/piu/teacher/courses"
                    tab={TEACHER_TABS.COURSES}
                    label="My Courses"
                    tone="blue"
                  />
                  <QuickLink
                    to="/piu/teacher/modules"
                    tab={TEACHER_TABS.MODULES}
                    label="Course Modules"
                    tone="purple"
                  />
                  <QuickLink
                    to="/piu/teacher/assignments"
                    tab={TEACHER_TABS.ASSIGNMENTS}
                    label="Assignments"
                    tone="green"
                  />
                  <QuickLink
                    to="/piu/teacher/students"
                    tab={TEACHER_TABS.STUDENTS}
                    label="Students"
                    tone="amber"
                  />
                  <QuickLink
                    to="/piu/teacher/grades"
                    tab={TEACHER_TABS.GRADES}
                    label="Grade Students"
                    tone="blue"
                  />
                  <QuickLink
                    to="/piu/teacher/attendance"
                    tab={TEACHER_TABS.ATTENDANCE}
                    label="Mark Attendance"
                    tone="amber"
                  />
                </div>
              </Panel>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
