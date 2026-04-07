import api, { apiV2 } from './axios';

// Prefer named export apiV2, but keep api (default=v2) usable.
const client = apiV2 || api;

export const v2 = {
  // Auth
  register: (userData) => client.post('/register', userData).then((r) => r.data),
  login: (payload) => client.post('/login', payload).then((r) => r.data),
  logout: () => client.post('/logout').then((r) => r.data),

  // User
  getProfile: () => client.get('/user/profile').then((r) => r.data),
  updateProfile: (formData) =>
    client
      .put('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),
  changePassword: (payload) => client.post('/user/change-password', payload).then((r) => r.data),

  // Public content
  getSlides: () => client.get('/slides').then((r) => r.data),
  getNews: () => client.get('/news').then((r) => r.data),
  getNewsBySlug: (slug) => client.get(`/news/slug/${slug}`).then((r) => r.data),
  getEvents: () => client.get('/events').then((r) => r.data),
  getCourses: () => client.get('/courses').then((r) => r.data),
  getCourseCategories: () => client.get('/course-categories').then((r) => r.data),
  getGallery: () => client.get('/gallery').then((r) => r.data),

  // Admissions
  submitAdmission: (formData) =>
    client
      .post('/admissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),
};

export default v2;

