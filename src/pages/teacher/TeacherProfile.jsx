import React from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function TeacherProfile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-4xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">Teacher Profile</h1>
      <p className="mt-1 text-sm text-gray-500">Your account information</p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Full Name</p>
          <p className="mt-1 font-medium text-gray-900">{user?.name || "-"}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Email</p>
          <p className="mt-1 font-medium text-gray-900 break-all">{user?.email || "-"}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Phone</p>
          <p className="mt-1 font-medium text-gray-900">{user?.phone || "-"}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Role</p>
          <p className="mt-1 font-medium text-gray-900">
            {String(
              user?.role ?? (Array.isArray(user?.roles) ? user.roles[0] : "teacher")
            ).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
