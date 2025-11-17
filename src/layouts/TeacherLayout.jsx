import React from "react";
import { Outlet } from "react-router-dom";

export default function TeacherLayout() {
  return (
    <div className="font-roboto">
      <div className="p-4 bg-green-600 text-white">
        <h1 className="text-xl font-bold">Teacher Dashboard</h1>
      </div>

      <main className="p-4 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
