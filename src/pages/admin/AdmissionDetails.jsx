import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import adminApi from "../../api/admin";
import { toStorageUrl } from "../../utils/api";

function Row({ label, value }) {
  return (
    <tr>
      <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 w-60">{label}</td>
      <td className="px-4 py-3 text-sm text-gray-900">{value || "—"}</td>
    </tr>
  );
}

export default function AdmissionDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const applicantFromState = location.state?.applicant;
  const initialId = params.id || applicantFromState?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [admission, setAdmission] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [coursesData, admissionData] = await Promise.all([
          adminApi.courses.list(),
          initialId ? adminApi.admissions.get(initialId) : Promise.resolve(null),
        ]);
        if (!mounted) return;
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setAdmission(admissionData || applicantFromState || null);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load admission details");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [initialId, applicantFromState]);

  const coursesById = useMemo(() => {
    const map = new Map();
    for (const c of courses) map.set(String(c.id), c);
    return map;
  }, [courses]);

  if (loading) {
    return <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 text-gray-600">Loading applicant details...</div>;
  }

  if (!admission) {
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[#002147] p-6 text-white flex justify-between">
          <h2 className="text-2xl font-bold">Admission Details</h2>
          <button onClick={() => navigate("/piu/admin/admission")} className="text-sm hover:text-blue-200">
            Back to List
          </button>
        </div>
        <div className="p-6 text-gray-600">No admission selected.</div>
      </div>
    );
  }

  const profileUrl = toStorageUrl(admission?.profile);
  const certificateUrl = toStorageUrl(admission?.education_certificate);
  const statementUrl = toStorageUrl(admission?.personal_statement);
  const otherUrl = toStorageUrl(admission?.other_document);
  const languageUrl = toStorageUrl(admission?.language_proficiency);
  const courseTitle = admission?.course_id ? coursesById.get(String(admission.course_id))?.title : "";

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-[#002147] p-6 text-white flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Admission Details</h2>
          <p className="text-blue-100 mt-1">Applicant information in table format</p>
        </div>
        <button onClick={() => navigate("/piu/admin/admission")} className="text-sm hover:text-blue-200">
          Back to List
        </button>
      </div>

      <div className="p-6">
        {error && <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}

        <div className="mb-6 flex items-center gap-4">
          <img src={profileUrl || "https://via.placeholder.com/96"} alt={admission.name} className="w-24 h-24 rounded-full border object-cover" />
          <div>
            <p className="text-xl font-semibold text-gray-900">{admission.name || "—"}</p>
            <p className="text-blue-700">{courseTitle || `Course #${admission.course_id ?? "-"}`}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <Row label="Name" value={admission.name} />
              <Row label="Email" value={admission.email} />
              <Row label="Phone" value={admission.phone} />
              <Row label="Course" value={courseTitle || admission.course_id} />
              <Row label="Address" value={admission.address} />
              <Row label="Country" value={admission.country} />
              <Row label="City" value={admission.city} />
              <Row label="Zipcode" value={admission.zipcode} />
              <Row label="Date of Birth" value={admission.dob} />
              <Row label="National ID" value={admission.national_id} />
              <Row label="Gender" value={admission.gender} />
              <Row label="Marital Status" value={admission.marital_sts} />
              <Row label="Alumni Status" value={admission.alumni_sts} />
              <Row label="Student ID" value={admission.student_id} />
              <Row
                label="Education Certificate"
                value={certificateUrl ? <a href={certificateUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View</a> : "—"}
              />
              <Row
                label="Personal Statement"
                value={statementUrl ? <a href={statementUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View</a> : "—"}
              />
              <Row
                label="Other Document"
                value={otherUrl ? <a href={otherUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View</a> : "—"}
              />
              <Row
                label="Language Proficiency"
                value={languageUrl ? <a href={languageUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View</a> : "—"}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
