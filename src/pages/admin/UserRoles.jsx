import { useState, useEffect } from "react";
import EditRoleModal from "./EditRoleModal";
import { FaEdit, FaTrash, FaPlus, FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminApi } from "../../api/admin";
import { useAuth } from "../../contexts/AuthContext";

function RolesPage() {
  const { user: authUser } = useAuth();
  const currentRole = String(
    authUser?.role?.name ??
      authUser?.role ??
      (Array.isArray(authUser?.roles) ? authUser.roles[0]?.name || authUser.roles[0] : "")
  ).toLowerCase();
  const isAdmin = currentRole === "admin";
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch roles and permissions
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesData, permissionsData] = await Promise.all([
        adminApi.roles.list(),
        adminApi.permissions.list(),
      ]);

      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setPermissions(Array.isArray(permissionsData) ? permissionsData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      toast.error("Role name is required");
      return;
    }

    try {
      const response = await adminApi.roles.create({
        name: newRoleName,
        permissions: selectedPermissions.map(p => p.id || p)
      });
      
      setRoles([...roles, response]);
      setNewRoleName("");
      setSelectedPermissions([]);
      setIsAddModalOpen(false);
      toast.success("Role added successfully");
    } catch (error) {
      console.error("Error adding role:", error);
      toast.error(error.response?.data?.message || "Failed to add role");
    }
  };

  const handleUpdateRole = async (roleId, updatedData) => {
    try {
      const response = await adminApi.roles.update(roleId, updatedData);
      
      setRoles(roles.map(role => 
        role.id === roleId ? response : role
      ));
      setEditingRole(null);
      toast.success("Role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this role?")) {
      return;
    }

    try {
      await adminApi.roles.remove(roleId);
      setRoles(roles.filter(role => role.id !== roleId));
      toast.success("Role deleted successfully");
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error(error.response?.data?.message || "Failed to delete role");
    }
  };

  const togglePermissionSelection = (permission) => {
    const isSelected = selectedPermissions.some(p => 
      p.id === permission.id || p === permission.id
    );
    
    if (isSelected) {
      setSelectedPermissions(selectedPermissions.filter(p => 
        p.id !== permission.id && p !== permission.id
      ));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  const filteredRoles = roles.filter((r) =>
    String(r?.name || "").toLowerCase().includes(search.trim().toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / pageSize));
  const paginatedRoles = filteredRoles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-2xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">User Roles</h2>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search role..."
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Add New Role
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-left text-sm font-semibold text-gray-600">#</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Permissions</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No roles found
                </td>
              </tr>
            ) : (
              paginatedRoles.map((role, index) => (
                <tr key={role.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="p-3 font-medium">{role.name}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions?.map(permission => (
                        <span 
                          key={permission.id || permission}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {permission.name || permission}
                        </span>
                      )) || "No permissions"}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        onClick={() => setEditingRole(role)}
                      >
                        <FaEdit /> Edit
                      </button>
                      {isAdmin && (
                        <button
                          className="inline-flex items-center gap-2 text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredRoles.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <EditRoleModal
          role={editingRole}
          permissions={permissions}
          onClose={() => setEditingRole(null)}
          onUpdate={handleUpdateRole}
        />
      )}

      {/* Add Role Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Role</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Role Name</label>
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter role name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Permissions</label>
              <div className="border border-gray-300 rounded p-3 max-h-48 overflow-y-auto">
                {permissions.map(permission => (
                  <label key={permission.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.some(p => 
                        p.id === permission.id || p === permission.id
                      )}
                      onChange={() => togglePermissionSelection(permission)}
                      className="rounded"
                    />
                    <span className="text-sm">{permission.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewRoleName("");
                  setSelectedPermissions([]);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRole}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RolesPage;