const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";

export function resolveProfileImage(userOrStudent, fallback = FALLBACK_AVATAR) {
  if (!userOrStudent) return fallback;

  const candidates = [
    userOrStudent.profile_image,
    userOrStudent.profile,
    userOrStudent.picture,
    userOrStudent.avatar,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return fallback;
}

export function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.[0] || "U";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export { FALLBACK_AVATAR };
