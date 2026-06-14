/**
 * Convert weighted GPA to a letter grade (matches admin StudentGradeView).
 */
export function gpaToGradeValue(gpa) {
  if (gpa == null || gpa === "") return null;
  const avg = Number(gpa);
  if (Number.isNaN(avg)) return null;
  if (avg >= 3.7) return "A";
  if (avg >= 3.0) return "B";
  if (avg >= 2.0) return "C";
  return "F";
}

/**
 * Compute total credits, weighted GPA, and letter grade from module rows.
 */
export function computeGradesSummary(grades = [], existingGpa = null) {
  let totalCredits = 0;
  let weightedPoints = 0;

  for (const grade of grades) {
    const credit = Number(grade.credit) || 0;
    const point = Number(grade.grade_point) || 0;
    if (credit <= 0) continue;
    totalCredits += credit;
    weightedPoints += point * credit;
  }

  const averageGpa =
    existingGpa != null && existingGpa !== ""
      ? Number(existingGpa)
      : totalCredits > 0
        ? Math.round((weightedPoints / totalCredits) * 100) / 100
        : null;

  return {
    total_credit: totalCredits > 0 ? totalCredits : null,
    average_gpa: Number.isNaN(averageGpa) ? null : averageGpa,
    grade_value: gpaToGradeValue(averageGpa),
  };
}
