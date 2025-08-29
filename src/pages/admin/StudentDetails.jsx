import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Simulate fetching data
    setStudent({
      id,
      firstName: "Lucifer",
      lastName: "Morningstar",
      studentId: "ST001",
      program: "ICT",
      dob: "2000-01-01",
      phone: "123456",
      email: "lucifer@mail.com",
      address: "Yangon",
      city: "Yangon",
      country: "Myanmar",
      nationalId: "123456789",
      gender: "Male",
      maritalStatus: "Single",
    });
  }, [id]);

  if (!student) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002147]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-[#002147] text-white px-5 py-3 rounded-t-lg shadow-md flex justify-between items-center">
        <h2 className="text-xl font-semibold">Student Details</h2>
        <span className="text-sm bg-blue-700 px-2 py-1 rounded">ID: {student.studentId}</span>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-b-lg shadow-md p-6">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b border-gray-200">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-indigo-500 text-4xl shadow-inner">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600 text-lg mt-1">{student.program} Program</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {student.gender}
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                {student.maritalStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#002147] mb-4 pb-2 border-b border-gray-200">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="w-2/5 text-gray-600 font-medium">Date of Birth</div>
                <div className="w-3/5 text-gray-800">{student.dob}</div>
              </div>
              <div className="flex">
                <div className="w-2/5 text-gray-600 font-medium">National ID</div>
                <div className="w-3/5 text-gray-800">{student.nationalId}</div>
              </div>
              <div className="flex">
                <div className="w-2/5 text-gray-600 font-medium">Gender</div>
                <div className="w-3/5 text-gray-800">{student.gender}</div>
              </div>
              <div className="flex">
                <div className="w-2/5 text-gray-600 font-medium">Marital Status</div>
                <div className="w-3/5 text-gray-800">{student.maritalStatus}</div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#002147] mb-4 pb-2 border-b border-gray-200">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="w-2/5 text-gray-600 font-medium">Phone</div>
                <div className="w-3/5 text-gray-800">{student.phone}</div>
              </div>
              <div className="flex">
                <div className="w-2/5 text-gray-600 font-medium">Email</div>
                <div className="w-3/5 text-gray-800 break-all">{student.email}</div>
              </div>
              <div className="flex">
                <div className="w-2/5 text-gray-600 font-medium">Address</div>
                <div className="w-3/5 text-gray-800">{student.address}</div>
              </div>
              <div className="flex">
                <div className="w-2/5 text-gray-600 font-medium">City/Country</div>
                <div className="w-3/5 text-gray-800">{student.city}, {student.country}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex space-x-4">
          <button
            onClick={() => navigate(`/piu/admin/students/edit/${student.id}`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md shadow flex items-center"
          >
            <i className="fas fa-edit mr-2"></i> Edit Student
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-md shadow flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;