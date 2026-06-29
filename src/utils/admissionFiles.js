export const ADMISSION_MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB — matches backend max:5120

export const ADMISSION_FILE_RULES = {
  profile: {
    label: "Profile picture",
    accept: ".jpg,.jpeg,.png",
    mimeTypes: ["image/jpeg", "image/png"],
    extensions: ["jpg", "jpeg", "png"],
    required: true,
  },
  personal_statement: {
    label: "Personal statement",
    accept: ".pdf,.doc,.docx",
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    extensions: ["pdf", "doc", "docx"],
    required: true,
  },
  education_certificate: {
    label: "Education certificate",
    accept: ".pdf,.doc,.docx",
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    extensions: ["pdf", "doc", "docx"],
    required: true,
  },
  language_proficiency: {
    label: "Language proficiency document",
    accept: ".pdf,.doc,.docx",
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    extensions: ["pdf", "doc", "docx"],
    required: false,
  },
  other_document: {
    label: "Other document",
    accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ],
    extensions: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
    required: false,
  },
};

export function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileExtension(name) {
  const parts = String(name || "").toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() : "";
}

export function validateAdmissionFile(field, file) {
  const rule = ADMISSION_FILE_RULES[field];
  if (!rule) return null;
  if (!file) {
    return rule.required ? `${rule.label} is required.` : null;
  }

  if (!(file instanceof File)) {
    return `${rule.label} must be a file.`;
  }

  if (file.size > ADMISSION_MAX_FILE_BYTES) {
    return `${rule.label} must be ${formatFileSize(ADMISSION_MAX_FILE_BYTES)} or smaller (selected: ${formatFileSize(file.size)}).`;
  }

  const ext = fileExtension(file.name);
  const mimeOk = rule.mimeTypes.includes(file.type);
  const extOk = rule.extensions.includes(ext);

  if (!mimeOk && !extOk) {
    return `${rule.label} must be one of: ${rule.extensions.join(", ").toUpperCase()}.`;
  }

  return null;
}

export function totalAdmissionFileBytes(files) {
  return Object.values(files).reduce((sum, file) => {
    if (file instanceof File) return sum + file.size;
    return sum;
  }, 0);
}
