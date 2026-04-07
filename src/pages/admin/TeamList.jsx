import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { toStorageUrl } from "../../utils/api";

const TeamList = () => {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [teamData, deptData] = await Promise.all([
        adminApi.teams.list(),
        adminApi.meta.departments(),
      ]);
      setTeams(Array.isArray(teamData) ? teamData : []);
      setDepartments(Array.isArray(deptData) ? deptData : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load team members");
      setTeams([]);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Toggle status
  const handleStatusChange = async (id) => {
    try {
      await adminApi.teams.toggleActive(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to update status");
    }
  };

  // Delete team
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    try {
      await adminApi.teams.remove(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete team member");
    }
  };

  // Filter teams based on search and filters
  const filteredTeams = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return teams.filter((team) => {
      const matchesSearch =
        !q ||
        String(team.name || "").toLowerCase().includes(q) ||
        String(team.email || "").toLowerCase().includes(q);

      const depId = team.department_id ?? team.department?.id;
      const matchesDepartment = departmentFilter === "all" || String(depId) === String(departmentFilter);

      const isActive = typeof team.is_active === "boolean" ? team.is_active : Boolean(team.status);
      const matchesStatus =
        statusFilter === "all" || (statusFilter === "active" && isActive) || (statusFilter === "inactive" && !isActive);

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [teams, searchTerm, departmentFilter, statusFilter]);

  const departmentOptions = useMemo(() => {
    return departments
      .map((d) => ({ id: String(d.id), name: d.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [departments]);

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <p className="text-blue-100 mt-1">Manage faculty and staff members</p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-40">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-building text-gray-400"></i>
                </div>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none"
                >
                  <option value="all">All Departments</option>
                  {departmentOptions.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
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
          
          <Link
            to="/piu/admin/add-team"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full lg:w-auto"
          >
            <i className="fas fa-user-plus mr-2"></i>
            Add Team Member
          </Link>
        </div>

        {/* Team Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
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
              {loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    Loading team members...
                  </td>
                </tr>
              )}

              {!loading &&
                filteredTeams.map((team) => {
                  const isActive = typeof team.is_active === "boolean" ? team.is_active : Boolean(team.status);
                  return (
                <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                  {/* Member Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={toStorageUrl(team.profile) || team.profile || "https://via.placeholder.com/80x80?text=PIU"}
                          alt={team.name}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80x80?text=PIU";
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {team.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {team.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Contact Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{team.phone}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {team.address}
                    </div>
                  </td>
                  
                  {/* Department */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {team.department?.name || `#${team.department_id ?? "—"}`}
                  </td>
                  
                  {/* Position */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {team.position?.name || `#${team.position_id ?? "—"}`}
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isActive}
                          onChange={() => handleStatusChange(team.id)}
                        />
                        <div className={`block w-14 h-7 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${isActive ? 'transform translate-x-7' : ''}`}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/piu/admin/add-team/edit/${team.id}`)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                        title="Edit team member"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(team.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                        title="Delete team member"
                      >
                        <i className="fas fa-trash-alt mr-1"></i>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                  );
                })}
            </tbody>
          </table>
          
          {/* Empty State */}
          {!loading && filteredTeams.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <i className="fas fa-users text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No team members found</h3>
              <p className="text-gray-500">
                {searchTerm || departmentFilter !== "all" || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Get started by adding your first team member"
                }
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredTeams.length} of {teams.length} team members
        </div>
      </div>
    </div>
  );
};

export default TeamList;