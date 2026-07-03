import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin";
import ManagementFilters from "../../components/admin/ManagementFilters";
import StatusToggle, { parseIsActive } from "../../components/admin/StatusToggle";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";

function getStudentName(student) {
  return (
    student.name ||
    `${student.fname || ""} ${student.lname || ""}`.trim() ||
    student.email ||
    "Unnamed student"
  );
}

function resolveProgramName(student, coursesById) {
  const programId = student.course_id ?? student.course?.id;
  const course = programId != null ? coursesById.get(String(programId)) : null;
  return student.course?.title || course?.title || student.program || "Unassigned";
}

function resolveYearSlug(student, yearsById) {
  const yearName = String(
    student.year?.name || yearsById.get(String(student.year_id))?.name || ""
  ).toLowerCase();

  if (yearName.includes("first")) return "first";
  if (yearName.includes("second")) return "second";
  if (yearName.includes("third")) return "third";
  if (yearName.includes("fourth")) return "fourth";
  return "first";
}

function buildGradeLink(student, semester, yearsById) {
  const yearSlug = resolveYearSlug(student, yearsById);
  return `/piu/admin/students/${student.id}/${yearSlug}/${semester}/new`;
}

function SemesterAddButton({ student, semester, yearsById, label }) {
  const isActive = parseIsActive(student.is_active ?? student.status);
  const path = buildGradeLink(student, semester, yearsById);
  const payload = {
    id: student.id,
    name: getStudentName(student),
    studentId: student.student_id || student.studentId || "",
    program: student.program,
    course_id: student.course_id ?? student.course?.id,
  };

  if (!isActive) {
    return (
      <span
        className="inline-block rounded bg-gray-100 px-3 py-1 text-xs text-gray-500"
        title="Activate this student before adding grades"
      >
        Inactive
      </span>
    );
  }

  return (
    <Link
      to={path}
      state={{ student: payload }}
      className="inline-block rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
    >
      {label}
    </Link>
  );
}

