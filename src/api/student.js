import apiClient from '../utils/api';

function unwrap(data) {
  if (data && typeof data === 'object' && 'data' in data) return data.data;
  return data;
}

export const studentApi = {
  dashboard: () => apiClient.get('/student-portal/dashboard').then((r) => unwrap(r.data)),
  grades: () => apiClient.get('/student-portal/grades').then((r) => unwrap(r.data)),
  courses: () => apiClient.get('/student-portal/courses').then((r) => unwrap(r.data)),
  assignments: () => apiClient.get('/student-portal/assignments').then((r) => unwrap(r.data)),
  submitAssignment: (assignmentId, formData) =>
    apiClient
      .post(`/student-portal/assignments/${assignmentId}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => unwrap(r.data)),
  updateProfile: (formData) =>
    apiClient
      .post('/student-portal/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),
  changePassword: (payload) =>
    apiClient.post('/student-portal/change-password', payload).then((r) => r.data),
};

export default studentApi;
