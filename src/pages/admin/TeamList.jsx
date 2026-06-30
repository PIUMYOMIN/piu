import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { toStorageUrl } from "../../utils/api";
import { ADMIN_TABS, buildDashboardPath } from "../../utils/dashboardTabs";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { useConfirmDelete } from "../../contexts/ConfirmContext";
import { getApiErrorMessage } from "../../utils/apiErrors";
import ManagementFilters from "../../components/admin/ManagementFilters";

function normalizeTeamActive(team) {
  if (typeof team?.is_active === "boolean") return team.is_active;
  if (team?.is_active === 1 || team?.is_active === "1") return true;
  if (team?.is_active === 0 || team?.is_active === "0") return false;
  return Boolean(team?.status);
}

const TeamList = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, Toast } = useFloatingToast();
  const confirmDeleteAction = useConfirmDelete();

  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState(null);

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
      showError(getApiErrorMessage(e, "Failed to load team members"));
      setTeams([]);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (team) => {
    if (togglingId === team.id) return;

    setTogglingId(team.id);
    const wasActive = normalizeTeamActive(team);

    try {
      const response = await adminApi.teams.toggleActive(team.id);
      const updatedTeam = response?.data ?? response;
      const nextActive =
        typeof updatedTeam?.is_active === "boolean"
          ? updatedTeam.is_active
          : !wasActive;

      setTeams((prev) =>
        prev.map((item) =>
          item.id === team.id ? { ...item, ...updatedTeam, is_active: nextActive } : item
        )
      );

      showSuccess(`${team.name} ${nextActive ? "activated" : "deactivated"} successfully!`);
    } catch (e) {
      showError(getApiErrorMessage(e, "Failed to update team status."));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (team) => {
    const ok = await confirmDeleteAction({ itemName: team.name, itemType: "team member" });
    if (!ok) return;
    try {
      await adminApi.teams.remove(team.id);
      setTeams((prev) => prev.filter((item) => item.id !== team.id));
      showSuccess(`"${team.name}" deleted successfully!`);
    } catch (e) {
      showError(getApiErrorMessage(e, "Failed to delete team member."));
    }
  };

  const filteredTeams = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return teams.filter((team) => {
      const matchesSearch =
        !q ||
        String(team.name || "").toLowerCase().includes(q) ||
        String(team.email || "").toLowerCase().includes(q);

      const depId = team.department_id ?? team.department?.id;
      const matchesDepartment = departmentFilter === "all" || String(depId) === String(departmentFilter);

      const isActive = normalizeTeamActive(team);
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

  const resetFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <Toast />
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

        <ManagementFilters
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search team members..."
          filters={[
            {
              key: "department",
              value: departmentFilter,
              onChange: setDepartmentFilter,
              options: [
                { value: "all", label: "All Departments" },
                ...departmentOptions.map((dept) => ({ value: dept.id, label: dept.name })),
              ],
            },
          ]}
          showStatus
          statusValue={statusFilter}
          onStatusChange={setStatusFilter}
          onReset={resetFilters}
          actions={
            <Link
              to={buildDashboardPath("/piu/admin/add-team", ADMIN_TABS.ADD_TEAM)}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full lg:w-auto"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Add Team Member
            </Link>
          }
        />

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
                  const isActive = normalizeTeamActive(team);
                  const isToggling = togglingId === team.id;
                  return (
                <tr key={team.id} className="hover:bg-gray-50 transition-colors">
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
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{team.phone}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {team.address}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {team.department?.name || `#${team.department_id ?? "—"}`}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {team.position?.name || `#${team.position_id ?? "—"}`}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className={`flex items-center ${isToggling ? "opacity-60 cursor-wait" : "cursor-pointer"}`}>
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isActive}
                          disabled={isToggling}
                          onChange={() => handleStatusChange(team)}
                        />
                        <div className={`block w-14 h-7 rounded-full transition-colors ${isActive ? "bg-blue-600" : "bg-gray-300"}`}></div>
                        <div
                          className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${
                            isActive ? "transform translate-x-7" : ""
                          }`}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {isToggling ? "Updating..." : isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          navigate(
                            buildDashboardPath(`/piu/admin/add-team/edit/${team.id}`, ADMIN_TABS.ADD_TEAM)
                          )
                        }
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                        title="Edit team member"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(team)}
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

        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredTeams.length} of {teams.length} team members
        </div>
      </div>
    </div>
  );
};

export default TeamList;
