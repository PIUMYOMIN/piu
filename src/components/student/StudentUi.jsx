import React from "react";
import { Link } from "react-router-dom";
import { buildDashboardPath, STUDENT_TABS } from "../../utils/dashboardTabs";

export function StudentHero({ eyebrow, title, subtitle }) {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-[#002147] to-[#0a3a72] p-6 text-white shadow">
      {eyebrow ? <p className="text-sm text-blue-100">{eyebrow}</p> : null}
      <h1 className="mt-1 text-3xl font-bold">{title}</h1>
      {subtitle ? <p className="mt-2 text-sm text-blue-100">{subtitle}</p> : null}
    </section>
  );
}

export function StatCard({ title, value, note, tone = "blue" }) {
  const tones = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    green: "border-green-100 bg-green-50 text-green-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    purple: "border-purple-100 bg-purple-50 text-purple-700",
  };

  return (
    <div className={`rounded-xl border p-5 shadow-sm ${tones[tone] || tones.blue}`}>
      <p className="text-sm opacity-80">{title}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value ?? "—"}</p>
      {note ? <p className="mt-1 text-xs text-gray-600">{note}</p> : null}
    </div>
  );
}

export function Panel({ title, children, action }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function EmptyState({ message, actionLabel, actionTo, tab }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
      <p>{message}</p>
      {actionLabel && actionTo ? (
        <Link
          to={tab ? buildDashboardPath(actionTo, tab) : actionTo}
          className="mt-3 inline-flex rounded-lg bg-[#002147] px-4 py-2 text-sm font-medium text-white hover:bg-[#003366]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-gray-100 bg-white p-6 text-gray-500">
      {label}
    </div>
  );
}

export function QuickLink({ to, tab, label, tone = "blue" }) {
  const tones = {
    blue: "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100",
    green: "border-green-100 bg-green-50 text-green-700 hover:bg-green-100",
    purple: "border-purple-100 bg-purple-50 text-purple-700 hover:bg-purple-100",
    amber: "border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100",
  };

  return (
    <Link
      to={tab ? buildDashboardPath(to, tab) : to}
      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${tones[tone] || tones.blue}`}
    >
      {label}
    </Link>
  );
}

export { STUDENT_TABS };
