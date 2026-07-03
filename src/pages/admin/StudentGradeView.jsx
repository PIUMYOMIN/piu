import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { FaArrowLeft, FaFilePdf, FaPlus } from "react-icons/fa";
import { adminApi } from "../../api/admin";
import { useConfirmDelete } from "../../contexts/ConfirmContext";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";
import {
  YEAR_LABELS,
  getStudentDisplayName,
  resolveSemesterIdFromSlug,
  resolveYearIdFromSlug,
  semesterLabelFromSlug,
} from "../../utils/gradingHelpers";
import { computeGradesSummary } from "../../utils/gradingSummary";

const StudentGradeView = () => {
  const confirmDeleteAction = useConfirmDelete();
  const { showError, showSuccess, Toast } = useFloatingToast();
  const { studentId, year, semester } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [student, setStudent] = useState(location.state || null);
  const [grades, setGrades] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const yearLabel = YEAR_LABELS[year] || year;
  const semLabel = semesterLabelFromSlug(semester);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [gradesResult, yearsData, semestersData, studentData] = await Promise.all([
          adminApi.grades.forStudent(studentId),
          adminApi.meta.years(),
          adminApi.meta.semesters(),
          location.state ? Promise.resolve(location.state) : adminApi.students.get(studentId),
        ]);

        if (!mounted) return;

        const apiStudent = gradesResult?.student || studentData;
        const resolvedStudent = {
          ...(apiStudent || {}),
          ...(location.state || {}),
          name: getStudentDisplayName(apiStudent || location.state),
          studentId:
            location.state?.studentId ||
            apiStudent?.student_id ||
            apiStudent?.studentId ||
            "",
          program:
            location.state?.program ||
            apiStudent?.course?.title ||
            apiStudent?.program ||
            "",
        };
        setStudent(resolvedStudent);
        setYears(Array.isArray(yearsData) ? yearsData : []);
        setSemesters(Array.isArray(semestersData) ? semestersData : []);

        const yearId = resolveYearIdFromSlug(yearsData, year);
        const semesterId = resolveSemesterIdFromSlug(semestersData, semester);
        const allGrades = Array.isArray(gradesResult?.data) ? gradesResult.data : [];

        const filtered = allGrades.filter((g) => {
          const matchesYear = yearId ? String(g.year_id) === String(yearId) : true;
          const matchesSemester = semesterId
            ? String(g.semester_id) === String(semesterId)
            : true;
          return matchesYear && matchesSemester;
        });

        setGrades(filtered);
      } catch (err) {
        if (!mounted) return;
        setError(getApiErrorMessage(err, "Failed to load grades"));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [studentId, year, semester, location.state]);

  const displayGrades = useMemo(
    () =>
      grades.map((g) => ({
        id: g.id,
        assignment_id: g.assignment_id,
        module_id: g.module_id,
        assignment: g.assignment?.name || "—",
        moduleCode: g.module?.module_code || g.module?.name || "—",
        credit: g.module?.credit ?? 0,
        mark: g.mark,
        gpaPoint: g.grade_point,
        gpaValue: g.grade_value,
        grade_point: g.grade_point,
        grade_value: g.grade_value,
      })),
    [grades]
  );

  const summary = useMemo(
    () =>
      computeGradesSummary(
        displayGrades.map((g) => ({
          credit: g.credit,
          grade_point: g.gpaPoint,
        }))
      ),
    [displayGrades]
  );

  const studentState = useMemo(
    () => ({
      id: student?.id || studentId,
      name: student?.name || getStudentDisplayName(student),
      studentId: student?.studentId || student?.student_id || "",
      program: student?.program || student?.course?.title || "",
      course_id: student?.course_id ?? student?.course?.id,
    }),
    [student, studentId]
  );

  const handleEdit = (grade) => {
    navigate(`/piu/admin/students/${studentId}/${year}/${semester}/edit/${grade.id}`, {
      state: { student: studentState, grade },
    });
  };

  const handleDelete = async (gradeId) => {
    const ok = await confirmDeleteAction({ itemType: "grade" });
    if (!ok) return;
    try {
      await adminApi.grades.remove(gradeId);
      setGrades((prev) => prev.filter((g) => g.id !== gradeId));
      showSuccess("Grade deleted.");
    } catch (err) {
      showError(getApiErrorMessage(err, "Failed to delete grade"));
    }
  };

  const handleDownloadPdf = async () => {
    if (!displayGrades.length) return;

    setExporting(true);
    setExportError("");
    try {
      const { downloadGradingRecordPdf } = await import("../../utils/gradingPdf");
      const pdfGrades = displayGrades.map((grade) => ({
        id: grade.id,
        module_name: grade.assignment,
        module_code: grade.moduleCode,
        credit: grade.credit,
        mark: grade.mark,
        grade_point: grade.gpaPoint,
        grade_value: grade.gpaValue,
        year: yearLabel,
        semester: semLabel,
      }));

      await downloadGradingRecordPdf({
        student: {
          name: studentState.name,
          student_id: studentState.studentId,
          program: studentState.program,
          year: yearLabel,
        },
        summary: {
          average_gpa: summary.average_gpa,
          total_modules: displayGrades.length,
        },
        byYear: [
          {
            year: yearLabel,
            modules: displayGrades.length,
            total_credit: summary.total_credit,
            average_gpa: summary.average_gpa,
            grade_value: summary.grade_value,
            grades: pdfGrades,
            semesters: [
              {
                semester: semLabel,
                modules: displayGrades.length,
                total_credit: summary.total_credit,
                average_gpa: summary.average_gpa,
                grade_value: summary.grade_value,
                grades: pdfGrades,
              },
            ],
          },
        ],
        fileNameSuffix: `${yearLabel}-${semLabel}`,
      });
    } catch (err) {
      setExportError(getApiErrorMessage(err, "Failed to generate grading PDF."));
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading grades...</p>;
  }

  if (!student) {
    return <p className="p-6 text-gray-500">Student not found.</p>;
  }

  return (
    <div className="rounded bg-white p-4 shadow sm:p-6">
      <Toast />
      <div className="mb-4 flex flex-col gap-3 rounded bg-[#002147] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-3 shrink-0 p-1 text-white hover:text-gray-200"
          >
            <FaArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-white">
              {studentState.name} — {semLabel}
            </h2>
            <p className="truncate text-sm text-white">
              {studentState.program} — {yearLabel}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/piu/admin/students/${studentId}/${year}/${semester}/new`}
            state={{ student: studentState }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            <FaPlus size={12} />
            Add Grade
          </Link>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={!displayGrades.length || exporting}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#002147] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaFilePdf />
            {exporting ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {exportError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {exportError}
        </div>
      )}

      <div className="mb-4 rounded border bg-gray-50 p-4">
        <p>
          <strong>Student Name:</strong> {studentState.name}
        </p>
        <p>
          <strong>Study Program:</strong> {studentState.program}
        </p>
        <p>
          <strong>Academic Year:</strong> {yearLabel}
        </p>
        <p>
          <strong>Semester:</strong> {semLabel}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Assignment</th>
              <th className="border px-3 py-2">Module Code</th>
              <th className="border px-3 py-2">Credit</th>
              <th className="border px-3 py-2">Mark</th>
              <th className="border px-3 py-2">Grade Point</th>
              <th className="border px-3 py-2">Grade Value</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayGrades.length > 0 ? (
              displayGrades.map((g, idx) => (
                <tr key={g.id} className="text-center hover:bg-gray-50">
                  <td className="border px-3 py-2">{idx + 1}</td>
                  <td className="border px-3 py-2">{g.assignment}</td>
                  <td className="border px-3 py-2">{g.moduleCode}</td>
                  <td className="border px-3 py-2">{g.credit || "—"}</td>
                  <td className="border px-3 py-2">{g.mark ?? "—"}</td>
                  <td className="border px-3 py-2">{g.gpaPoint ?? "—"}</td>
                  <td className="border px-3 py-2 font-medium">{g.gpaValue || "—"}</td>
                  <td className="space-x-2 border px-3 py-2">
                    <button
                      onClick={() => handleEdit(g)}
                      className="rounded bg-yellow-500 px-3 py-1 text-white transition-colors hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="rounded bg-red-500 px-3 py-1 text-white transition-colors hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="border px-3 py-8 text-center text-gray-500">
                  No grades recorded for this semester yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded border bg-gray-50 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p className="font-semibold">Total Credit:</p>
            <p className="text-lg">{summary.total_credit ?? 0}</p>
          </div>
          <div>
            <p className="font-semibold">Grade Point Average:</p>
            <p className="text-lg">{summary.average_gpa ?? "—"}</p>
          </div>
          <div>
            <p className="font-semibold">Grade Value:</p>
            <p className="text-lg font-bold">{summary.grade_value ?? "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGradeView;
