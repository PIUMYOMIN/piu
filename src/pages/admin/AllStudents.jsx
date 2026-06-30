import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { toStorageUrl } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { useConfirmDelete } from "../../contexts/ConfirmContext";
import { getApiErrorMessage } from "../../utils/apiErrors";
import StatusToggle, { parseIsActive } from "../../components/admin/StatusToggle";
import ManagementFilters from "../../components/admin/ManagementFilters";

function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.[0] || "P";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "P";
  return (first + last).toUpperCase();
}

function getYearBadgeClass(yearName = "") {
  const normalized = String(yearName).toLowerCase();
  if (normalized.includes("first")) return "bg-blue-100 text-blue-800";
  if (normalized.includes("second")) return "bg-green-100 text-green-800";
  if (normalized.includes("third")) return "bg-purple-100 text-purple-800";
  if (normalized.includes("fourth")) return "bg-amber-100 text-amber-800";
  return "bg-gray-100 text-gray-700";
}

function AcademicYearBadge({ label }) {
  const text = label || "Not set";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getYearBadgeClass(text)}`}
    >
      {text}
    </span>
  );
}

function resolveStudentYearName(student, yearsById) {
  if (student?.year?.name) return student.year.name;
  const yearId = student?.year_id ?? student?.year?.id;
  if (yearId == null || yearId === "") return null;
  return yearsById.get(String(yearId))?.name || `Year ${yearId}`;
}

function StudentStatCard({ title, value, note, iconClass, iconBg, active, onClick }) {
  const className = `text-left rounded-lg border p-4 transition-colors w-full ${
    active
      ? "border-[#002147] bg-blue-50"
      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
  }`;

  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
          <i className={`${iconClass} text-base`}></i>
        </span>
      </div>
      <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
      {note ? <div className="mt-1 text-sm text-gray-600">{note}</div> : null}
      {active ? (
        <span className="mt-2 inline-flex rounded-full bg-[#002147] px-2 py-1 text-xs font-semibold text-white">
          Filter active
        </span>
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}

const AllStudents = () => {
  const { user: authUser } = useAuth();
  const { showSuccess, showError, Toast } = useFloatingToast();
  const confirmDeleteAction = useConfirmDelete();
  const currentRole = String(
    authUser?.role?.name ??
      authUser?.role ??
      (Array.isArray(authUser?.roles) ? authUser.roles[0]?.name || authUser.roles[0] : "")
  ).toLowerCase();
  const isAdmin = currentRole === "admin";
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [togglingId, setTogglingId] = useState(null);
  const pageSize = 10;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [studentsData, coursesData, yearsData] = await Promise.all([
        adminApi.students.list(),
        adminApi.courses.list(),
        adminApi.meta.years(),
      ]);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setYears(Array.isArray(yearsData) ? yearsData : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load students");
      showError(getApiErrorMessage(e, "Failed to load students"));
      setStudents([]);
      setCourses([]);
      setYears([]);
    } finally {
      setLoading(false);
    }
  };

  const removeStudent = async (student) => {
    const ok = await confirmDeleteAction({
      itemName: student?.name || student?.email,
      itemType: "student",
    });
    if (!ok) return;
    try {
      await adminApi.students.remove(student.id);
      showSuccess("Student deleted successfully!");
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete student");
      showError(getApiErrorMessage(e, "Failed to delete student"));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const coursesById = useMemo(() => new Map(courses.map((c) => [String(c.id), c])), [courses]);
  const yearsById = useMemo(() => new Map(years.map((y) => [String(y.id), y])), [years]);

  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return students.filter((student) => {
      const programId = student.course_id ?? student.course?.id;
      const course = coursesById.get(String(programId));
      const programName = course?.title || "";
      const yearId = student.year_id ?? student.year?.id;
      const yearName = resolveStudentYearName(student, yearsById) || "";

      const matchesProgram = filter ? String(programId) === String(filter) : true;
      const matchesYear = yearFilter ? String(yearId) === String(yearFilter) : true;
      const isActive = parseIsActive(student.is_active ?? student.status);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "Active" && isActive) ||
        (statusFilter === "Inactive" && !isActive);

      const fullName = `${student.fname || ""} ${student.lname || ""}`.trim();
      const matchesSearch = !q
        ? true
        : fullName.toLowerCase().includes(q) ||
          String(student.student_id || "").toLowerCase().includes(q) ||
          programName.toLowerCase().includes(q) ||
          yearName.toLowerCase().includes(q);

      return matchesProgram && matchesYear && matchesStatus && matchesSearch;
    });
  }, [students, filter, yearFilter, statusFilter, searchTerm, coursesById, yearsById]);

  const studentStats = useMemo(() => {
    let activeCount = 0;
    let inactiveCount = 0;
    const programIds = new Set();

    for (const student of students) {
      const isActive = parseIsActive(student.is_active ?? student.status);
      if (isActive) activeCount += 1;
      else inactiveCount += 1;

      const programId = student.course_id ?? student.course?.id;
      if (programId) programIds.add(String(programId));
    }

    return {
      total: students.length,
      active: activeCount,
      inactive: inactiveCount,
      programs: programIds.size,
      filtered: filteredStudents.length,
    };
  }, [students, filteredStudents.length]);

  const academicYearBadges = useMemo(() => {
    const counts = new Map();

    for (const student of students) {
      const yearId = student.year_id ?? student.year?.id;
      if (!yearId) continue;
      const key = String(yearId);
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    return years
      .map((year) => ({
        id: year.id,
        name: year.name || `Year ${year.id}`,
        count: counts.get(String(year.id)) || 0,
      }))
      .filter((year) => year.count > 0)
      .sort((a, b) => Number(b.id) - Number(a.id));
  }, [students, years]);

  const recentAcademicYear = academicYearBadges[0] || null;

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, statusFilter, yearFilter, searchTerm, students.length]);

  const toggleStatus = async (student) => {
    if (togglingId === student.id) return;
    setTogglingId(student.id);
    const wasActive = parseIsActive(student.is_active ?? student.status);
    const fullName = `${student.fname || ""} ${student.lname || ""}`.trim();
    try {
      const response = await adminApi.students.toggleActive(student.id);
      const nextActive = parseIsActive(response?.data?.is_active ?? !wasActive);
      setStudents((prev) =>
        prev.map((row) => (row.id === student.id ? { ...row, is_active: nextActive } : row))
      );
      showSuccess(`${fullName || "Student"} ${nextActive ? "activated" : "deactivated"} successfully!`);
    } catch (e) {
      showError(getApiErrorMessage(e, "Failed to update student status"));
    } finally {
      setTogglingId(null);
    }
  };

  const programOptions = useMemo(
    () => [
      { value: "", label: "All Programs" },
      ...courses.map((c) => ({ value: String(c.id), label: c.title })),
    ],
    [courses]
  );

  const yearOptions = useMemo(
    () => [
      { value: "", label: "All Academic Years" },
      ...years.map((y) => ({ value: String(y.id), label: y.name || `Year ${y.id}` })),
    ],
    [years]
  );

  const resetFilters = () => {
    setSearchTerm("");
    setFilter("");
    setYearFilter("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <Toast />
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <p className="text-blue-100 mt-1">Manage student records and information</p>
      </div>

      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">Student Overview</h3>
              {recentAcademicYear && !loading ? (
                <span className="inline-flex items-center rounded-full bg-[#002147] px-3 py-1 text-xs font-semibold text-white">
                  Recent Academic Year: {recentAcademicYear.name}
                </span>
              ) : null}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {loading
                ? "Loading student statistics..."
                : `${studentStats.filtered} shown of ${studentStats.total} enrolled student${
                    studentStats.total === 1 ? "" : "s"
                  }`}
            </p>
            {!loading && academicYearBadges.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {academicYearBadges.map((year) => (
                  <button
                    key={year.id}
                    type="button"
                    onClick={() =>
                      setYearFilter((current) =>
                        String(current) === String(year.id) ? "" : String(year.id)
                      )
                    }
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      String(yearFilter) === String(year.id)
                        ? "border-[#002147] bg-blue-50 text-[#002147]"
                        : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <span className={`rounded-full px-2 py-0.5 ${getYearBadgeClass(year.name)}`}>
                      {year.name}
                    </span>
                    <span className="text-gray-500">{year.count} students</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          {(filter || yearFilter || statusFilter !== "all" || searchTerm.trim()) && (
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StudentStatCard
            title="Total Students"
            value={loading ? "—" : studentStats.total}
            note="All registered students"
            iconClass="fas fa-user-graduate text-blue-600"
            iconBg="bg-blue-100"
            active={statusFilter === "all" && !filter && !yearFilter && !searchTerm.trim()}
            onClick={() => {
              setStatusFilter("all");
              setFilter("");
              setYearFilter("");
              setSearchTerm("");
            }}
          />
          <StudentStatCard
            title="Active Students"
            value={loading ? "—" : studentStats.active}
            note="Can access the student portal"
            iconClass="fas fa-user-check text-green-600"
            iconBg="bg-green-100"
            active={statusFilter === "Active"}
            onClick={() => setStatusFilter("Active")}
          />
          <StudentStatCard
            title="Inactive Students"
            value={loading ? "—" : studentStats.inactive}
            note="Portal access disabled"
            iconClass="fas fa-user-slash text-amber-600"
            iconBg="bg-amber-100"
            active={statusFilter === "Inactive"}
            onClick={() => setStatusFilter("Inactive")}
          />
          <StudentStatCard
            title="Programs"
            value={loading ? "—" : studentStats.programs}
            note={`${courses.length} program${courses.length === 1 ? "" : "s"} available`}
            iconClass="fas fa-graduation-cap text-purple-600"
            iconBg="bg-purple-100"
          />
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <ManagementFilters
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search students..."
          filters={[
            {
              key: "program",
              value: filter,
              onChange: setFilter,
              options: programOptions,
            },
            {
              key: "year",
              value: yearFilter,
              onChange: setYearFilter,
              options: yearOptions,
            },
          ]}
          showStatus
          statusValue={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={[
            { value: "all", label: "All Status" },
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
          onReset={resetFilters}
          actions={
            <Link
              to="/piu/admin/students/add"
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full lg:w-auto"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Add Student
            </Link>
          }
        />

        {/* Students Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Loading students...
                  </td>
                </tr>
              )}

              {!loading && filteredStudents.length > 0 ? (
                paginatedStudents.map((student) => {
                  const fullName = `${student.fname || ""} ${student.lname || ""}`.trim();
                  const programId = student.course_id ?? student.course?.id;
                  const course = coursesById.get(String(programId));
                  const yearName = resolveStudentYearName(student, yearsById);
                  const isActive = parseIsActive(student.is_active ?? student.status);
                  const avatar = toStorageUrl(student.profile) || student.profile || "";
                  return (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {avatar ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={avatar}
                              alt={fullName}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/80x80?text=PIU";
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                              {getInitials(fullName)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {fullName || "—"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {student.student_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {course?.title || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AcademicYearBadge label={yearName} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusToggle
                        checked={isActive}
                        loading={togglingId === student.id}
                        onChange={() => toggleStatus(student)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/piu/admin/students/edit/${student.id}`)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors"
                          title="Edit student"
                        >
                          <i className="fas fa-edit mr-1"></i>
                          Edit
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => removeStudent(student)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-md transition-colors"
                            title="Delete student"
                          >
                            <i className="fas fa-trash mr-1"></i>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })
              ) : (
                !loading && (
                  <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <i className="fas fa-user-graduate text-4xl text-gray-300 mb-3"></i>
                      <p className="text-lg font-medium">No students found</p>
                      <p className="text-sm mt-1">
                        {searchTerm || filter || yearFilter || statusFilter !== "all"
                          ? "Try adjusting your search or filters" 
                          : "Get started by adding your first student"
                        }
                      </p>
                    </div>
                  </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {paginatedStudents.length} of {filteredStudents.length} students (total {students.length})
          </div>
          {filteredStudents.length > 0 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllStudents;