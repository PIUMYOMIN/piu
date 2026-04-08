import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../api/admin";

export default function ModuleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    module_code: "",
    credit: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    let mounted = true;
    async function loadOne() {
      setLoading(true);
      setError("");
      try {
        const data = await adminApi.modules.get(id);
        if (!mounted) return;
        setFormData({
          name: data?.name || "",
          module_code: data?.module_code || "",
          credit: data?.credit ?? "",
        });
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load module");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadOne();
    return () => {
      mounted = false;
    };
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: formData.name,
        module_code: formData.module_code,
        credit: Number(formData.credit),
      };
      if (isEdit) {
        await adminApi.modules.update(id, payload);
      } else {
        await adminApi.modules.create(payload);
      }
      navigate("/piu/admin/modules");
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to save module");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading module...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#002147]">{isEdit ? "Edit Module" : "Add Module"}</h2>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Module Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Module Code</label>
          <input
            type="text"
            name="module_code"
            value={formData.module_code}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Credit</label>
          <input
            type="number"
            name="credit"
            min="1"
            value={formData.credit}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="bg-[#002147] text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving..." : isEdit ? "Update Module" : "Add Module"}
          </button>
          <button type="button" onClick={() => navigate("/piu/admin/modules")} className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
