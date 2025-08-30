import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CampusList() {
  const navigate = useNavigate();
  
  const [campuses, setCampuses] = useState([
    {
      id: 1,
      name: "Main Campus",
      location: "Yangon, Myanmar",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      status: "active",
      students: 2500,
      established: "2010"
    },
    {
      id: 2,
      name: "Branch Campus",
      location: "Mandalay, Myanmar",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      status: "active",
      students: 1200,
      established: "2015"
    },
    {
      id: 3,
      name: "New City Campus",
      location: "Naypyidaw, Myanmar",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
      status: "under-construction",
      students: 0,
      established: "2024"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this campus?")) {
      setCampuses(campuses.filter(campus => campus.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setCampuses(campuses.map(campus => 
      campus.id === id 
        ? { ...campus, status: campus.status === "active" ? "inactive" : "active" } 
        : campus
    ));
  };

  // Filter campuses based on search and filters
  const filteredCampuses = campuses.filter(campus => {
    const matchesSearch = campus.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          campus.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campus.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">Campus Management</h2>
        <p className="text-blue-100 mt-1">Manage all campus locations and information</p>
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
                placeholder="Search campuses..."
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
                <option value="under-construction">Under Construction</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <i className="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
          
          <Link
            to="/piu/admin/campus/new"
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full sm:w-auto"
          >
            <i className="fas fa-plus-circle mr-2"></i>
            Add Campus
          </Link>
        </div>

        {/* Campus Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
              {filteredCampuses.map((campus) => (
                <tr key={campus.id} className="hover:bg-gray-50 transition-colors">
                  {/* Campus Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={campus.image}
                          alt={campus.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {campus.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Est. {campus.established}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Location */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{campus.location}</div>
                  </td>
                  
                  {/* Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{campus.students.toLocaleString()}</span> students
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      campus.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : campus.status === "under-construction"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {campus.status === "active" 
                        ? "Active" 
                        : campus.status === "under-construction"
                        ? "Under Construction"
                        : "Inactive"
                      }
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleStatus(campus.id)}
                        className={`text-xs px-3 py-1 rounded ${
                          campus.status === "active"
                            ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                            : "text-green-700 bg-green-100 hover:bg-green-200"
                        }`}
                      >
                        {campus.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <Link
                        to={`/piu/admin/campus/${campus.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                        title="Edit campus"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(campus.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                        title="Delete campus"
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
          {filteredCampuses.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <i className="fas fa-school text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No campuses found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Get started by adding your first campus"
                }
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredCampuses.length} of {campuses.length} campuses
        </div>
      </div>
    </div>
  );
}

export default CampusList;