export default function AddStudentGrading() {
  const { showError, Toast } = useFloatingToast();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [studentsData, coursesData, yearsData] = await Promise.all([
          adminApi.students.list(),
          adminApi.courses.list(),
          adminApi.meta.years(),
        ]);

        if (!mounted) return;
        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setYears(Array.isArray(yearsData) ? yearsData : []);
      } catch (err) {
        if (!mounted) return;
        setStudents([]);
        setCourses([]);
        setYears([]);
        setError(getApiErrorMessage(err, "Failed to load students"));
        showError(getApiErrorMessage(err, "Failed to load students"));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const coursesById = useMemo(
    () => new Map(courses.map((course) => [String(course.id), course])),
    [courses]
  );
  const yearsById = useMemo(
    () => new Map(years.map((year) => [String(year.id), year])),
    [years]
  );

  const displayStudents = useMemo(
    () =>
      students.map((student) => ({
        ...student,
        name: getStudentName(student),
        studentId: student.student_id || student.studentId || "",
        program: resolveProgramName(student, coursesById),
      })),
    [students, coursesById]
  );

  const programOptions = useMemo(() => {
    const programIds = [...new Set(displayStudents.map((s) => String(s.course_id ?? s.course?.id)).filter(Boolean))];
    return [
      { value: "all", label: "All Programs" },
      ...programIds.map((id) => ({
        value: id,
        label: coursesById.get(id)?.title || `Program #${id}`,
      })),
    ];
  }, [displayStudents, coursesById]);

  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return displayStudents.filter((student) => {
      const programId = String(student.course_id ?? student.course?.id ?? "");
      const isActive = parseIsActive(student.is_active ?? student.status);
      const matchesProgram = programFilter === "all" || programId === programFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "Active" && isActive) ||
        (statusFilter === "Inactive" && !isActive);
      const matchesSearch =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.studentId.toLowerCase().includes(q) ||
        student.program.toLowerCase().includes(q);

      return matchesProgram && matchesStatus && matchesSearch;
    });
  }, [displayStudents, programFilter, statusFilter, searchTerm]);

  const resetFilters = () => {
    setSearchTerm("");
    setProgramFilter("all");
    setStatusFilter("all");
  };

  const toggleStatus = async (student) => {
    if (togglingId === student.id) return;
    setTogglingId(student.id);
    const wasActive = parseIsActive(student.is_active ?? student.status);
    try {
      const response = await adminApi.students.toggleActive(student.id);
      const nextActive = parseIsActive(response?.data?.is_active ?? !wasActive);
      setStudents((prev) =>
        prev.map((row) => (row.id === student.id ? { ...row, is_active: nextActive } : row))
      );
    } catch (err) {
      showError(getApiErrorMessage(err, "Failed to update student status"));
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-full overflow-hidden rounded-xl bg-white shadow-md">
      <Toast />
      <div className="bg-[#002147] px-4 py-4 sm:px-6">
        <h2 className="text-xl font-bold text-white sm:text-2xl">Add Student Grading</h2>
        <p className="mt-1 text-sm text-blue-100">
          Select a student and semester to record grades. Only active students can receive new grades.
        </p>
      </div>

      <div className="p-4 sm:p-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
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
              value: programFilter,
              onChange: setProgramFilter,
              options: programOptions,
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
          summary={
            loading
              ? "Loading students..."
              : `Showing ${filteredStudents.length} of ${students.length} students`
          }
        />

        <div className="space-y-4 md:hidden">
          {loading ? (
            <div className="rounded-lg border border-gray-200 px-4 py-12 text-center text-gray-500">
              Loading students...
            </div>
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((student, idx) => {
              const isActive = parseIsActive(student.is_active ?? student.status);
              return (
                <article key={student.id} className="rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500">#{idx + 1}</p>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.studentId || "—"}</p>
                      <p className="mt-1 text-sm text-blue-800">{student.program}</p>
                    </div>
                    <StatusToggle
                      checked={isActive}
                      loading={togglingId === student.id}
                      onChange={() => toggleStatus(student)}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <SemesterAddButton
                      student={student}
                      semester="first"
                      yearsById={yearsById}
                      label="1st Sem"
                    />
                    <SemesterAddButton
                      student={student}
                      semester="second"
                      yearsById={yearsById}
                      label="2nd Sem"
                    />
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-lg border border-gray-200 px-4 py-12 text-center text-gray-500">
              No students match your filters.
            </div>
          )}
        </div>

        <div className="hidden overflow-x-auto rounded-lg border border-gray-200 md:block">
          <table className="min-w-[880px] w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="border p-3 text-left">#</th>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Student ID</th>
                <th className="border p-3 text-left">Study Program</th>
                <th className="border p-3 text-center">Status</th>
                <th className="border p-3 text-center">First Semester</th>
                <th className="border p-3 text-center">Second Semester</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="border p-8 text-center text-gray-500">
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => {
                  const isActive = parseIsActive(student.is_active ?? student.status);
                  return (
                    <tr key={student.id} className="text-sm hover:bg-gray-50">
                      <td className="border p-3 text-center">{idx + 1}</td>
                      <td className="border p-3 font-medium">{student.name}</td>
                      <td className="border p-3">{student.studentId || "—"}</td>
                      <td className="border p-3">{student.program}</td>
                      <td className="border p-3 text-center">
                        <StatusToggle
                          checked={isActive}
                          loading={togglingId === student.id}
                          onChange={() => toggleStatus(student)}
                        />
                      </td>
                      <td className="border p-3 text-center">
                        <SemesterAddButton
                          student={student}
                          semester="first"
                          yearsById={yearsById}
                          label="Add"
                        />
                      </td>
                      <td className="border p-3 text-center">
                        <SemesterAddButton
                          student={student}
                          semester="second"
                          yearsById={yearsById}
                          label="Add"
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="border p-8 text-center text-gray-500">
                    No students match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
