import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";
import ManagementFilters from "../../components/admin/ManagementFilters";

const AssignmentsList = () => {
  const { showSuccess, showError, Toast } = useFloatingToast();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [aData, cData, mData] = await Promise.all([
          adminApi.assignments.list(),
          adminApi.courses.list(),
          adminApi.modules.list(),
        ]);
        setAssignments(Array.isArray(aData) ? aData : []);
        setCourses(Array.isArray(cData) ? cData : []);
        setModules(Array.isArray(mData) ? mData : []);
      } catch (e) {
        showError(getApiErrorMessage(e, "Failed to load assignments"));
        setAssignments([]);
        setError(getApiErrorMessage(e, "Failed to load assignments"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const coursesById = useMemo(() => new Map(courses.map((c) => [String(c.id), c])), [courses]);
  const modulesById = useMemo(() => new Map(modules.map((m) => [String(m.id), m])), [modules]);

  const courseOptions = useMemo(
    () => [
      { value: "all", label: "All Courses" },
      ...courses.map((c) => ({ value: String(c.id), label: c.title || `Course #${c.id}` })),
    ],
    [courses]
  );

  const filteredAssignments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assignments.filter((a) => {
      const course = coursesById.get(String(a.course_id));
      const module = modulesById.get(String(a.module_id));
      const matchesSearch =
        !q ||
        String(a.name || "").toLowerCase().includes(q) ||
        String(course?.title || "").toLowerCase().includes(q) ||
        String(module?.module_code || "").toLowerCase().includes(q);
      const matchesCourse =
        courseFilter === "all" || String(a.course_id) === courseFilter;
      return matchesSearch && matchesCourse;
    });
  }, [assignments, search, courseFilter, coursesById, modulesById]);

  const resetFilters = () => {
    setSearch("");
    setCourseFilter("all");
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await adminApi.assignments.remove(id);
      const data = await adminApi.assignments.list();
      setAssignments(Array.isArray(data) ? data : []);
      showSuccess("Assignment deleted successfully!");
    } catch (e) {
      showError(getApiErrorMessage(e, "Failed to delete assignment"));
      setError(getApiErrorMessage(e, "Failed to delete assignment"));
    }
  };

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <Toast />
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="text-blue-100 mt-1">Manage all assignments</p>
        </div>
        <Link
          to="/piu/admin/assignments/add"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
        >
          + Add Assignment
        </Link>
      </div>

      {/* Table */}
      <div className="p-6 overflow-x-auto">
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <ManagementFilters
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search assignments..."
          filters={[
            {
              key: "course",
              value: courseFilter,
              onChange: setCourseFilter,
              options: courseOptions,
            },
          ]}
          onReset={resetFilters}
          summary={`Showing ${filteredAssignments.length} of ${assignments.length} assignments`}
        />

        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Assignment</th>
              <th className="px-4 py-2 border">Course</th>
              <th className="px-4 py-2 border">Module</th>
              <th className="px-4 py-2 border">Subject</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 border">
                  Loading assignments...
                </td>
              </tr>
            )}

            {!loading && filteredAssignments.length > 0 ? (
              filteredAssignments.map((a, index) => {
                const course = coursesById.get(String(a.course_id));
                const module = modulesById.get(String(a.module_id));
                const subjectName =
                  typeof a.subject === "object" && a.subject !== null
                    ? a.subject.name
                    : a.subject || "—";
                return (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{a.name}</td>
                  <td className="px-4 py-2 border">{course?.title || "—"}</td>
                  <td className="px-4 py-2 border">
                    {module?.module_code || "—"}
                    {module?.name ? ` — ${module.name}` : ""}
                  </td>
                  <td className="px-4 py-2 border">{subjectName}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex gap-3">
                      <Link
                        to={`/piu/admin/assignments/edit/${a.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(a.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            ) : (
              !loading && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 text-gray-500 border"
                  >
                    No assignments found
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentsList;
