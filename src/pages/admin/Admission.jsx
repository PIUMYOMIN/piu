import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdmissionPage() {
  const navigate = useNavigate();
  const degrees = [
    "Bachelor of Arts in Education",
    "Bachelor of Arts in Tourism",
    "Bachelor of Business Administration",
    "Bachelor of Science in Information and Communication Technology",
  ];

  const [selectedDegree, setSelectedDegree] = useState("");

  const admissions = [
    {
      id: 1,
      name: "John Doe",
      degree: "Bachelor of Arts in Education",
      certificate: "/sample/certificate.pdf",
      statement: "/sample/statement.pdf",
      other: "/sample/other.pdf",
    },
    {
      id: 2,
      name: "Jane Smith",
      degree: "Bachelor of Business Administration",
      certificate: "/sample/certificate.pdf",
      statement: "/sample/statement.pdf",
      other: "/sample/other.pdf",
    },
  ];

  const filteredAdmissions = selectedDegree
    ? admissions.filter((a) => a.degree === selectedDegree)
    : admissions;

  const handleViewDetails = (applicant) => {
    navigate("/piu/admin/admission/details", { state: { applicant } });
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
            Filter by Degree:
          </label>
          <select
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Degrees</option>
            {degrees.map((deg, index) => (
              <option key={index} value={deg}>
                {deg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
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
                  Applied Degree
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
              {filteredAdmissions.map((admission, index) => (
                <tr key={admission.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {admission.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {admission.degree}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    <a
                      href={admission.certificate}
                      className="inline-flex items-center hover:text-blue-800 hover:underline"
                      download
                    >
                      <i className="fas fa-file-pdf mr-2 text-red-500"></i>
                      Download
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    <a
                      href={admission.statement}
                      className="inline-flex items-center hover:text-blue-800 hover:underline"
                      download
                    >
                      <i className="fas fa-file-alt mr-2 text-blue-500"></i>
                      Download
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    <a
                      href={admission.other}
                      className="inline-flex items-center hover:text-blue-800 hover:underline"
                      download
                    >
                      <i className="fas fa-file-word mr-2 text-blue-700"></i>
                      Download
                    </a>
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
              ))}

              {filteredAdmissions.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <i className="fas fa-file-alt text-4xl mb-3 text-gray-300"></i>
                      <p className="font-medium">No admissions found</p>
                      <p className="text-sm mt-1">
                        {selectedDegree 
                          ? `for ${selectedDegree}` 
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