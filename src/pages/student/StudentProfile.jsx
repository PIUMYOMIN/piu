import React, { useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

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

function StatCard({ title, value, note }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {note ? <p className="mt-1 text-xs text-gray-500">{note}</p> : null}
    </div>
  );
}

export default function StudentProfile() {
  const { user } = useAuth();
  const outletContext = useOutletContext() || {};
  const studentName = user?.name || outletContext?.studentName || "Student";

  const joinedAt = useMemo(() => {
    if (!user?.created_at) return "-";
    const date = new Date(user.created_at);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  }, [user?.created_at]);

  const roleLabel = useMemo(() => {
    const roleValue = user?.role || (Array.isArray(user?.roles) ? user.roles[0] : "");
    return roleValue ? String(roleValue).toUpperCase() : "STUDENT";
  }, [user]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-[#002147] to-[#0a3a72] p-6 text-white shadow">
        <p className="text-sm text-blue-100">Student Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold">{studentName}</h1>
        <p className="mt-2 text-sm text-blue-100">
          Keep your profile up to date and quickly access your learning tools.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="Account Status" value={user ? "Active" : "Unknown"} />
        <StatCard title="Role" value={roleLabel} />
        <StatCard title="Joined Platform" value={joinedAt} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <img
              src={user?.profile || fallbackAvatar}
              alt={studentName}
              className="h-24 w-24 rounded-full border-4 border-blue-100 object-cover"
              onError={(e) => {
                e.currentTarget.src = fallbackAvatar;
              }}
            />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">{studentName}</h2>
            <p className="text-sm text-gray-500">{user?.email || "-"}</p>
          </div>

          <div className="mt-6">
            <InfoRow label="User ID" value={user?.id ? `#${user.id}` : "-"} />
            <InfoRow label="Phone" value={user?.phone || "-"} />
            <InfoRow label="City" value={user?.city || "-"} />
            <InfoRow label="Country" value={user?.country || "-"} />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Academic Snapshot</h3>
            <p className="mt-1 text-sm text-gray-500">
              Profile information shown here comes from your current account.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoRow label="Program" value={user?.program || "Not assigned"} />
              <InfoRow label="Department" value={user?.department || "Not assigned"} />
              <InfoRow label="Current Year" value={user?.year || "-"} />
              <InfoRow label="Student ID" value={user?.student_id || "-"} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                to="/piu/student"
                className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100"
              >
                Refresh Profile View
              </Link>
              <Link
                to="/"
                className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-100"
              >
                Go to Main Website
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
