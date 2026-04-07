import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/admin";
import { toStorageUrl } from "../../api/axios";

function AdmissionPage() {
  const navigate = useNavigate();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [admissions, setAdmissions] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [admissionsData, coursesData] = await Promise.all([
          adminApi.admissions.list(),
          adminApi.courses.list(),
        ]);
        if (!mounted) return;
        setAdmissions(Array.isArray(admissionsData) ? admissionsData : []);
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load admissions");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const coursesById = useMemo(() => {
    const map = new Map();
    for (const c of courses) map.set(String(c.id), c);
    return map;
  }, [courses]);

  const courseOptions = useMemo(() => {
    return courses
      .map((c) => ({ id: String(c.id), title: c.title }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [courses]);

  const filteredAdmissions = useMemo(() => {
    if (!selectedCourseId) return admissions;
    return admissions.filter((a) => String(a.course_id) === selectedCourseId);
  }, [admissions, selectedCourseId]);

  const handleViewDetails = (admission) => {
    navigate(`/piu/admin/admission/${admission.id}`);
  };

  const formatDateTime = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  };

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">Admissions Management</h2>
        <p className="text-blue-100 mt-1">Review student applications</p>
      </div>

      {/* Degree filter */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Filter by Course:
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Courses</option>
            {courseOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Education Certificate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personal Statement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Other Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                filteredAdmissions.map((admission, index) => {
                  const course = coursesById.get(String(admission.course_id));
                  const certificateUrl = toStorageUrl(admission.education_certificate);
                  const statementUrl = toStorageUrl(admission.personal_statement);
                  const otherUrl = toStorageUrl(admission.other_document);
                  return (
                <tr key={admission.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {admission.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course?.title || `Course #${admission.course_id ?? "-"}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDateTime(admission.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {certificateUrl ? (
                      <a
                        href={certificateUrl}
                        className="inline-flex items-center hover:text-blue-800 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fas fa-file-pdf mr-2 text-red-500"></i>
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {statementUrl ? (
                      <a
                        href={statementUrl}
                        className="inline-flex items-center hover:text-blue-800 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fas fa-file-alt mr-2 text-blue-500"></i>
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {otherUrl ? (
                      <a
                        href={otherUrl}
                        className="inline-flex items-center hover:text-blue-800 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fas fa-file-word mr-2 text-blue-700"></i>
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      onClick={() => handleViewDetails(admission)}
                    >
                      <i className="fas fa-eye mr-2"></i>
                      View Details
                    </button>
                  </td>
                </tr>
                  );
                })}

              {!loading && filteredAdmissions.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <i className="fas fa-file-alt text-4xl mb-3 text-gray-300"></i>
                      <p className="font-medium">No admissions found</p>
                      <p className="text-sm mt-1">
                        {selectedCourseId 
                          ? `for ${coursesById.get(selectedCourseId)?.title || `course #${selectedCourseId}`}` 
                          : "No applications have been submitted yet"
                        }
                      </p>
                    </div>
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

export default AdmissionPage;