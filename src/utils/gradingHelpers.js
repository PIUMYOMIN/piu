export const YEAR_LABELS = {
  first: "First Year",
  second: "Second Year",
  third: "Third Year",
  fourth: "Fourth Year",
};

export function semesterLabelFromSlug(slug) {
  return slug === "second" ? "Second Semester" : "First Semester";
}

export function resolveYearIdFromSlug(years, slug) {
  if (!slug || !Array.isArray(years)) return null;
  const label = YEAR_LABELS[slug];
  const byLabel = years.find((y) => String(y.name).toLowerCase() === String(label).toLowerCase());
  if (byLabel) return byLabel.id;
  return years.find((y) => String(y.name).toLowerCase().includes(String(slug).toLowerCase()))?.id ?? null;
}

export function resolveSemesterIdFromSlug(semesters, slug) {
  if (!slug || !Array.isArray(semesters)) return null;
  const needle = slug === "second" ? "second" : "first";
  return semesters.find((s) => String(s.name).toLowerCase().includes(needle))?.id ?? null;
}

export function markToGradePoint(mark) {
  const m = Number(mark);
  if (Number.isNaN(m)) return "";
  if (m >= 90) return "4.0";
  if (m >= 80) return "3.5";
  if (m >= 70) return "3.0";
  if (m >= 60) return "2.5";
  if (m >= 50) return "2.0";
  return "1.0";
}

export function markToGradeValue(mark) {
  const m = Number(mark);
  if (Number.isNaN(m)) return "";
  if (m >= 90) return "A";
  if (m >= 80) return "B+";
  if (m >= 70) return "B";
  if (m >= 60) return "C+";
  if (m >= 50) return "C";
  return "F";
}

export function getStudentDisplayName(student) {
  if (!student) return "Unknown Student";
  return (
    student.name ||
    `${student.fname || ""} ${student.lname || ""}`.trim() ||
    student.email ||
    "Unnamed student"
  );
}
