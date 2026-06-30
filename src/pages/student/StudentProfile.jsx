import React, { useEffect, useMemo, useState } from "react";
import {
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSave,
  FaSpinner,
  FaUser,
} from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { studentApi } from "../../api/student";
import { useAuth } from "../../contexts/AuthContext";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { STUDENT_TABS } from "../../utils/dashboardTabs";
import { resolveProfileImage, FALLBACK_AVATAR } from "../../utils/profileImage";
import { LoadingState } from "../../components/student/StudentUi";

const PROFILE_TABS = {
  PERSONAL: "personal",
  PASSWORD: "password",
};

function DetailItem({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900 break-words">{value || "-"}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

const inputClassName =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#002147] focus:outline-none focus:ring-2 focus:ring-blue-200";

export default function StudentProfile() {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError, Toast } = useFloatingToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab =
    searchParams.get("tab") === STUDENT_TABS.CHANGE_PASSWORD
      ? PROFILE_TABS.PASSWORD
      : PROFILE_TABS.PERSONAL;
  const [activeTab, setActiveTab] = useState(initialTab);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    email: "",
    phone: "",
    address: "",
    permanent_address: "",
    city: "",
    country: "",
    profile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      try {
        const nextUser = await refreshUser();
        if (!mounted || !nextUser) return;

        setProfileForm({
          email: nextUser.email || "",
          phone: nextUser.phone || "",
          address: nextUser.address || "",
          permanent_address: nextUser.permanent_address || "",
          city: nextUser.city || "",
          country: nextUser.country || "",
          profile: null,
        });
        setImagePreview(resolveProfileImage(nextUser, ""));
      } catch (e) {
        if (mounted) showError(getApiErrorMessage(e, "Failed to load profile"));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const tabFromUrl =
      searchParams.get("tab") === STUDENT_TABS.CHANGE_PASSWORD
        ? PROFILE_TABS.PASSWORD
        : PROFILE_TABS.PERSONAL;
    setActiveTab(tabFromUrl);
  }, [searchParams]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    const nextTab =
      tab === PROFILE_TABS.PASSWORD ? STUDENT_TABS.CHANGE_PASSWORD : STUDENT_TABS.PROFILE;
    setSearchParams({ tab: nextTab }, { replace: true });
  };

  const joinedAt = useMemo(() => {
    if (!user?.created_at) return "-";
    const date = new Date(user.created_at);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  }, [user?.created_at]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileForm((prev) => ({ ...prev, profile: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("email", profileForm.email);
      formData.append("phone", profileForm.phone);
      formData.append("address", profileForm.address);
      formData.append("permanent_address", profileForm.permanent_address);
      formData.append("city", profileForm.city);
      formData.append("country", profileForm.country);
      if (profileForm.profile) {
        formData.append("profile", profileForm.profile);
      }

      const response = await studentApi.updateProfile(formData);
      if (response?.user) {
        await refreshUser();
        setImagePreview(resolveProfileImage(response.user, imagePreview));
      } else {
        await refreshUser();
      }
      setProfileForm((prev) => ({ ...prev, profile: null }));
      showSuccess("Profile updated successfully.");
    } catch (err) {
      showError(getApiErrorMessage(err, "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.password !== passwordForm.password_confirmation) {
      showError("Passwords do not match");
      return;
    }

    if (passwordForm.password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    try {
      await studentApi.changePassword(passwordForm);
      showSuccess("Password changed successfully.");
      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (err) {
      showError(getApiErrorMessage(err, "Failed to change password"));
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <LoadingState label="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Toast />

      {/* Profile header */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#002147] to-[#0a3a72] px-6 py-8 sm:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              <img
                src={imagePreview || resolveProfileImage(user)}
                alt={user?.name || "Student"}
                className="h-28 w-28 rounded-full border-4 border-white/30 object-cover shadow-lg sm:h-32 sm:w-32"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_AVATAR;
                }}
              />
              <label
                htmlFor="student-profile-photo"
                className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#002147] shadow hover:bg-blue-50"
                title="Change photo"
              >
                <FaCamera className="text-sm" />
              </label>
              <input
                id="student-profile-photo"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-medium text-blue-100">Student Profile</p>
              <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                {user?.name || "Student"}
              </h1>
              <p className="mt-1 text-sm text-blue-100">{user?.email || "-"}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                  ID: {user?.student_id || "-"}
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                  {user?.program || "No program"}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    user?.is_active
                      ? "bg-green-500/20 text-green-100"
                      : "bg-amber-500/20 text-amber-100"
                  }`}
                >
                  {user?.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => switchTab(PROFILE_TABS.PERSONAL)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === PROFILE_TABS.PERSONAL
                ? "bg-[#002147] text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaUser />
            Personal Information
          </button>
          <button
            type="button"
            onClick={() => switchTab(PROFILE_TABS.PASSWORD)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === PROFILE_TABS.PASSWORD
                ? "bg-[#002147] text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaLock />
            Change Password
          </button>
        </div>
      </section>

      {activeTab === PROFILE_TABS.PERSONAL ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Read-only summary */}
          <div className="space-y-6">
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Academic Information</h2>
              <p className="mt-1 text-sm text-gray-500">Program details from your enrollment record.</p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailItem label="Student ID" value={user?.student_id} />
                <DetailItem label="Program" value={user?.program} />
                <DetailItem label="Department" value={user?.department} />
                <DetailItem label="Academic Year" value={user?.year} />
                <DetailItem label="Joined" value={joinedAt} />
                <DetailItem
                  label="Account Status"
                  value={user?.is_active ? "Active" : "Inactive"}
                />
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
              <p className="mt-1 text-sm text-gray-500">Information recorded on your student account.</p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailItem label="Full Name" value={user?.name} />
                <DetailItem label="Date of Birth" value={user?.dob} />
                <DetailItem label="Gender" value={user?.gender} />
                <DetailItem label="Marital Status" value={user?.marital_status} />
              </div>
            </section>
          </div>

          {/* Editable contact form */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:self-start">
            <h2 className="text-lg font-semibold text-gray-900">Contact & Address</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your contact details and profile photo, then save changes.
            </p>

            <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Email">
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className={inputClassName}
                    required
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="text"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className={inputClassName}
                  />
                </Field>
                <Field label="City">
                  <input
                    type="text"
                    name="city"
                    value={profileForm.city}
                    onChange={handleProfileChange}
                    className={inputClassName}
                  />
                </Field>
                <Field label="Country">
                  <input
                    type="text"
                    name="country"
                    value={profileForm.country}
                    onChange={handleProfileChange}
                    className={inputClassName}
                  />
                </Field>
              </div>

              <Field label="Current Address">
                <textarea
                  name="address"
                  value={profileForm.address}
                  onChange={handleProfileChange}
                  rows={3}
                  className={inputClassName}
                />
              </Field>

              <Field label="Permanent Address">
                <textarea
                  name="permanent_address"
                  value={profileForm.permanent_address}
                  onChange={handleProfileChange}
                  rows={3}
                  className={inputClassName}
                />
              </Field>

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  Profile photo changes are saved together with your contact details.
                </p>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#002147] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#003366] disabled:opacity-60 sm:w-auto"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : (
        <section className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
            <p className="mt-1 text-sm text-gray-500">
              Use a strong password with at least 6 characters.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <Field label="Current Password">
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="current_password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  className={`${inputClassName} pr-10`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </Field>

            <Field label="New Password">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={passwordForm.password}
                  onChange={handlePasswordChange}
                  className={`${inputClassName} pr-10`}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </Field>

            <Field label="Confirm New Password">
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={passwordForm.password_confirmation}
                  onChange={handlePasswordChange}
                  className={`${inputClassName} pr-10`}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </Field>

            <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              If you have not changed your password yet, the default may be{" "}
              <span className="font-semibold">piustudent</span>.
            </p>

            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-60 sm:w-auto"
            >
              {changingPassword ? <FaSpinner className="animate-spin" /> : <FaLock />}
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
