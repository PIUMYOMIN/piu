import React from "react";
import { FALLBACK_AVATAR, getInitials, resolveProfileImage } from "../../utils/profileImage";

export default function ProfileAvatar({ user, size = "md", className = "" }) {
  const src = resolveProfileImage(user);
  const sizeClass =
    size === "lg" ? "h-24 w-24" : size === "sm" ? "h-10 w-10" : "h-16 w-16";

  return (
    <img
      src={src}
      alt={user?.name || "Profile"}
      title={user?.name || "Profile"}
      className={`rounded-full border-2 border-blue-100 object-cover bg-gray-100 ${sizeClass} ${className}`}
      onError={(e) => {
        e.currentTarget.src = FALLBACK_AVATAR;
      }}
    />
  );
}

export function ProfileAvatarWithFallback({ user, size = "md", className = "" }) {
  const src = resolveProfileImage(user, "");
  const sizeClass =
    size === "lg" ? "h-24 w-24 text-2xl" : size === "sm" ? "h-10 w-10 text-sm" : "h-16 w-16 text-lg";

  if (!src) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 ${sizeClass} ${className}`}
      >
        {getInitials(user?.name)}
      </div>
    );
  }

  return <ProfileAvatar user={user} size={size} className={className} />;
}
