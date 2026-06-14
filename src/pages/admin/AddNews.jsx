import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import adminApi from "../../api/admin";
import { toStorageUrl } from "../../utils/api";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";

export default function NewsForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { showSuccess, showError, Toast } = useFloatingToast();

  const [formData, setFormData] = useState({
    title: "",
    body: "",
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
        const data = await adminApi.news.get(id);
        if (!mounted) return;
        setFormData({
          title: data?.title || "",
          body: data?.body || "",
          is_active: Boolean(data?.is_active),
          image: null,
        });
        setPreview(toStorageUrl(data?.image) || data?.image || "");
      } catch (e) {
        if (!mounted) return;
        setError(getApiErrorMessage(e, "Failed to load news"));
        showError(getApiErrorMessage(e, "Failed to load news"));
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
      payload.append("body", formData.body);
      payload.append("is_active", formData.is_active ? "1" : "0");
      if (formData.image instanceof File) payload.append("image", formData.image);

      if (isEdit) {
        await adminApi.news.update(id, payload);
        showSuccess("News updated successfully!");
      } else {
        await adminApi.news.create(payload);
        showSuccess("News created successfully!");
      }
      setTimeout(() => {
        navigate("/piu/admin/news");
      }, 1200);
    } catch (e) {
      setError(getApiErrorMessage(e, "Failed to save news"));
      showError(getApiErrorMessage(e, "Failed to save news"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <Toast />
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">{isEdit ? "Edit News Article" : "Create News Article"}</h2>
        <p className="text-blue-100 mt-1">
          {isEdit ? "Update the news article details below" : "Write a new news article for your institution"}
        </p>
      </div>
      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
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
            <label className="block text-sm font-medium mb-1">Content</label>
            <ReactQuill
              value={formData.body}
              onChange={(v) => setFormData((p) => ({ ...p, body: v }))}
              className="h-48 mb-12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Featured Image</label>
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
            {preview && (
              <img src={preview} alt="preview" className="mt-3 h-28 w-44 object-cover rounded border" />
            )}
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
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/piu/admin/news")}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-60"
            >
              {saving ? "Saving..." : isEdit ? "Update News" : "Create News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
