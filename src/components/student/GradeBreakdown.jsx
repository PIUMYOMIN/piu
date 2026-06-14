import React from "react";
import { computeGradesSummary } from "../../utils/gradingSummary";

function GradesTable({ grades, showSemester = false }) {
  if (!grades?.length) {
    return <p className="text-sm text-gray-500">No modules recorded.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="py-2 pr-3">Module</th>
            {showSemester ? <th className="py-2 pr-3">Semester</th> : null}
            <th className="py-2 pr-3">Credit</th>
            <th className="py-2 pr-3">Mark</th>
            <th className="py-2 pr-3">Point</th>
            <th className="py-2">Grade</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade.id} className="border-b border-gray-100">
              <td className="py-3 pr-3">
                <div className="font-medium text-gray-900">{grade.module_name || grade.assignment}</div>
                <div className="text-xs text-gray-500">{grade.module_code}</div>
              </td>
              {showSemester ? <td className="py-3 pr-3">{grade.semester || "-"}</td> : null}
              <td className="py-3 pr-3">{grade.credit ?? "-"}</td>
              <td className="py-3 pr-3">{grade.mark ?? "-"}</td>
              <td className="py-3 pr-3 font-medium text-[#002147]">{grade.grade_point ?? "-"}</td>
              <td className="py-3">{grade.grade_value ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GradeSummary({ totalCredit, averageGpa, gradeValue }) {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total Credit</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{totalCredit ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Grade Point Average
          </p>
          <p className="mt-1 text-lg font-semibold text-[#002147]">{averageGpa ?? "N/A"}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Grade Value</p>
          <p className="mt-1 text-lg font-bold text-gray-900">{gradeValue ?? "-"}</p>
        </div>
      </div>
    </div>
  );
}

function resolveSummary(block, grades) {
  const fromApi = {
    total_credit: block?.total_credit,
    average_gpa: block?.average_gpa,
    grade_value: block?.grade_value,
  };

  if (
    fromApi.total_credit != null &&
    fromApi.average_gpa != null &&
    fromApi.grade_value != null
  ) {
    return fromApi;
  }

  return computeGradesSummary(grades, fromApi.average_gpa);
}

function normalizeYearBlocks(byYear = []) {
  return byYear.map((yearBlock) => {
    if (Array.isArray(yearBlock.semesters) && yearBlock.semesters.length > 0) {
      return yearBlock;
    }

    const semesterMap = new Map();
    for (const grade of yearBlock.grades || []) {
      const semesterName = grade.semester || "General Semester";
      if (!semesterMap.has(semesterName)) {
        semesterMap.set(semesterName, []);
      }
      semesterMap.get(semesterName).push(grade);
    }

    const semesters = [...semesterMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([semester, grades]) => ({
        semester,
        modules: grades.length,
        ...computeGradesSummary(grades),
        grades,
      }));

    return { ...yearBlock, semesters };
  });
}

export default function GradeBreakdown({ byYear = [], compact = false }) {
  const yearBlocks = normalizeYearBlocks(byYear);

  if (!yearBlocks.length) {
    return null;
  }

  return (
    <div className="space-y-5">
      {yearBlocks.map((yearBlock) => (
          <div key={yearBlock.year} className="rounded-xl border border-gray-200 bg-gray-50/80 p-4">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-900">{yearBlock.year}</h3>
              <p className="text-xs text-gray-500">
                {yearBlock.modules || 0} module{(yearBlock.modules || 0) === 1 ? "" : "s"}
              </p>
            </div>

            <div className="space-y-4">
              {(yearBlock.semesters || []).map((semesterBlock) => {
                const semesterGrades = semesterBlock.grades || [];
                const semesterSummary = resolveSummary(semesterBlock, semesterGrades);

                return (
                  <div
                    key={`${yearBlock.year}-${semesterBlock.semester}`}
                    className="rounded-lg border border-gray-100 bg-white p-4"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-gray-800">{semesterBlock.semester}</h4>
                      <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
                        {semesterBlock.modules || semesterGrades.length || 0} modules
                      </span>
                    </div>

                    {!compact ? (
                      <GradesTable grades={semesterGrades} />
                    ) : (
                      <GradesTable grades={semesterGrades.slice(0, 3)} />
                    )}

                    <GradeSummary
                      totalCredit={semesterSummary.total_credit}
                      averageGpa={semesterSummary.average_gpa}
                      gradeValue={semesterSummary.grade_value}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
