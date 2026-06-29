import React, { useEffect, useState } from "react";
import { FaCamera, FaSave, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { v2 } from "../../utils/api";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";
import ProfileAvatar from "../../components/common/ProfileAvatar";
import { resolveProfileImage } from "../../utils/profileImage";

export default function TeacherProfile() {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError, Toast } = useFloatingToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    profile_image: null,
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await v2.getProfile();
        const profile = data?.user || data;
        if (!mounted) return;
        setForm({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          bio: profile.bio || "",
          profile_image: null,
        });
        setImagePreview(resolveProfileImage(profile, ""));
      } catch (e) {
        showError(getApiErrorMessage(e, "Failed to load profile"));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, profile_image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = new FormData();
      body.append("name", form.name);
      body.append("email", form.email);
      body.append("phone", form.phone || "");
      body.append("bio", form.bio || "");
      if (form.profile_image instanceof File) {
        body.append("profile_image", form.profile_image);
      }
      await v2.updateProfile(body);
      await refreshUser();
      setForm((prev) => ({ ...prev, profile_image: null }));
      showSuccess("Profile updated successfully.");
    } catch (err) {
      showError(getApiErrorMessage(err, "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = String(
    user?.role ?? (Array.isArray(user?.roles) ? user.roles[0] : "teacher")
  ).toUpperCase();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-xl border border-gray-100 bg-white shadow-sm">
      <Toast />
      <div className="rounded-t-xl bg-gradient-to-r from-[#002147] to-[#003366] p-6 text-white">
        <h1 className="text-2xl font-bold">Teacher Profile</h1>
        <p className="mt-1 text-sm text-blue-100">Update your account details and profile photo</p>
      </div>

      <form onSubmit={save} className="space-y-6 p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile preview"
                className="h-24 w-24 rounded-full border-4 border-blue-100 object-cover"
              />
            ) : (
              <ProfileAvatar user={user} size="lg" />
            )}
            <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow hover:bg-blue-700">
              <FaCamera size={14} />
              <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </label>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium text-gray-900">{roleLabel}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              rows={3}
              value={form.bio}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
