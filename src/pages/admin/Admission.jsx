import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaDownload } from "react-icons/fa";
import adminApi from "../../api/admin";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";
import {
  downloadAdmissionDocument,
  hasAdmissionDocument,
  openAdmissionDocument,
} from "../../utils/admissionDocuments";

function getSubmissionYear(admission) {
  if (!admission?.created_at) return "";
  const date = new Date(admission.created_at);
  if (Number.isNaN(date.getTime())) return "";
  return String(date.getFullYear());
}

function csvValue(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function getDocumentDownloadName(pathOrUrl, fallbackName) {
  if (!pathOrUrl || typeof pathOrUrl !== "string") return fallbackName;
  const cleanPath = pathOrUrl.split("?")[0].split("#")[0];
  const fileName = cleanPath.split("/").filter(Boolean).pop();
  return fileName || fallbackName;
}

function AdmissionPage() {
  const navigate = useNavigate();
  const { showError, Toast } = useFloatingToast();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [documentFilter, setDocumentFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [admissions, setAdmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadAdmissions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [admissionsData, coursesData] = await Promise.all([
        adminApi.admissions.list(),
        adminApi.courses.list(),
      ]);
      setAdmissions(Array.isArray(admissionsData) ? admissionsData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load admissions");
      showError(getApiErrorMessage(e, "Failed to load admissions"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmissions();
  }, [loadAdmissions]);

  const coursesById = useMemo(() => {
    const map = new Map();
    for (const c of courses) map.set(String(c.id), c);
    return map;
  }, [courses]);

  const courseOptions = useMemo(() => {
    return courses
      .map((c) => ({ id: String(c.id), title: c.title || `Course #${c.id}` }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [courses]);

  const yearlySubmissionStats = useMemo(() => {
    const counts = new Map();

    for (const admission of admissions) {
      const year = getSubmissionYear(admission);
      if (!year) continue;
      counts.set(year, (counts.get(year) || 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => Number(b.year) - Number(a.year));
  }, [admissions]);

  const yearOptions = useMemo(
    () => yearlySubmissionStats.map((item) => item.year),
    [yearlySubmissionStats]
  );

  const filteredAdmissions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = admissions.filter((admission) => {
      const course = coursesById.get(String(admission.course_id));
      const matchesCourse = !selectedCourseId || String(admission.course_id) === selectedCourseId;
      const matchesYear = !selectedYear || getSubmissionYear(admission) === selectedYear;
      const hasRequiredDocuments =
        Boolean(admission.education_certificate) && Boolean(admission.personal_statement);
      const hasOptionalDocuments =
        Boolean(admission.language_proficiency) ||
        Boolean(admission.profile) ||
        Boolean(admission.other_document);

      const matchesDocumentFilter =
        !documentFilter ||
        (documentFilter === "complete" && hasRequiredDocuments) ||
        (documentFilter === "missing" && !hasRequiredDocuments) ||
        (documentFilter === "optional" && hasOptionalDocuments);

      const searchableText = [
        admission.name,
        admission.email,
        admission.phone,
        admission.national_id,
        admission.student_id,
        course?.title,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);

      return matchesCourse && matchesYear && matchesDocumentFilter && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const firstDate = new Date(a.created_at || 0).getTime();
      const secondDate = new Date(b.created_at || 0).getTime();
      return sortOrder === "oldest" ? firstDate - secondDate : secondDate - firstDate;
    });
  }, [admissions, coursesById, documentFilter, searchTerm, selectedCourseId, selectedYear, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAdmissions.length / pageSize));
  const paginatedAdmissions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAdmissions.slice(start, start + pageSize);
  }, [filteredAdmissions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [documentFilter, searchTerm, selectedCourseId, selectedYear, sortOrder, admissions.length]);

  const handleViewDetails = (admission) => {
    navigate(`/piu/admin/admission/${admission.id}`);
  };

  const hasActiveFilters =
    Boolean(selectedCourseId) ||
    Boolean(selectedYear) ||
    Boolean(searchTerm.trim()) ||
    Boolean(documentFilter) ||
    sortOrder !== "newest";

  const handleClearFilters = () => {
    setSelectedCourseId("");
    setSelectedYear("");
    setSearchTerm("");
    setDocumentFilter("");
    setSortOrder("newest");
  };

  const handleExportCsv = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Course",
      "Submitted At",
      "Education Certificate",
      "Personal Statement",
      "Other Document",
    ];

    const rows = filteredAdmissions.map((admission) => {
      const course = coursesById.get(String(admission.course_id));
      return [
        admission.name,
        admission.email,
        admission.phone,
        course?.title || `Course #${admission.course_id ?? ""}`,
        admission.created_at,
        admission.education_certificate ? "Yes" : "No",
        admission.personal_statement ? "Yes" : "No",
        admission.other_document ? "Yes" : "No",
      ];
    });

    const csv = [headers, ...rows]
      .map((row) => row.map(csvValue).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admissions-${selectedYear || "all-years"}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  };

  const handleDocumentAction = async (action, admissionId, field, fileName) => {
    try {
      if (action === "view") {
        await openAdmissionDocument(admissionId, field);
      } else {
        await downloadAdmissionDocument(admissionId, field, fileName);
      }
    } catch (e) {
      showError(getApiErrorMessage(e, "Failed to open admission document"));
    }
  };

  const renderDocumentActions = (admissionId, field, fileName, iconClass, iconColor, label) => {
    if (!field) {
      return <span className="text-gray-400 text-sm">-</span>;
    }

    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleDocumentAction("view", admissionId, field, fileName)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
        >
          <i className={`${iconClass} mr-2 ${iconColor}`}></i>
          View
        </button>
        <button
          type="button"
          onClick={() => handleDocumentAction("download", admissionId, field, fileName)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title={`Download ${label}`}
          aria-label={`Download ${label}`}
        >
          <FaDownload className="text-sm" />
        </button>
      </div>
    );
  };

  const renderAdmissionRow = (admission, index) => {
    const course = coursesById.get(String(admission.course_id));
    const certificateName = getDocumentDownloadName(
      admission.education_certificate,
      `education-certificate-${admission.id}`
    );
    const statementName = getDocumentDownloadName(
      admission.personal_statement,
      `personal-statement-${admission.id}`
    );
    const otherName = getDocumentDownloadName(
      admission.other_document,
      `other-document-${admission.id}`
    );

    return (
      <tr key={admission.id} className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          {(currentPage - 1) * pageSize + index + 1}
        </td>
        <td className="px-4 py-4 min-w-[220px] text-sm">
          <div className="font-medium text-gray-900">{admission.name}</div>
          <div className="text-gray-500 break-all">{admission.email || "-"}</div>
          <div className="text-gray-500">{admission.phone || "-"}</div>
        </td>
        <td className="px-4 py-4 min-w-[180px] text-sm text-gray-900">
          {course?.title || `Course #${admission.course_id ?? "-"}`}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
          {formatDateTime(admission.created_at)}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm">
          {renderDocumentActions(
            admission.id,
            hasAdmissionDocument(admission, "education_certificate") ? "education_certificate" : null,
            certificateName,
            "fas fa-file-pdf",
            "text-red-500",
            "education certificate"
          )}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm">
          {renderDocumentActions(
            admission.id,
            hasAdmissionDocument(admission, "personal_statement") ? "personal_statement" : null,
            statementName,
            "fas fa-file-alt",
            "text-blue-500",
            "personal statement"
          )}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm">
          {renderDocumentActions(
            admission.id,
            hasAdmissionDocument(admission, "other_document") ? "other_document" : null,
            otherName,
            "fas fa-file-word",
            "text-blue-700",
            "other document"
          )}
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              onClick={() => handleViewDetails(admission)}
            >
              <i className="fas fa-eye mr-2"></i>
              View Details
            </button>
            {admission.email && (
              <a
                href={`mailto:${admission.email}`}
                className="inline-flex items-center bg-white text-gray-700 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <i className="fas fa-envelope mr-2"></i>
                Email
              </a>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const renderAdmissionCard = (admission, index) => {
    const course = coursesById.get(String(admission.course_id));
    const certificateName = getDocumentDownloadName(
      admission.education_certificate,
      `education-certificate-${admission.id}`
    );
    const statementName = getDocumentDownloadName(
      admission.personal_statement,
      `personal-statement-${admission.id}`
    );
    const otherName = getDocumentDownloadName(
      admission.other_document,
      `other-document-${admission.id}`
    );

    return (
      <div key={admission.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-medium text-gray-500">
              #{(currentPage - 1) * pageSize + index + 1}
            </div>
            <div className="mt-1 font-semibold text-gray-900 break-words">{admission.name}</div>
            <div className="mt-1 text-sm text-gray-500 break-all">{admission.email || "-"}</div>
            <div className="text-sm text-gray-500">{admission.phone || "-"}</div>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600"
            onClick={() => handleViewDetails(admission)}
          >
            View
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
          <div>
            <div className="text-xs font-semibold uppercase text-gray-500">Applied Course</div>
            <div className="mt-1 text-gray-900">{course?.title || `Course #${admission.course_id ?? "-"}`}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-gray-500">Submitted</div>
            <div className="mt-1 text-gray-700">{formatDateTime(admission.created_at)}</div>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="text-xs font-semibold uppercase text-gray-500">Documents</div>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700">Education Certificate</span>
              {renderDocumentActions(admission.id, hasAdmissionDocument(admission, "education_certificate") ? "education_certificate" : null, certificateName, "fas fa-file-pdf", "text-red-500", "education certificate")}
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700">Personal Statement</span>
              {renderDocumentActions(admission.id, hasAdmissionDocument(admission, "personal_statement") ? "personal_statement" : null, statementName, "fas fa-file-alt", "text-blue-500", "personal statement")}
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700">Other Document</span>
              {renderDocumentActions(admission.id, hasAdmissionDocument(admission, "other_document") ? "other_document" : null, otherName, "fas fa-file-word", "text-blue-700", "other document")}
            </div>
          </div>
        </div>

        {admission.email && (
          <a
            href={`mailto:${admission.email}`}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <i className="fas fa-envelope mr-2"></i>
            Email Applicant
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <Toast />
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">Admissions Management</h2>
        <p className="text-blue-100 mt-1">Review student applications</p>
      </div>

      {/* Submissions by year */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Admission Form Submissions by Year
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {admissions.length} total application{admissions.length === 1 ? "" : "s"} received
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedYear("")}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedYear
              ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              : "bg-[#002147] text-white border-[#002147]"
              }`}
          >
            All Years
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {yearlySubmissionStats.length > 0 ? (
            yearlySubmissionStats.map((item) => (
              <button
                key={item.year}
                type="button"
                onClick={() => setSelectedYear(item.year)}
                className={`text-left rounded-lg border p-4 transition-colors ${selectedYear === item.year
                  ? "border-[#002147] bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                  }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-500">Year</span>
                  {selectedYear === item.year && (
                    <span className="rounded-full bg-[#002147] px-2 py-1 text-xs font-semibold text-white">
                      Selected
                    </span>
                  )}
                </div>
                <div className="mt-2 text-2xl font-bold text-gray-900">{item.year}</div>
                <div className="mt-1 text-sm text-gray-600">
                  {item.count} submission{item.count === 1 ? "" : "s"}
                </div>
              </button>
            ))
          ) : (
            <div className="sm:col-span-2 lg:col-span-4 rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
              No yearly submission data available yet.
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
            <div className="sm:col-span-2 lg:col-span-4 xl:col-span-3 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Applicant
              </label>
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name, email, phone, ID..."
                  className="w-full min-w-0 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="lg:col-span-2 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full min-w-0 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Years</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-3 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full min-w-0 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Courses</option>
                {courseOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documents
              </label>
              <select
                value={documentFilter}
                onChange={(e) => setDocumentFilter(e.target.value)}
                className="w-full min-w-0 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Documents</option>
                <option value="complete">Required Complete</option>
                <option value="missing">Missing Required</option>
                <option value="optional">Has Optional Files</option>
              </select>
            </div>

            <div className="lg:col-span-1 xl:col-span-2 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full min-w-0 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-gray-600 order-2 sm:order-1">
              Showing {filteredAdmissions.length} of {admissions.length} application
              {admissions.length === 1 ? "" : "s"}
              {hasActiveFilters && (
                <span className="ml-0 sm:ml-2 mt-1 sm:mt-0 block sm:inline text-blue-700">
                  Filters are active
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 order-1 sm:order-2">
              <button
                type="button"
                onClick={loadAdmissions}
                disabled={loading}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <i className="fas fa-sync-alt"></i>
                Refresh
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <i className="fas fa-times"></i>
                Reset
              </button>
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={filteredAdmissions.length === 0}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#002147] text-sm font-medium text-white hover:bg-[#00356f] disabled:opacity-50"
              >
                <i className="fas fa-download"></i>
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-4 sm:p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="lg:hidden">
          {loading && (
            <div className="rounded-lg border border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-500">
              Loading admissions...
            </div>
          )}

          {!loading && paginatedAdmissions.length > 0 && (
            <div className="space-y-4">
              {paginatedAdmissions.map((admission, index) => renderAdmissionCard(admission, index))}
            </div>
          )}

          {!loading && filteredAdmissions.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white px-6 py-8 text-center">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <i className="fas fa-file-alt text-4xl mb-3 text-gray-300"></i>
                <p className="font-medium">No admissions found</p>
                <p className="text-sm mt-1">
                  {hasActiveFilters
                    ? "Try changing or resetting the active filters"
                    : "No applications have been submitted yet"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-[1180px] w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Education Certificate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personal Statement
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Other Document
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                    Loading admissions...
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedAdmissions.map((admission, index) => renderAdmissionRow(admission, index))}

              {!loading && filteredAdmissions.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <i className="fas fa-file-alt text-4xl mb-3 text-gray-300"></i>
                      <p className="font-medium">No admissions found</p>
                      <p className="text-sm mt-1">
                        {hasActiveFilters
                          ? "Try changing or resetting the active filters"
                          : "No applications have been submitted yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredAdmissions.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div>
              Page {currentPage} of {totalPages}
            </div>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default AdmissionPage;
