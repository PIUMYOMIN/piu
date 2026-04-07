import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import adminApi from "../../api/admin";
import { toStorageUrl } from "../../api/axios";

function AdmissionDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const applicantFromState = location.state?.applicant;

  const initialId = params.id || applicantFromState?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [admission, setAdmission] = useState(null);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    city: "",
    zipcode: "",
    dob: "",
    national_id: "",
    marital_sts: "",
    gender: "",
    alumni_sts: "",
    student_id: "",
    course_id: "",
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const [coursesData, admissionData] = await Promise.all([
          adminApi.courses.list(),
          initialId ? adminApi.admissions.get(initialId) : Promise.resolve(null),
        ]);
        if (!mounted) return;

        setCourses(Array.isArray(coursesData) ? coursesData : []);

        const resolved = admissionData || applicantFromState || null;
        setAdmission(resolved);

        if (resolved) {
          setForm({
            name: resolved.name || "",
            email: resolved.email || "",
            phone: resolved.phone || "",
            address: resolved.address || "",
            country: resolved.country || "",
            city: resolved.city || "",
            zipcode: resolved.zipcode || "",
            dob: (resolved.dob || "").slice(0, 10),
            national_id: resolved.national_id || "",
            marital_sts: resolved.marital_sts || "",
            gender: resolved.gender || "",
            alumni_sts: resolved.alumni_sts || "",
            student_id: resolved.student_id || "",
            course_id: resolved.course_id ? String(resolved.course_id) : "",
          });
        }
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

  const courseTitle = admission?.course_id ? coursesById.get(String(admission.course_id))?.title : "";

  const handleBack = () => {
    navigate("/piu/admin/admission");
  };

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = async () => {
    if (!admission?.id) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        country: form.country,
        city: form.city,
        zipcode: form.zipcode,
        dob: form.dob,
        national_id: form.national_id,
        marital_sts: form.marital_sts,
        gender: form.gender,
        alumni_sts: form.alumni_sts,
        student_id: form.student_id || null,
        course_id: form.course_id ? Number(form.course_id) : undefined,
      };

      const updated = await adminApi.admissions.update(admission.id, payload);
      setAdmission(updated || admission);
      setSuccess("Saved successfully.");
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const profileUrl = toStorageUrl(admission?.profile);
  const certificateUrl = toStorageUrl(admission?.education_certificate);
  const statementUrl = toStorageUrl(admission?.personal_statement);
  const otherUrl = toStorageUrl(admission?.other_document);
  const languageUrl = toStorageUrl(admission?.language_proficiency);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 text-gray-600">
        Loading applicant details...
      </div>
    );
  }

  if (!admission) {
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[#002147] p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Applicant Details</h2>
              <p className="text-blue-100 mt-1">No applicant selected</p>
            </div>
            <button onClick={handleBack} className="flex items-center text-white hover:text-blue-200 text-sm">
              <i className="fas fa-arrow-left mr-2"></i>
              Back to List
            </button>
          </div>
        </div>
        <div className="p-6 text-gray-600 text-sm">Please open details from the admissions list.</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Applicant Details</h2>
            <p className="text-blue-100 mt-1">Complete application information</p>
          </div>
          <button onClick={handleBack} className="flex items-center text-white hover:text-blue-200 text-sm">
            <i className="fas fa-arrow-left mr-2"></i>
            Back to List
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Profile Image */}
          <div className="md:col-span-1 flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-50">
              <img
                src={profileUrl || "https://via.placeholder.com/128"}
                alt={admission.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900">{admission.name}</h3>
            <p className="text-blue-600 font-medium">{courseTitle || `Course #${admission.course_id ?? "-"}`}</p>
            <p className="text-gray-600 mt-2">
              <i className="fas fa-envelope mr-2 text-blue-500"></i>
              {admission.email}
            </p>
            <p className="text-gray-600">
              <i className="fas fa-phone mr-2 text-blue-500"></i>
              {admission.phone}
            </p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="mb-6 rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 text-sm font-medium text-gray-700">Edit applicant info</div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                value={form.name}
                onChange={handleChange("name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                value={form.email}
                onChange={handleChange("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={handleChange("phone")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select
                value={form.course_id}
                onChange={handleChange("course_id")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select course</option>
                {courses
                  .slice()
                  .sort((a, b) => String(a.title).localeCompare(String(b.title)))
                  .map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.title}
                    </option>
                  ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                value={form.address}
                onChange={handleChange("address")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                value={form.country}
                onChange={handleChange("country")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                value={form.city}
                onChange={handleChange("city")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zipcode</label>
              <input
                value={form.zipcode}
                onChange={handleChange("zipcode")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={handleChange("dob")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
              <input
                value={form.national_id}
                onChange={handleChange("national_id")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <input
                value={form.gender}
                onChange={handleChange("gender")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marital status</label>
              <input
                value={form.marital_sts}
                onChange={handleChange("marital_sts")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alumni status</label>
              <input
                value={form.alumni_sts}
                onChange={handleChange("alumni_sts")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID (optional)</label>
              <input
                value={form.student_id}
                onChange={handleChange("student_id")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Education Certificate</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  {certificateUrl ? (
                    <a href={certificateUrl} target="_blank" rel="noreferrer" className="hover:underline">
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Personal Statement</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  {statementUrl ? (
                    <a href={statementUrl} target="_blank" rel="noreferrer" className="hover:underline">
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Other Document</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  {otherUrl ? (
                    <a href={otherUrl} target="_blank" rel="noreferrer" className="hover:underline">
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Language Proficiency</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  {languageUrl ? (
                    <a href={languageUrl} target="_blank" rel="noreferrer" className="hover:underline">
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleBack}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdmissionDetails;