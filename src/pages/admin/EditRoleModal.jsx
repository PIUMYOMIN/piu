import { useState } from "react";
import { samplePermissions } from "./data/samplePermissions";

function EditRoleModal({ role, onClose }) {
  const [roleName, setRoleName] = useState(role.name);
  const [rolePermissions, setRolePermissions] = useState(role.permissions);

  const togglePermission = (permId) => {
    setRolePermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  const saveChanges = () => {
    console.log("Saving:", roleName, rolePermissions);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Edit Role</h3>

        <input
          type="text"
          className="border p-2 w-full mb-4 rounded"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Permissions</h4>
          {samplePermissions.map((perm) => (
            <label key={perm.id} className="block">
              <input
                type="checkbox"
                checked={rolePermissions.includes(perm.id)}
                onChange={() => togglePermission(perm.id)}
              />{" "}
              {perm.name}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={saveChanges}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditRoleModal