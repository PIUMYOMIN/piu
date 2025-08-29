import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Prefill if editing
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    dob: "",
    academicYear: "",
    program: "",
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
    if (id) {
      // Simulate fetching existing student
      setForm({
        firstName: "Lucifer",
        lastName: "Morningstar",
        studentId: "ST001",
        dob: "2000-01-01",
        academicYear: "2025",
        program: "ICT",
        phone: "123456",
        email: "lucifer@mail.com",
        address: "Yangon",
        permanentAddress: "Mandalay",
        city: "Yangon",
        country: "Myanmar",
        nationalId: "123456789",
        passport: "",
        gender: "Male",
        maritalStatus: "Single",
        profile: null,
        certificate: null,
        otherDocs: null,
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    navigate("/piu/admin/students");
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
                  Marital Status
                </label>
                <select
                  name="maritalStatus"
                  value={form.maritalStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  name="academicYear"
                  value={form.academicYear}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Academic Year</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program <span className="text-red-500">*</span>
                </label>
                <select
                  name="program"
                  value={form.program}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Program</option>
                  <option value="ICT">ICT</option>
                  <option value="Business">Business</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Medicine">Medicine</option>
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
      </div>
    </div>
  );
};

export default AddStudent;