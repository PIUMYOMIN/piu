import React, { useEffect, useState } from "react";
import { studentApi } from "../../api/student";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, Panel, StudentHero } from "../../components/student/StudentUi";

export default function StudentCourses() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await studentApi.courses();
        if (mounted) setData(response);
      } catch (e) {
        if (mounted) setError(getApiErrorMessage(e, "Failed to load program information"));
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
        <LoadingState label="Loading your program..." />
      </div>
    );
  }

  const program = data?.enrolled_program;
  const curriculum = data?.curriculum || [];
  const joinedCourses = data?.joined_courses || [];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <StudentHero
        eyebrow="My Courses"
        title="Enrolled Program"
        subtitle="View the program you are attending and the modules in your current curriculum."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Panel title="Primary Program">
        {program ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
            {program.image_url ? (
              <img
                src={program.image_url}
                alt={program.title}
                className="h-40 w-full rounded-lg object-cover lg:h-full"
              />
            ) : null}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{program.title}</h3>
              <p className="mt-2 text-sm text-gray-600">
                {program.description || "No description available for this program."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                  Year: {program.year || "Not set"}
                </span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">
                  Status: {program.status}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState message="No primary program is assigned to your account yet." />
        )}
      </Panel>

      {joinedCourses.length > 0 && (
        <Panel title="Additional Enrollments">
          <ul className="space-y-3">
            {joinedCourses.map((course) => (
              <li
                key={course.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <span className="font-medium text-gray-900">{course.title || `Course #${course.course_id}`}</span>
                <span className="text-sm text-gray-500">
                  Joined {course.joined_at ? new Date(course.joined_at).toLocaleDateString() : "-"}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel title="Curriculum Modules">
        {curriculum.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-2 pr-3">Module</th>
                  <th className="py-2 pr-3">Code</th>
                  <th className="py-2 pr-3">Credit</th>
                  <th className="py-2">Year</th>
                </tr>
              </thead>
              <tbody>
                {curriculum.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 pr-3">
                      <div className="font-medium text-gray-900">{item.module_name || item.title}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </td>
                    <td className="py-3 pr-3">{item.module_code || "-"}</td>
                    <td className="py-3 pr-3">{item.credit ?? "-"}</td>
                    <td className="py-3">{item.year || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No curriculum modules are available for your current program and year." />
        )}
      </Panel>
    </div>
  );
}
