import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import adminApi from "../../api/admin";

export default function AddDepartment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const editingDepartment = location.state || null;
  const isEdit = Boolean(editingDepartment || id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingDepartment) {
      setFormData({
        name: editingDepartment.name || "",
        description: editingDepartment.description || "",
      });
      return;
    }
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const data = await adminApi.departments.get(id);
        if (!mounted) return;
        setFormData({
          name: data?.name || "",
          description: data?.description || "",
        });
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load department");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [editingDepartment, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (isEdit) {
        await adminApi.departments.update(editingDepartment?.id || id, formData);
      } else {
        await adminApi.departments.create(formData);
      }
      navigate("/piu/admin/departments");
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to save department");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">{isEdit ? "Edit Department" : "Add New Department"}</h2>
      </div>

      <div className="p-6">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Department Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate("/piu/admin/departments")} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
              {submitting ? "Saving..." : isEdit ? "Update Department" : "Add Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
