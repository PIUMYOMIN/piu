import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { FaEdit, FaTrash, FaPlus, FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PermissionsPage() {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPerm, setEditingPerm] = useState(null);
  const [assignedRoleIds, setAssignedRoleIds] = useState([]);
  const [permissionName, setPermissionName] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPermissionName, setNewPermissionName] = useState("");

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [permissionsRes, rolesRes] = await Promise.all([
        api.get("/api/v2/permissions"),
        api.get("/api/v2/roles")
      ]);
      
      setPermissions(permissionsRes.data);
      setRoles(rolesRes.data.data || rolesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (perm) => {
    // Find roles that have this permission
    const assignedRoles = roles.filter(role => 
      role.permissions?.some(p => p.id === perm.id || p === perm.id)
    ).map(role => role.id);
    
    setEditingPerm(perm);
    setPermissionName(perm.name);
    setAssignedRoleIds(assignedRoles);
  };

  const closeModal = () => {
    setEditingPerm(null);
    setPermissionName("");
    setAssignedRoleIds([]);
  };

  const toggleRoleAssignment = (roleId) => {
    setAssignedRoleIds(prev =>
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId) 
        : [...prev, roleId]
    );
  };

  const saveChanges = async () => {
    if (!editingPerm || !permissionName.trim()) {
      toast.error("Permission name is required");
      return;
    }

    try {
      // Update permission name
      if (editingPerm.name !== permissionName) {
        await api.put(`/api/v2/permissions/${editingPerm.id}`, {
          name: permissionName
        });
      }

      // Update role permissions
      await Promise.all(
        roles.map(async (role) => {
          const shouldHave = assignedRoleIds.includes(role.id);
          const currentlyHas = role.permissions?.some(p => 
            p.id === editingPerm.id || p === editingPerm.id
          );

          if (shouldHave !== currentlyHas) {
            const currentPerms = role.permissions?.map(p => p.id || p) || [];
            const newPerms = shouldHave
              ? [...currentPerms, editingPerm.id]
              : currentPerms.filter(id => id !== editingPerm.id);

            await api.put(`/api/v2/roles/${role.id}`, {
              name: role.name,
              permissions: newPerms
            });
          }
        })
      );

      // Refresh data
      await fetchData();
      closeModal();
      toast.success("Permission updated successfully");
    } catch (error) {
      console.error("Error updating permission:", error);
      toast.error(error.response?.data?.message || "Failed to update permission");
    }
  };

  const handleAddPermission = async () => {
    if (!newPermissionName.trim()) {
      toast.error("Permission name is required");
      return;
    }

    try {
      await api.post("/api/v2/permissions", {
        name: newPermissionName
      });
      
      await fetchData();
      setNewPermissionName("");
      setIsAddModalOpen(false);
      toast.success("Permission added successfully");
    } catch (error) {
      console.error("Error adding permission:", error);
      toast.error(error.response?.data?.message || "Failed to add permission");
    }
  };

  const handleDeletePermission = async (permissionId) => {
    if (!window.confirm("Are you sure you want to delete this permission?")) {
      return;
    }

    try {
      await api.delete(`/api/v2/permissions/${permissionId}`);
      setPermissions(permissions.filter(p => p.id !== permissionId));
      toast.success("Permission deleted successfully");
    } catch (error) {
      console.error("Error deleting permission:", error);
      toast.error(error.response?.data?.message || "Failed to delete permission");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-2xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">All Permissions</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add New Permission
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 border border-gray-200 text-left text-sm font-semibold text-gray-600">#</th>
              <th className="px-4 py-3 border border-gray-200 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 border border-gray-200 text-left text-sm font-semibold text-gray-600">Assigned to Roles</th>
              <th className="px-4 py-3 border border-gray-200 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {permissions.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  No permissions found
                </td>
              </tr>
            ) : (
              permissions.map((perm, index) => {
                const assignedRoles = roles.filter(role => 
                  role.permissions?.some(p => p.id === perm.id || p === perm.id)
                ).map(role => role.name);

                return (
                  <tr key={perm.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                    <td className="px-4 py-3 border border-gray-200 font-medium">{perm.name}</td>
                    <td className="px-4 py-3 border border-gray-200">
                      <div className="flex flex-wrap gap-1">
                        {assignedRoles.length > 0 ? (
                          assignedRoles.map(roleName => (
                            <span 
                              key={roleName}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                            >
                              {roleName}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">Not assigned to any role</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <div className="flex gap-3">
                        <button
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          onClick={() => openEdit(perm)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="inline-flex items-center gap-2 text-red-600 hover:text-red-800"
                          onClick={() => handleDeletePermission(perm.id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Permission Modal */}
      {editingPerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Permission</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Permission Name</label>
              <input
                type="text"
                value={permissionName}
                onChange={(e) => setPermissionName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Assign to Roles</h4>
              <div className="border border-gray-300 rounded p-3 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => (
                    <label key={role.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={assignedRoleIds.includes(role.id)}
                        onChange={() => toggleRoleAssignment(role.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{role.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Permission Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Permission</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Permission Name</label>
              <input
                type="text"
                value={newPermissionName}
                onChange={(e) => setNewPermissionName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter permission name (e.g., users.create)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use dot notation: resource.action (e.g., users.create, roles.view)
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewPermissionName("");
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPermission}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Permission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PermissionsPage;