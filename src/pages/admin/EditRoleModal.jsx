import { useState, useEffect } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";

function EditRoleModal({ role, permissions, onClose, onUpdate }) {
  const [roleName, setRoleName] = useState(role.name || "");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize selected permissions from role
    if (role.permissions) {
      const permIds = role.permissions.map(p => p.id || p);
      setSelectedPermissions(permIds);
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!roleName.trim()) {
      alert("Role name is required");
      return;
    }

    setLoading(true);
    
    try {
      await onUpdate(role.id, {
        name: roleName,
        permissions: selectedPermissions
      });
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permissionId) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Role: {role.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Role Name</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Permissions</label>
            <div className="border border-gray-300 rounded p-3 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {permissions.map(permission => (
                  <label key={permission.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{permission.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
              disabled={loading}
            >
              {loading && <FaSpinner className="animate-spin" />}
              Update Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRoleModal;