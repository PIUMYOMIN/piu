import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DepartmentList = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([
    { 
      id: 1, 
      name: "Computer Science", 
      code: "CS",
      description: "Focus on programming, algorithms, and software development",
      status: "active",
      students: 250,
      courses: 18
    },
    { 
      id: 2, 
      name: "Business Administration", 
      code: "BA",
      description: "Business management, finance, and leadership studies",
      status: "active",
      students: 180,
      courses: 15
    },
    { 
      id: 3, 
      name: "Electrical Engineering", 
      code: "EE",
      description: "Circuit design, power systems, and electronics",
      status: "inactive",
      students: 120,
      courses: 12
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setDepartments(departments.filter((dept) => dept.id !== id));
    }
  };

  const handleEdit = (dept) => {
    navigate(`/piu/admin/departments/edit/${dept.id}`, { state: dept });
  };

  const toggleStatus = (id) => {
    setDepartments(departments.map(dept => 
      dept.id === id 
        ? { ...dept, status: dept.status === "active" ? "inactive" : "active" } 
        : dept
    ));
  };

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dept.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">Department Management</h2>
        <p className="text-blue-100 mt-1">Manage academic departments and programs</p>
      </div>

      <div className="p-6">
        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div className="relative w-full sm:w-40">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-filter text-gray-400"></i>
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
          
          <Link
            to="/piu/admin/departments/new"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full sm:w-auto"
          >
            <i className="fas fa-plus-circle mr-2"></i>
            Add Department
          </Link>
        </div>

        {/* Departments Grid */}
        {filteredDepartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept) => (
              <div key={dept.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-500">{dept.code}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        dept.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {dept.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-3 mb-4 line-clamp-2">
                    {dept.description}
                  </p>
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-4">
                    <div className="flex items-center">
                      <i className="fas fa-user-graduate mr-1"></i>
                      <span>{dept.students} Students</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-book mr-1"></i>
                      <span>{dept.courses} Courses</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => toggleStatus(dept.id)}
                    className={`text-xs px-3 py-1 rounded ${
                      dept.status === "active"
                        ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                        : "text-green-700 bg-green-100 hover:bg-green-200"
                    }`}
                  >
                    {dept.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded text-sm bg-blue-50 hover:bg-blue-100 transition-colors"
                      title="Edit department"
                    >
                      <i className="fas fa-edit mr-1"></i>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 rounded text-sm bg-red-50 hover:bg-red-100 transition-colors"
                      title="Delete department"
                    >
                      <i className="fas fa-trash-alt mr-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <i className="fas fa-building text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No departments found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first department"
              }
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredDepartments.length} of {departments.length} departments
        </div>
      </div>
    </div>
  );
};

export default DepartmentList;