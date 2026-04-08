import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Panel({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { teacherName } = useOutletContext() || {};
  const name = user?.name || teacherName || "Teacher";
  const role = String(
    user?.role ?? (Array.isArray(user?.roles) ? user.roles[0] : "teacher")
  ).toUpperCase();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-[#002147] to-[#0a3a72] p-6 text-white shadow">
        <p className="text-sm text-blue-100">Teacher Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold">Welcome, {name}</h1>
        <p className="mt-2 text-sm text-blue-100">
          Manage courses, assignments, and student progress from one place.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Role</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{role}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Email</p>
          <p className="mt-1 text-base font-semibold text-gray-900 break-all">{user?.email || "-"}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Status</p>
          <p className="mt-1 text-2xl font-bold text-green-700">Active</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Teaching Tools">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link to="/piu/teacher/courses" className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100">
              My Courses
            </Link>
            <Link to="/piu/teacher/assignments/create" className="rounded-lg border border-purple-100 bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 hover:bg-purple-100">
              Create Assignment
            </Link>
            <Link to="/piu/teacher/grades" className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-100">
              Grade Students
            </Link>
            <Link to="/piu/teacher/attendance" className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 hover:bg-amber-100">
              Mark Attendance
            </Link>
          </div>
        </Panel>

        <Panel title="Profile Overview">
          <div className="space-y-3 text-sm text-gray-700">
            <p><span className="font-medium text-gray-500">Name:</span> {name}</p>
            <p><span className="font-medium text-gray-500">Email:</span> {user?.email || "-"}</p>
            <p><span className="font-medium text-gray-500">Phone:</span> {user?.phone || "-"}</p>
            <p><span className="font-medium text-gray-500">Department:</span> {user?.department || "-"}</p>
          </div>
        </Panel>
      </section>
    </div>
  );
}
