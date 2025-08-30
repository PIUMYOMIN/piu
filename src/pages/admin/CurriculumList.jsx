import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CurriculumList = () => {
  const navigate = useNavigate();

  const [curriculums, setCurriculums] = useState([
    {
      id: 1,
      title: "Introduction to Programming",
      description: "Basics of programming with Python",
      course: "Bachelor of Computer Science",
      year: "1",
      semester: "1",
      moduleCode: "CS101",
      credits: "3",
      hours: "45",
      status: "active"
    },
    {
      id: 2,
      title: "Advanced Marketing",
      description: "Marketing strategies and case studies",
      course: "Master of Business Administration",
      year: "2",
      semester: "2",
      moduleCode: "MBA202",
      credits: "4",
      hours: "60",
      status: "active"
    },
    {
      id: 3,
      title: "Calculus I",
      description: "Fundamental concepts of differential calculus",
      course: "Bachelor of Engineering",
      year: "1",
      semester: "1",
      moduleCode: "MATH101",
      credits: "4",
      hours: "60",
      status: "inactive"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this curriculum?")) {
      setCurriculums(curriculums.filter((cur) => cur.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setCurriculums(curriculums.map(cur => 
      cur.id === id 
        ? { ...cur, status: cur.status === "active" ? "inactive" : "active" } 
        : cur
    ));
  };

  // Filter curriculums based on search and filters
  const filteredCurriculums = curriculums.filter(curriculum => {
    const matchesSearch = curriculum.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          curriculum.moduleCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === "all" || curriculum.course === courseFilter;
    const matchesYear = yearFilter === "all" || curriculum.year === yearFilter;
    const matchesStatus = statusFilter === "all" || curriculum.status === statusFilter;
    
    return matchesSearch && matchesCourse && matchesYear && matchesStatus;
  });

  // Get unique courses for filter
  const courses = [...new Set(curriculums.map(curriculum => curriculum.course))];
  // Get unique years for filter
  const years = [...new Set(curriculums.map(curriculum => curriculum.year))];

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">Curriculum Management</h2>
        <p className="text-blue-100 mt-1">Manage academic curricula and course offerings</p>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search curricula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-graduation-cap text-gray-400"></i>
                </div>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none"
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
              
              <div className="relative w-full sm:w-32">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-calendar-alt text-gray-400"></i>
                </div>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none"
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>Year {year}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
              
              <div className="relative w-full sm:w-40">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-user-check text-gray-400"></i>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate("/piu/admin/add-curriculum")}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full lg:w-auto"
          >
            <i className="fas fa-plus-circle mr-2"></i>
            New Curriculum
          </button>
        </div>

        {/* Curriculum Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course & Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCurriculums.map((curriculum) => (
                <tr key={curriculum.id} className="hover:bg-gray-50 transition-colors">
                  {/* Module Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {curriculum.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {curriculum.moduleCode}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {curriculum.description}
                      </div>
                    </div>
                  </td>
                  
                  {/* Course & Year */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{curriculum.course}</div>
                    <div className="text-sm text-gray-500">
                      Year {curriculum.year} • Semester {curriculum.semester}
                    </div>
                  </td>
                  
                  {/* Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{curriculum.credits}</span> Credits
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{curriculum.hours}</span> Hours
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(curriculum.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        curriculum.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {curriculum.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/piu/admin/add-curriculum/edit/${curriculum.id}`, { state: curriculum })}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                        title="Edit curriculum"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(curriculum.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                        title="Delete curriculum"
                      >
                        <i className="fas fa-trash-alt mr-1"></i>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State */}
          {filteredCurriculums.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <i className="fas fa-book-open text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No curricula found</h3>
              <p className="text-gray-500">
                {searchTerm || courseFilter !== "all" || yearFilter !== "all" || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Get started by adding your first curriculum"
                }
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredCurriculums.length} of {curriculums.length} curricula
        </div>
      </div>
    </div>
  );
};

export default CurriculumList;