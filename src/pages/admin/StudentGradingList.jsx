import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { adminApi } from "../../api/admin";
import ManagementFilters from "../../components/admin/ManagementFilters";
import { parseIsActive } from "../../components/admin/StatusToggle";
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

export default function StudentGradingList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadStudents() {
      setLoading(true);
      setError("");
      try {
        const [studentsData, coursesData] = await Promise.all([
          adminApi.students.list(),
          adminApi.courses.list(),
        ]);

        if (!mounted) return;
        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (err) {
        if (!mounted) return;
        setStudents([]);
        setCourses([]);
        setError(getApiErrorMessage(err, "Failed to load students"));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadStudents();

    return () => {
      mounted = false;
    };
  }, []);

  const coursesById = useMemo(() => new Map(courses.map((course) => [String(course.id), course])), [courses]);

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

  const filteredStudents = displayStudents.filter((student) => {
    const q = searchTerm.trim().toLowerCase();
    const programId = String(student.course_id ?? student.course?.id ?? "");
    const isActive = parseIsActive(student.is_active ?? student.status);
    const matchesSearch =
      !q ||
      student.name.toLowerCase().includes(q) ||
      student.studentId.toLowerCase().includes(q) ||
      student.program.toLowerCase().includes(q);
    const matchesProgram = programFilter === "all" || programId === programFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && isActive) ||
      (statusFilter === "inactive" && !isActive);
    return matchesSearch && matchesProgram && matchesStatus;
  });

  // Sort students
  const sortedStudents = React.useMemo(() => {
    let sortableItems = [...filteredStudents];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredStudents, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 opacity-50" />;
    if (sortConfig.direction === 'ascending') return <FaSortUp className="ml-1" />;
    return <FaSortDown className="ml-1" />;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setProgramFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Page Header */}
      <div className="bg-[#002147] px-6 py-4">
        <h2 className="text-xl font-bold text-white">Student Grading</h2>
      </div>

      <div className="p-6">
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
          onReset={resetFilters}
          summary={loading ? "Loading students..." : `Showing ${filteredStudents.length} of ${students.length} students`}
        />

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th 
                  className="p-3 font-semibold text-gray-700 border-b cursor-pointer"
                  onClick={() => requestSort('id')}
                >
                  <div className="flex items-center">
                    #
                    {getSortIcon('id')}
                  </div>
                </th>
                <th 
                  className="p-3 font-semibold text-gray-700 border-b cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Student Name
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="p-3 font-semibold text-gray-700 border-b cursor-pointer"
                  onClick={() => requestSort('studentId')}
                >
                  <div className="flex items-center">
                    Student ID
                    {getSortIcon('studentId')}
                  </div>
                </th>
                <th className="p-3 font-semibold text-gray-700 border-b cursor-pointer"
                  onClick={() => requestSort('program')}
                >
                  <div className="flex items-center">
                    Program
                    {getSortIcon('program')}
                  </div>
                </th>
                <th className="p-3 font-semibold text-gray-700 border-b text-center">Status</th>
                <th className="p-3 font-semibold text-gray-700 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500 border-b">
                    Loading students...
                  </td>
                </tr>
              ) : sortedStudents.length > 0 ? (
                sortedStudents.map((student, idx) => {
                  const isActive = parseIsActive(student.is_active ?? student.status);
                  return (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-b">{idx + 1}</td>
                    <td className="p-3 border-b font-medium">{student.name}</td>
                    <td className="p-3 border-b text-gray-600">{student.studentId}</td>
                    <td className="p-3 border-b">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {student.program}
                      </span>
                    </td>
                    <td className="p-3 border-b text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 border-b text-center">
                      <button
                        onClick={() => navigate(`/piu/admin/students/${student.id}/grading`, { state: student })}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <FaEye className="mr-2" size={12} />
                        View
                      </button>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500 border-b">
                    No students found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (optional) */}
        {filteredStudents.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing 1 to {filteredStudents.length} of {filteredStudents.length} results
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
