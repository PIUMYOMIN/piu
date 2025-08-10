import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { samplePermissions } from "./data/samplePermissions";
import { sampleRoles } from "./data/sampleRoles";


function PermissionsPage() {
  const [permissions, setPermissions] = useState(samplePermissions);
  const [roles, setRoles] = useState(sampleRoles);

  const [editingPerm, setEditingPerm] = useState(null); // { id, name }
  const [assignedRoleIds, setAssignedRoleIds] = useState([]); // role ids that have the editing permission

  // Open modal: compute which roles currently contain this permission
  const openEdit = (perm) => {
    const assigned = roles.filter((r) => r.permissions.includes(perm.id)).map((r) => r.id);
    setEditingPerm(perm);
    setAssignedRoleIds(assigned);
  };

  const closeModal = () => {
    setEditingPerm(null);
    setAssignedRoleIds([]);
  };

  // Toggle role assignment in the modal
  const toggleRoleAssignment = (roleId) => {
    setAssignedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  // Save changes: update roles' permissions locally
  const saveChanges = () => {
    if (!editingPerm) return;

    const permId = editingPerm.id;

    const newRoles = roles.map((r) => {
      const has = assignedRoleIds.includes(r.id);
      if (has && !r.permissions.includes(permId)) {
        // add permission id
        return { ...r, permissions: [...r.permissions, permId] };
      }
      if (!has && r.permissions.includes(permId)) {
        // remove permission id
        return { ...r, permissions: r.permissions.filter((p) => p !== permId) };
      }
      return r;
    });

    setRoles(newRoles);

    console.log("Saved permission assignments for", editingPerm.name, "=>", assignedRoleIds);

    closeModal();
  };

  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <h2 className="text-xl font-bold mb-4 bg-[#002147] text-white p-3 rounded">
        All Permissions
      </h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-200">#</th>
              <th className="px-4 py-2 border border-gray-200">Name</th>
              <th className="px-4 py-2 border border-gray-200">Edit</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm) => (
              <tr key={perm.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-200">{perm.id}</td>
                <td className="px-4 py-2 border border-gray-200">{perm.name}</td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  <button
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    onClick={() => openEdit(perm)}
                  >
                    <FaEdit /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Permission Modal */}
      {editingPerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded shadow-lg w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Permission</h3>

            {/* Permission name (editable) */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Permission Name</label>
              <input
                type="text"
                value={editingPerm.name}
                onChange={(e) =>
                  setEditingPerm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#002147]"
              />
            </div>

            {/* Roles list with checkboxes */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Assign to Roles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                {roles.map((r) => (
                  <label key={r.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={assignedRoleIds.includes(r.id)}
                      onChange={() => toggleRoleAssignment(r.id)}
                    />
                    <span>{r.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-3 py-1 bg-[#002147] text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PermissionsPage