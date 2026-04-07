import api, { apiV2 } from './axios';

const client = apiV2 || api;

function unwrap(data) {
  // Some endpoints return {success, data}, others return raw arrays/objects
  if (data && typeof data === 'object' && 'data' in data) return data.data;
  return data;
}

export const adminApi = {
  // Courses
  courses: {
    list: () => client.get('/courses').then((r) => unwrap(r.data)),
    get: (id) => client.get(`/courses/${id}`).then((r) => unwrap(r.data)),
    create: (formData) =>
      client
        .post('/courses', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap(r.data)),
    update: (id, formData) =>
      client
        .post(`/courses/${id}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap(r.data)),
    remove: (id) => client.delete(`/courses/${id}`).then((r) => r.data),
    toggleActive: (id) => client.post(`/courses/${id}/isActive`).then((r) => r.data),
    toggleApplication: (id) => client.post(`/courses/${id}/application`).then((r) => r.data),
  },

  // Course Categories
  categories: {
    list: () => client.get('/course-categories').then((r) => unwrap(r.data)),
    create: (payload) => client.post('/course-categories', payload).then((r) => unwrap(r.data)),
    update: (id, payload) => client.put(`/course-categories/${id}`, payload).then((r) => unwrap(r.data)),
    remove: (id) => client.delete(`/course-categories/${id}`).then((r) => r.data),
  },

  // Users / Roles / Permissions
  users: {
    list: () => client.get('/users').then((r) => unwrap(r.data)),
    get: (id) => client.get(`/users/${id}`).then((r) => unwrap(r.data)),
    create: (payload) => client.post('/users', payload).then((r) => unwrap(r.data)),
    update: (id, payload) => client.put(`/users/${id}`, payload).then((r) => unwrap(r.data)),
    remove: (id) => client.delete(`/users/${id}`).then((r) => r.data),
  },
  roles: {
    list: () => client.get('/roles').then((r) => unwrap(r.data)),
    create: (payload) => client.post('/roles', payload).then((r) => unwrap(r.data)),
    update: (id, payload) => client.put(`/roles/${id}`, payload).then((r) => unwrap(r.data)),
    remove: (id) => client.delete(`/roles/${id}`).then((r) => r.data),
  },
  permissions: {
    list: () => client.get('/permissions').then((r) => unwrap(r.data)),
    create: (payload) => client.post('/permissions', payload).then((r) => unwrap(r.data)),
    update: (id, payload) => client.put(`/permissions/${id}`, payload).then((r) => unwrap(r.data)),
    remove: (id) => client.delete(`/permissions/${id}`).then((r) => r.data),
  },

  // Assignments / Modules
  assignments: {
    list: () =>
      client.get('/assignments').then((r) => {
        const data = unwrap(r.data);
        return data?.assignments || [];
      }),
    // Note: backend `show` expects slug, not numeric id.
    get: (slug) =>
      client.get(`/assignments/${slug}`).then((r) => {
        const data = unwrap(r.data);
        return data;
      }),
    create: (formData) =>
      client
        .post('/assignments', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap(r.data)),
    update: (id, formData) =>
      client
        .post(`/assignments/${id}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap(r.data)),
    remove: (id) => client.delete(`/assignments/${id}`).then((r) => r.data),
  },
  modules: {
    list: () => client.get('/modules').then((r) => unwrap(r.data)),
    get: (id) => client.get(`/modules/${id}`).then((r) => unwrap(r.data)),
    create: (payload) => client.post('/modules', payload).then((r) => unwrap(r.data)),
    update: (id, payload) => client.put(`/modules/${id}`, payload).then((r) => unwrap(r.data)),
    remove: (id) => client.delete(`/modules/${id}`).then((r) => r.data),
  },

  // Admissions (secured list, public submit handled elsewhere)
  admissions: {
    list: () => client.get('/admissions').then((r) => unwrap(r.data)),
    get: (id) => client.get(`/admissions/${id}`).then((r) => unwrap(r.data)),
    update: (id, payload) => client.put(`/admissions/${id}`, payload).then((r) => unwrap(r.data)),
  },

  // Gallery
  gallery: {
    list: () => client.get('/gallery').then((r) => unwrap(r.data)),
    get: (id) => client.get(`/gallery/${id}`).then((r) => unwrap(r.data)),
    create: (formData) =>
      client
        .post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap(r.data)),
    update: (id, formData) =>
      client
        .post(`/gallery/${id}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap(r.data)),
    remove: (id) => client.delete(`/gallery/${id}`).then((r) => r.data),
    toggleActive: (id) => client.post(`/gallery/${id}/toggle-active`).then((r) => r.data),
  },

  // Slides
  slides: {
    list: () => client.get('/slides').then((r) => unwrap(r.data)),
    get: (id) => client.get(`/slides/${id}`).then((r) => unwrap(r.data)),
    create: (formData) =>
      client
        .post('/slides', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap(r.data)),
    update: (id, formData) =>
      client
        .post(`/slides/${id}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap(r.data)),
    remove: (id) => client.delete(`/slides/${id}`).then((r) => r.data),
    toggleActive: (id) => client.post(`/slides/${id}/toggle-active`).then((r) => r.data),
    updateOrder: (payload) => client.post('/slides/update-order', payload).then((r) => r.data),
  },

  // Curriculums
  curriculums: {
    list: () => client.get('/curriculums').then((r) => unwrap(r.data)),
    get: (id) => client.get(`/curriculums/${id}`).then((r) => unwrap(r.data)),
    create: (payload) => client.post('/curriculums', payload).then((r) => unwrap(r.data)),
    update: (id, payload) => client.put(`/curriculums/${id}`, payload).then((r) => unwrap(r.data)),
    remove: (id) => client.delete(`/curriculums/${id}`).then((r) => r.data),
  },

  // Teams
  teams: {
    list: () => client.get('/teams').then((r) => unwrap(r.data)),
    get: (id) => client.get(`/teams/${id}`).then((r) => unwrap(r.data)),
    create: (formData) =>
      client
        .post('/teams', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap(r.data)),
    update: (id, formData) =>
      client
        .post(`/teams/${id}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap(r.data)),
    remove: (id) => client.delete(`/teams/${id}`).then((r) => r.data),
    toggleActive: (id) => client.post(`/teams/${id}/toggle-active`).then((r) => r.data),
  },

  // Students
  students: {
    list: () => client.get('/students').then((r) => unwrap(r.data)),
    get: (id) => client.get(`/students/${id}`).then((r) => unwrap(r.data)),
    create: (formData) =>
      client
        .post('/students', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap(r.data)),
    update: (id, formData) =>
      client
        .post(`/students/${id}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => unwrap(r.data)),
    remove: (id) => client.delete(`/students/${id}`).then((r) => r.data),
  },

  meta: {
    years: () => client.get('/years').then((r) => unwrap(r.data)),
    departments: () => client.get('/departments').then((r) => unwrap(r.data)),
    positions: () => client.get('/positions').then((r) => unwrap(r.data)),
  },
};

export default adminApi;

