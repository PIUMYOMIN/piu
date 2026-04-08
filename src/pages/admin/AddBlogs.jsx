import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import adminApi from "../../api/admin";

export default function BlogsForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    is_active: true,
    image: null,
  });
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let mounted = true;
    (async () => {
      try {
        const data = await adminApi.blogs.get(id);
        if (!mounted) return;
        setFormData({
          title: data?.title || "",
          description: data?.description || "",
          is_active: Boolean(data?.is_active),
          image: null,
        });
        setPreview(data?.image || "");
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load blog");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("is_active", formData.is_active ? "1" : "0");
      if (formData.image instanceof File) payload.append("image", formData.image);

      if (isEdit) {
        await adminApi.blogs.update(id, payload);
      } else {
        await adminApi.blogs.create(payload);
      }
      navigate("/piu/admin/blog-list");
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">{isEdit ? "Edit Blog Post" : "Create New Blog Post"}</h2>
      </div>
      <div className="p-6">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <ReactQuill value={formData.description} onChange={(v) => setFormData((p) => ({ ...p, description: v }))} className="h-48 mb-12" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setFormData((p) => ({ ...p, image: file }));
                setPreview(URL.createObjectURL(file));
              }}
            />
            {preview && <img src={preview} alt="preview" className="mt-3 h-28 w-44 object-cover rounded border" />}
          </div>
          <div>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData((p) => ({ ...p, is_active: e.target.checked }))}
              />
              Published
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate("/piu/admin/blog-list")} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
              {saving ? "Saving..." : isEdit ? "Update Blog" : "Create Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
