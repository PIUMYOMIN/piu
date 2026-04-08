import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v2 } from "../../utils/api";

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  bio: "",
  profile_image: null,
};

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await v2.getProfile();
        const userData = data?.user || data || {};
        if (!mounted) return;

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          city: userData.city || "",
          country: userData.country || "",
          bio: userData.bio || "",
          profile_image: null,
        });
        setImagePreview(userData.profile_image || userData.profile || "");
      } catch (error) {
        if (!mounted) return;
        toast.error("Failed to load your profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, profile_image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("address", formData.address);
      payload.append("city", formData.city);
      payload.append("country", formData.country);
      payload.append("bio", formData.bio);
      if (formData.profile_image instanceof File) {
        payload.append("profile_image", formData.profile_image);
      }

      await v2.updateProfile(payload);
      toast.success("Profile updated successfully.");
      setFormData((prev) => ({ ...prev, profile_image: null }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <ToastContainer position="top-right" autoClose={2500} />
      <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
      <p className="mt-1 text-sm text-gray-500">Update your account information.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="flex items-center gap-4">
          <img
            src={
              imagePreview ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
            }
            alt="User profile"
            className="h-20 w-20 rounded-full border object-cover"
          />
          <label className="cursor-pointer rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Change Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" className="rounded-md border border-gray-300 px-3 py-2 focus:border-green-700 focus:outline-none" />
          <input name="email" value={formData.email} onChange={handleChange} required type="email" placeholder="Email" className="rounded-md border border-gray-300 px-3 py-2 focus:border-green-700 focus:outline-none" />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="rounded-md border border-gray-300 px-3 py-2 focus:border-green-700 focus:outline-none" />
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="rounded-md border border-gray-300 px-3 py-2 focus:border-green-700 focus:outline-none" />
          <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="rounded-md border border-gray-300 px-3 py-2 focus:border-green-700 focus:outline-none" />
          <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="rounded-md border border-gray-300 px-3 py-2 focus:border-green-700 focus:outline-none" />
        </div>

        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          placeholder="Short bio"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-700 focus:outline-none"
        />

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
