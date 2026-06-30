import apiClient from "./api";

const FIELD_LABELS = {
  profile: "profile-photo",
  education_certificate: "education-certificate",
  personal_statement: "personal-statement",
  language_proficiency: "language-proficiency",
  other_document: "other-document",
};

function resolveFileName(response, admissionId, field, fallbackName) {
  const disposition = response.headers?.["content-disposition"] || "";
  const match = disposition.match(/filename="?([^"]+)"?/i);
  if (match?.[1]) return match[1];
  if (fallbackName) return fallbackName;
  return `${FIELD_LABELS[field] || field}-${admissionId}`;
}

export async function fetchAdmissionDocumentBlob(admissionId, field) {
  const response = await apiClient.get(`/admissions/${admissionId}/documents/${field}`, {
    responseType: "blob",
  });
  return response;
}

export async function downloadAdmissionDocument(admissionId, field, fallbackName) {
  const response = await fetchAdmissionDocumentBlob(admissionId, field);
  const fileName = resolveFileName(response, admissionId, field, fallbackName);
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function openAdmissionDocument(admissionId, field) {
  const response = await fetchAdmissionDocumentBlob(admissionId, field);
  const url = URL.createObjectURL(response.data);
  window.open(url, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function getAdmissionDocumentObjectUrl(admissionId, field) {
  const response = await fetchAdmissionDocumentBlob(admissionId, field);
  const url = URL.createObjectURL(response.data);
  return { url, contentType: response.headers?.["content-type"] || "" };
}

export function hasAdmissionDocument(admission, field) {
  return Boolean(admission?.[field]);
}
