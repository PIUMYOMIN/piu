import apiClient from "../utils/api";

function unwrap(data) {
  if (data && typeof data === "object" && "data" in data) return data.data;
  return data;
}

export const teacherApi = {
  dashboard: () => apiClient.get("/teacher/dashboard").then((r) => r.data),
  courses: (params) => apiClient.get("/teacher/courses", { params }).then((r) => unwrap(r.data)),
  students: (params) => apiClient.get("/teacher/students", { params }).then((r) => unwrap(r.data)),
  modules: (params) => apiClient.get("/teacher/modules", { params }).then((r) => unwrap(r.data)),
  assignments: (params) => apiClient.get("/teacher/assignments", { params }).then((r) => unwrap(r.data)),
  curriculums: (params) => apiClient.get("/teacher/curriculums", { params }).then((r) => unwrap(r.data)),
  grades: (params) => apiClient.get("/teacher/grades", { params }).then((r) => unwrap(r.data)),
  studentGrades: (studentId) =>
    apiClient.get(`/teacher/students/${studentId}/grades`).then((r) => r.data),
  saveGrade: (payload) => apiClient.post("/teacher/grades", payload).then((r) => r.data),
  updateGrade: (id, payload) => apiClient.put(`/teacher/grades/${id}`, payload).then((r) => r.data),
  deleteGrade: (id) => apiClient.delete(`/teacher/grades/${id}`).then((r) => r.data),
};

export default teacherApi;
