import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import adminApi from "../../api/admin";

export default function AddMOU() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingMou = location.state?.mou || null;
  const isEdit = Boolean(editingMou?.id);

  const [formData, setFormData] = useState({
    name: "",
    web_address: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editingMou) return;
    setFormData({
      name: editingMou.name || "",
      web_address: editingMou.web_address || "",
      description: editingMou.description || "",
      image: null,
    });
    setPreview(editingMou.image || "");
  }, [editingMou]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("web_address", formData.web_address);
      payload.append("description", formData.description);
      if (formData.image instanceof File) payload.append("image", formData.image);

      if (isEdit) {
        await adminApi.partners.update(editingMou.id, payload);
      } else {
        await adminApi.partners.create(payload);
      }
      navigate("/piu/admin/mou");
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || "Failed to save MOU");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">{isEdit ? "Edit MOU" : "Add New MOU"}</h2>
      </div>
      <div className="p-6">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              value={formData.web_address}
              onChange={(e) => setFormData((p) => ({ ...p, web_address: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <ReactQuill value={formData.description} onChange={(v) => setFormData((p) => ({ ...p, description: v }))} className="h-40 mb-12" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setFormData((p) => ({ ...p, image: f }));
                setPreview(URL.createObjectURL(f));
              }}
            />
            {preview && <img src={preview} alt="preview" className="mt-3 h-28 w-44 object-cover rounded border" />}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate("/piu/admin/mou")} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
              {saving ? "Saving..." : isEdit ? "Update MOU" : "Add MOU"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
