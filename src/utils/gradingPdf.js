import { computeGradesSummary } from "./gradingSummary";

const UNIVERSITY_NAME = "Phaung Daw Oo International University";
const BRAND_RGB = [0, 33, 71];

function formatDate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function safeText(value, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function moduleLabel(grade) {
  const name = grade.module_name || grade.assignment || "Module";
  const code = grade.module_code ? ` (${grade.module_code})` : "";
  return `${name}${code}`;
}

function buildYearSections(byYear, grades) {
  if (Array.isArray(byYear) && byYear.length > 0) {
    const sections = [];

    for (const block of byYear) {
      const semesters = Array.isArray(block.semesters) && block.semesters.length > 0
        ? block.semesters
        : [{ semester: "All Semesters", grades: block.grades || [], average_gpa: block.average_gpa }];

      for (const semesterBlock of semesters) {
        const summary = computeGradesSummary(
          semesterBlock.grades || [],
          semesterBlock.average_gpa ?? block.average_gpa
        );

        sections.push({
          title: `${safeText(block.year, "Academic Year")} — ${safeText(semesterBlock.semester, "Semester")}`,
          gpa: summary.average_gpa,
          totalCredit: summary.total_credit,
          gradeValue: summary.grade_value,
          rows: (semesterBlock.grades || []).map((grade) => [
            moduleLabel(grade),
            safeText(grade.credit),
            safeText(grade.mark),
            safeText(grade.grade_point),
            safeText(grade.grade_value),
          ]),
        });
      }
    }

    return sections;
  }

  if (!Array.isArray(grades) || grades.length === 0) {
    return [];
  }

  return [
    {
      title: "All Grades",
      gpa: null,
      rows: grades.map((grade) => [
        moduleLabel(grade),
        safeText(grade.year),
        safeText(grade.credit),
        safeText(grade.mark),
        safeText(grade.grade_point),
        safeText(grade.grade_value),
      ]),
    },
  ];
}

function tableHeaders() {
  return [["Module", "Credit", "Mark", "Point", "Grade"]];
}

/**
 * Generate and download a grading record PDF with tabular layout.
 */
export async function downloadGradingRecordPdf({
  student,
  summary = {},
  grades = [],
  byYear = [],
  fileNameSuffix = "",
}) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const sections = buildYearSections(byYear, grades);
  if (sections.length === 0 || sections.every((section) => section.rows.length === 0)) {
    throw new Error("No grading records available to export.");
  }

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let cursorY = 16;

  doc.setFillColor(...BRAND_RGB);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(UNIVERSITY_NAME, margin, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Academic Grading Record", margin, 20);

  cursorY = 36;
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Student Information", margin, cursorY);
  cursorY += 4;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 1.8 },
    body: [
      ["Student Name", safeText(student?.name)],
      ["Student ID", safeText(student?.student_id)],
      ["Program", safeText(student?.program || student?.course)],
      ["Academic Year", safeText(student?.year)],
      ["Overall GPA", safeText(summary?.average_gpa ?? "N/A")],
      ["Generated On", formatDate()],
    ],
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 42, textColor: [80, 80, 80] },
      1: { cellWidth: "auto" },
    },
  });

  cursorY = doc.lastAutoTable.finalY + 8;

  sections.forEach((section, index) => {
    if (section.rows.length === 0) return;

    const neededHeight = 18 + section.rows.length * 7;
    if (cursorY + neededHeight > doc.internal.pageSize.getHeight() - 16) {
      doc.addPage();
      cursorY = 18;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...BRAND_RGB);
    const summaryParts = [];
    if (section.totalCredit != null) summaryParts.push(`Credit ${section.totalCredit}`);
    if (section.gpa != null && section.gpa !== "") summaryParts.push(`GPA ${section.gpa}`);
    if (section.gradeValue) summaryParts.push(`Grade ${section.gradeValue}`);

    const sectionTitle =
      summaryParts.length > 0
        ? `${section.title} — ${summaryParts.join(" | ")}`
        : section.title;
    doc.text(sectionTitle, margin, cursorY);
    cursorY += 4;

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: tableHeaders(),
      body: section.rows,
      theme: "grid",
      styles: {
        fontSize: 8.5,
        cellPadding: 2,
        lineColor: [210, 210, 210],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: BRAND_RGB,
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 248, 252],
      },
      columnStyles: {
        0: { cellWidth: 72 },
        1: { cellWidth: 18, halign: "center" },
        2: { cellWidth: 18, halign: "center" },
        3: { cellWidth: 18, halign: "center" },
        4: { cellWidth: 18, halign: "center" },
      },
    });

    cursorY = doc.lastAutoTable.finalY + (index < sections.length - 1 ? 8 : 4);
  });

  const footerY = doc.internal.pageSize.getHeight() - 10;
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "This document is generated from the student portal grading records.",
      margin,
      footerY
    );
    doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, footerY, { align: "right" });
  }

  const studentId = safeText(student?.student_id, "student").replace(/[^\w-]+/g, "_");
  const suffix = safeText(fileNameSuffix, "")
    .replace(/[^\w-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const suffixPart = suffix ? `-${suffix}` : "";
  const fileName = `grading-record-${studentId}${suffixPart}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
