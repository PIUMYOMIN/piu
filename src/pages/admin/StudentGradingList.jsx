import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEye, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function StudentGradingList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const students = [
  { id: 1, name: "Lucifer Morningstar", studentId: "ST001", program: "ICT", year: "3rd", semester: "2nd" },
  { id: 2, name: "Chloe Decker", studentId: "ST002", program: "Business", year: "2nd", semester: "1st" },
  { id: 3, name: "Amenadiel", studentId: "ST003", program: "ICT", year: "4th", semester: "1st" },
  { id: 4, name: "Maze", studentId: "ST004", program: "Engineering", year: "1st", semester: "2nd" },
  { id: 5, name: "Linda Martin", studentId: "ST005", program: "Business", year: "3rd", semester: "2nd" },
  { id: 6, name: "Dan Espinoza", studentId: "ST006", program: "ICT", year: "2nd", semester: "2nd" },
  { id: 7, name: "Ella Lopez", studentId: "ST007", program: "Engineering", year: "4th", semester: "1st" },
  { id: 8, name: "Trixie Espinoza", studentId: "ST008", program: "Business", year: "1st", semester: "1st" },
  { id: 9, name: "Charlotte Richards", studentId: "ST009", program: "ICT", year: "3rd", semester: "1st" },
  { id: 10, name: "Dr. Louis", studentId: "ST010", program: "Business", year: "4th", semester: "2nd" },
  { id: 11, name: "Cain", studentId: "ST011", program: "Engineering", year: "2nd", semester: "1st" },
  { id: 12, name: "Eve", studentId: "ST012", program: "ICT", year: "1st", semester: "2nd" },
  { id: 13, name: "Azrael", studentId: "ST013", program: "Business", year: "3rd", semester: "2nd" },
  { id: 14, name: "Remiel", studentId: "ST014", program: "Engineering", year: "3rd", semester: "1st" },
  { id: 15, name: "Michael", studentId: "ST015", program: "ICT", year: "4th", semester: "2nd" },
  { id: 16, name: "Gabriel", studentId: "ST016", program: "Business", year: "2nd", semester: "2nd" },
  { id: 17, name: "Uriel", studentId: "ST017", program: "ICT", year: "1st", semester: "1st" },
  { id: 18, name: "Castiel", studentId: "ST018", program: "Engineering", year: "4th", semester: "2nd" },
  { id: 19, name: "Dean Winchester", studentId: "ST019", program: "Business", year: "3rd", semester: "1st" },
  { id: 20, name: "Sam Winchester", studentId: "ST020", program: "ICT", year: "2nd", semester: "1st" },
  { id: 21, name: "Crowley", studentId: "ST021", program: "Engineering", year: "1st", semester: "1st" },
  { id: 22, name: "Rowena MacLeod", studentId: "ST022", program: "Business", year: "4th", semester: "1st" },
  { id: 23, name: "Bobby Singer", studentId: "ST023", program: "ICT", year: "3rd", semester: "2nd" },
  { id: 24, name: "Chuck Shurley", studentId: "ST024", program: "Engineering", year: "2nd", semester: "2nd" },
  { id: 25, name: "Metatron", studentId: "ST025", program: "Business", year: "1st", semester: "2nd" },
  { id: 26, name: "Balthazar", studentId: "ST026", program: "ICT", year: "4th", semester: "1st" },
  { id: 27, name: "Abaddon", studentId: "ST027", program: "Engineering", year: "3rd", semester: "2nd" },
  { id: 28, name: "Meg Masters", studentId: "ST028", program: "Business", year: "2nd", semester: "1st" },
  { id: 29, name: "Jody Mills", studentId: "ST029", program: "ICT", year: "1st", semester: "2nd" },
  { id: 30, name: "Garth Fitzgerald IV", studentId: "ST030", program: "Engineering", year: "4th", semester: "1st" },
  { id: 31, name: "Jack Kline", studentId: "ST031", program: "Business", year: "3rd", semester: "1st" },
  { id: 32, name: "Amara", studentId: "ST032", program: "ICT", year: "2nd", semester: "2nd" },
  { id: 33, name: "Lucifer (SPN)", studentId: "ST033", program: "Engineering", year: "1st", semester: "1st" },
  { id: 34, name: "Gabriel (SPN)", studentId: "ST034", program: "Business", year: "4th", semester: "2nd" },
  { id: 35, name: "Asmodeus", studentId: "ST035", program: "ICT", year: "3rd", semester: "1st" },
];
  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort students
  const sortedStudents = React.useMemo(() => {
    let sortableItems = [...filteredStudents];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredStudents, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 opacity-50" />;
    if (sortConfig.direction === 'ascending') return <FaSortUp className="ml-1" />;
    return <FaSortDown className="ml-1" />;
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Page Header */}
      <div className="bg-[#002147] px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-white mb-2 md:mb-0">Student Grading</h2>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="p-6">
        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredStudents.length} of {students.length} students
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th 
                  className="p-3 font-semibold text-gray-700 border-b cursor-pointer"
                  onClick={() => requestSort('id')}
                >
                  <div className="flex items-center">
                    #
                    {getSortIcon('id')}
                  </div>
                </th>
                <th 
                  className="p-3 font-semibold text-gray-700 border-b cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Student Name
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="p-3 font-semibold text-gray-700 border-b cursor-pointer"
                  onClick={() => requestSort('studentId')}
                >
                  <div className="flex items-center">
                    Student ID
                    {getSortIcon('studentId')}
                  </div>
                </th>
                <th 
                  className="p-3 font-semibold text-gray-700 border-b cursor-pointer"
                  onClick={() => requestSort('program')}
                >
                  <div className="flex items-center">
                    Program
                    {getSortIcon('program')}
                  </div>
                </th>
                <th className="p-3 font-semibold text-gray-700 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.length > 0 ? (
                sortedStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-b">{idx + 1}</td>
                    <td className="p-3 border-b font-medium">{student.name}</td>
                    <td className="p-3 border-b text-gray-600">{student.studentId}</td>
                    <td className="p-3 border-b">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {student.program}
                      </span>
                    </td>
                    <td className="p-3 border-b text-center">
                      <button
                        onClick={() => navigate(`/piu/admin/students/${student.id}/grading`, { state: student })}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <FaEye className="mr-2" size={12} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500 border-b">
                    No students found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (optional) */}
        {filteredStudents.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing 1 to {filteredStudents.length} of {filteredStudents.length} results
            </div>
          </div>
        )}
      </div>
    </div>
  );
}