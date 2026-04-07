import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin";

const AddStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    dob: "",
    yearId: "",
    courseId: "",
    phone: "",
    email: "",
    address: "",
    permanentAddress: "",
    city: "",
    country: "",
    nationalId: "",
    passport: "",
    gender: "",
    maritalStatus: "",
    profile: null,
    certificate: null,
    otherDocs: null,
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [courseData, yearData] = await Promise.all([
          adminApi.courses.list(),
          adminApi.meta.years(),
        ]);
        if (!mounted) return;
        setCourses(Array.isArray(courseData) ? courseData : []);
        setYears(Array.isArray(yearData) ? yearData : []);

        if (id) {
          const s = await adminApi.students.get(id);
          if (!mounted) return;
          setForm((prev) => ({
            ...prev,
            firstName: s?.fname || "",
            lastName: s?.lname || "",
            studentId: s?.student_id || "",
            dob: s?.dob || "",
            yearId: s?.year_id ? String(s.year_id) : "",
            courseId: s?.course_id ? String(s.course_id) : "",
            phone: s?.phone || "",
            email: s?.email || "",
            address: s?.address || "",
            permanentAddress: s?.permanent_address || "",
            city: s?.city || "",
            country: s?.country || "",
            nationalId: s?.national_id || "",
            passport: s?.passport_id || "",
            gender: s?.gender_sts || "",
            maritalStatus: s?.marital_sts || "",
            profile: null,
            certificate: null,
            otherDocs: null,
          }));
        }
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load student form");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const fd = new FormData();
      fd.append("fname", form.firstName);
      fd.append("lname", form.lastName || "");
      fd.append("student_id", form.studentId);
      fd.append("dob", form.dob || "");
      fd.append("year_id", form.yearId);
      fd.append("course_id", form.courseId || "");
      fd.append("phone", form.phone);
      fd.append("email", form.email);
      fd.append("address", form.address);
      fd.append("permanent_address", form.permanentAddress || "");
      fd.append("city", form.city);
      fd.append("country", form.country);
      fd.append("national_id", form.nationalId);
      fd.append("passport_id", form.passport || "");
      fd.append("gender_sts", form.gender);
      fd.append("marital_sts", form.maritalStatus || "");

      if (form.profile instanceof File) fd.append("profile", form.profile);
      if (form.certificate instanceof File) fd.append("education_certificate", form.certificate);
      if (form.otherDocs instanceof File) fd.append("other_documents", form.otherDocs);

      if (id) {
        await adminApi.students.update(id, fd);
      } else {
        await adminApi.students.create(fd);
      }
      navigate("/piu/admin/students");
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || "Failed to save student");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-[#002147] text-white px-5 py-3 rounded-t-lg shadow-md">
        <h2 className="text-xl font-semibold flex items-center">
          <i className="fas fa-user-graduate mr-2"></i>
          {id ? "Edit Student" : "Add New Student"}
        </h2>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-b-lg shadow-md p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading form...</div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-[#002147] mb-4 flex items-center">
              <i className="fas fa-user-circle mr-2"></i>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marital Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="maritalStatus"
                  value={form.maritalStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  National ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nationalId"
                  value={form.nationalId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passport No (Optional)
                </label>
                <input
                  type="text"
                  name="passport"
                  value={form.passport}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-[#002147] mb-4 flex items-center">
              <i className="fas fa-graduation-cap mr-2"></i>
              Academic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <select
                  name="yearId"
                  value={form.yearId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Academic Year</option>
                  {years.map((y) => (
                    <option key={y.id} value={String(y.id)}>
                      {y.name || `Year ${y.id}`}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program <span className="text-red-500">*</span>
                </label>
                <select
                  name="courseId"
                  value={form.courseId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Program</option>
                  {courses.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-[#002147] mb-4 flex items-center">
              <i className="fas fa-address-book mr-2"></i>
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permanent Address
                </label>
                <textarea
                  name="permanentAddress"
                  value={form.permanentAddress}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="pb-6">
            <h3 className="text-lg font-semibold text-[#002147] mb-4 flex items-center">
              <i className="fas fa-file-alt mr-2"></i>
              Documents
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Photo
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <i className="fas fa-cloud-upload-alt text-gray-400 text-2xl mb-2"></i>
                      <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                    </div>
                    <input 
                      type="file" 
                      name="profile" 
                      onChange={handleChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education Certificate
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <i className="fas fa-file-pdf text-gray-400 text-2xl mb-2"></i>
                      <p className="text-xs text-gray-500">PDF up to 5MB</p>
                    </div>
                    <input 
                      type="file" 
                      name="certificate" 
                      onChange={handleChange} 
                      className="hidden" 
                      required={!id}
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Documents
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <i className="fas fa-file-archive text-gray-400 text-2xl mb-2"></i>
                      <p className="text-xs text-gray-500">ZIP, PDF, DOCX</p>
                    </div>
                    <input 
                      type="file" 
                      name="otherDocs" 
                      onChange={handleChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/piu/admin/students")}
              className="px-5 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <i className="fas fa-save mr-2"></i>
              {id ? "Update Student" : "Add Student"}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default AddStudent;