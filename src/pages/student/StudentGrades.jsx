import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { studentApi } from "../../api/student";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, Panel, StatCard, StudentHero } from "../../components/student/StudentUi";
import GradeBreakdown from "../../components/student/GradeBreakdown";

export default function StudentGrades() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportError, setExportError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await studentApi.grades();
        if (mounted) setData(response);
      } catch (e) {
        if (mounted) setError(getApiErrorMessage(e, "Failed to load grades"));
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
        <LoadingState label="Loading your grades..." />
      </div>
    );
  }

  const summary = data?.summary || {};
  const grades = data?.grades || [];
  const byYear = summary.by_year || [];
  const hasGrades = byYear.length > 0 || grades.length > 0;

  const handleDownloadPdf = async () => {
    if (!hasGrades) return;

    setExporting(true);
    setExportError("");
    try {
      const { downloadGradingRecordPdf } = await import("../../utils/gradingPdf");
      await downloadGradingRecordPdf({
        student: data?.student,
        summary,
        grades,
        byYear,
      });
    } catch (e) {
      setExportError(getApiErrorMessage(e, "Failed to generate grading PDF."));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <StudentHero
          eyebrow="Student Grading"
          title="Academic Results"
          subtitle="Review your module marks, grade points, and GPA by academic year."
        />
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={!hasGrades || exporting}
          className="inline-flex h-fit shrink-0 items-center justify-center gap-2 rounded-lg bg-[#002147] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#003366] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaFilePdf />
          {exporting ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {exportError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {exportError}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Overall GPA"
          value={summary.average_gpa ?? "N/A"}
          note="Weighted by module credits"
          tone="green"
        />
        <StatCard
          title="Graded Modules"
          value={summary.total_modules || 0}
          note="Total recorded results"
          tone="blue"
        />
        <StatCard
          title="Academic Years"
          value={byYear.length}
          note="Years with grade records"
          tone="purple"
        />
        <StatCard
          title="Semesters"
          value={byYear.reduce((total, year) => total + (year.semesters?.length || 0), 0)}
          note="Semester grading groups"
          tone="amber"
        />
      </section>

      {byYear.length > 0 ? (
        <Panel title="Results by Academic Year and Semester">
          <GradeBreakdown byYear={byYear} />
        </Panel>
      ) : grades.length ? (
        <Panel title="All Grades">
          <GradeBreakdown
            byYear={[
              {
                year: "All Records",
                average_gpa: summary.average_gpa,
                modules: grades.length,
                semesters: [
                  {
                    semester: "All Semesters",
                    average_gpa: summary.average_gpa,
                    modules: grades.length,
                    grades,
                  },
                ],
                grades,
              },
            ]}
          />
        </Panel>
      ) : (
        <EmptyState message="No grading records are available for your account yet." />
      )}
    </div>
  );
}
