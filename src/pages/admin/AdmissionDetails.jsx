import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AdmissionDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { applicant } = location.state || {};

  // Sample data in case no applicant is passed
  const sampleApplicant = {
    id: 1,
    name: "John Doe",
    profile: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    course: "Bachelor of Arts in Education",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    country: "United States",
    city: "New York",
    zipCode: "10001",
    birthday: "1995-05-15",
    nationalId: "ID-123456789",
    maritalStatus: "Single",
    gender: "Male",
    studentStatus: "New Applicant",
    otherDocument: "/sample/other.pdf",
    certificate: "/sample/certificate.pdf",
    statement: "/sample/statement.pdf",
    other: "/sample/other.pdf"
  };

  const data = applicant || sampleApplicant;

  const handleBack = () => {
    navigate("piu/admin/admission");
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Applicant Details</h2>
            <p className="text-blue-100 mt-1">Complete application information</p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center text-white hover:text-blue-200 text-sm"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to List
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Profile Image */}
          <div className="md:col-span-1 flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
              <img
                src={data.profile}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900">{data.name}</h3>
            <p className="text-blue-600 font-medium">{data.course}</p>
            <p className="text-gray-600 mt-2">
              <i className="fas fa-envelope mr-2 text-blue-500"></i>
              {data.email}
            </p>
            <p className="text-gray-600">
              <i className="fas fa-phone mr-2 text-blue-500"></i>
              {data.phone}
            </p>
          </div>
        </div>

        {/* Details Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Applicant Name
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.name}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Applied Course
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.course}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Email
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.email}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Phone
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.phone}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Address
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.address}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Country
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.country}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  City
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.city}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Zip Code
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.zipCode}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Birthday
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.birthday}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  National ID
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.nationalId}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Marital Status
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.maritalStatus}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Gender
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.gender}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Student Status
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.studentStatus}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Education Certificate
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <a
                    href={data.certificate}
                    className="inline-flex items-center hover:text-blue-800 hover:underline"
                    download
                  >
                    <i className="fas fa-file-pdf mr-2 text-red-500"></i>
                    Download Certificate
                  </a>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Personal Statement
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <a
                    href={data.statement}
                    className="inline-flex items-center hover:text-blue-800 hover:underline"
                    download
                  >
                    <i className="fas fa-file-alt mr-2 text-blue-500"></i>
                    Download Statement
                  </a>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  Other Document
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <a
                    href={data.otherDocument}
                    className="inline-flex items-center hover:text-blue-800 hover:underline"
                    download
                  >
                    <i className="fas fa-file-download mr-2 text-blue-500"></i>
                    Download Document
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleBack}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to List
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Contact Applicant
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdmissionDetails;