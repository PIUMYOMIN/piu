import React, { useState } from "react";

function AdmissionPage() {
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

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        Admissions
      </h2>

      {/* Degree filter */}
      <div className="p-4">
        <label className="font-medium mr-2">Filter by Degree:</label>
        <select
          value={selectedDegree}
          onChange={(e) => setSelectedDegree(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Degrees</option>
          {degrees.map((deg, index) => (
            <option key={index} value={deg}>
              {deg}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-4">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Applicant Name</th>
              <th className="border p-2">Applied Degree</th>
              <th className="border p-2">Education Certificate</th>
              <th className="border p-2">Personal Statement</th>
              <th className="border p-2">Other Document</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmissions.map((admission, index) => (
              <tr key={admission.id} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{admission.name}</td>
                <td className="border p-2">{admission.degree}</td>
                <td className="border p-2">
                  <a
                    href={admission.certificate}
                    className="text-blue-500 hover:underline"
                    download
                  >
                    Download
                  </a>
                </td>
                <td className="border p-2">
                  <a
                    href={admission.statement}
                    className="text-blue-500 hover:underline"
                    download
                  >
                    Download
                  </a>
                </td>
                <td className="border p-2">
                  <a
                    href={admission.other}
                    className="text-blue-500 hover:underline"
                    download
                  >
                    Download
                  </a>
                </td>
                <td className="border p-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredAdmissions.length === 0 && (
              <tr>
                <td colSpan="7" className="border p-4 text-gray-500">
                  No admissions found for selected degree.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdmissionPage