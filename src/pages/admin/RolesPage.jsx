import { useState } from "react";
import { sampleRoles } from "./data/sampleRoles";
import EditRoleModal from "./EditRoleModal";
import { FaEdit } from "react-icons/fa";

function RolesPage() {
  const [roles, setRoles] = useState(sampleRoles);
  const [editingRole, setEditingRole] = useState(null);

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="bg-blue-600 text-white px-4 py-2 rounded-t">User Roles</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">#</th>
            <th className="p-2">Name</th>
            <th className="p-2">Edit</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-b">
              <td className="p-2">{role.id}</td>
              <td className="p-2">{role.name}</td>
              <td className="p-2">
                <button
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  onClick={() => setEditingRole(role)}
                >
                  <FaEdit /> Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingRole && (
        <EditRoleModal
          role={editingRole}
          onClose={() => setEditingRole(null)}
        />
      )}
    </div>
  );
}

export default RolesPage