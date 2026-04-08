// src/utils/api.js
import axios from 'axios';
import config from '../config';
import { executeRecaptcha } from './recaptchaV3';

const API_BASE_URL = config.apiBaseUrl;
const API_V1_URL = `${API_BASE_URL}/api/v1`;

function createApiClient(baseURL) {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    withCredentials: false,
  });

  client.interceptors.request.use(
    async (requestConfig) => {
      const token = localStorage.getItem('token');
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }

      const method = (requestConfig.method || 'get').toLowerCase();
      const shouldRecaptcha = ['post', 'put', 'patch', 'delete'].includes(method);

      if (shouldRecaptcha) {
        const rawUrl = requestConfig.url || '';
        const action = `api_${method}_${String(rawUrl).replace(/[^a-zA-Z0-9_/-]/g, '').slice(0, 80)}`
          .replaceAll('/', '_')
          .replaceAll('-', '_')
          .replace(/_+/g, '_')
          .replace(/^_+|_+$/g, '');

        const recaptchaToken = await executeRecaptcha(action);
        if (recaptchaToken) {
          requestConfig.headers['X-Recaptcha-Token'] = recaptchaToken;
          requestConfig.headers['X-Recaptcha-Action'] = action;
        }
      }

      return requestConfig;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export const apiClient = createApiClient(API_V1_URL);

// Back-compat: old code used separate v1/v2 wrappers.
export const v1 = {
  getTeam: () => apiClient.get('/team').then((r) => r.data),
  getTeamMember: (slug) => apiClient.get(`/team/${slug}`).then((r) => r.data),
  getCourses: () => apiClient.get('/courses').then((r) => r.data),
  submitApplicationForm: (payload) => apiClient.post('/application-form/submit', payload).then((r) => r.data),
  submitContactForm: (formData) =>
    apiClient
      .post('/contact/form-submit', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
};

export const v2 = {
  // Auth
  register: (userData) => apiClient.post('/register', userData).then((r) => r.data),
  login: (payload) => apiClient.post('/login', payload).then((r) => r.data),
  studentPortalLogin: (payload) => apiClient.post('/student-portal/login', payload).then((r) => r.data),
  logout: () => apiClient.post('/logout').then((r) => r.data),
  forgotPassword: (email) => apiClient.post('/forgot-password', { email }).then((r) => r.data),
  resetPassword: (payload) => apiClient.post('/reset-password', payload).then((r) => r.data),

  // User
  getProfile: () => apiClient.get('/user/profile').then((r) => r.data),
  updateProfile: (formData) =>
    apiClient
      .put('/user/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  changePassword: (payload) => apiClient.post('/user/change-password', payload).then((r) => r.data),

  // Public content
  getSlides: () => apiClient.get('/slides').then((r) => r.data),
  getNews: () => apiClient.get('/news').then((r) => r.data),
  getNewsBySlug: (slug) => apiClient.get(`/news/slug/${slug}`).then((r) => r.data),
  getEvents: () => apiClient.get('/events').then((r) => r.data),
  getCourses: () => apiClient.get('/courses').then((r) => r.data),
  getCourseCategories: () => apiClient.get('/course-categories').then((r) => r.data),
  getGallery: () => apiClient.get('/gallery').then((r) => r.data),

  // Admissions
  submitAdmission: (formData) =>
    apiClient
      .post('/admissions', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
};

export function toStorageUrl(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
  const cleanPath = pathOrUrl.replace(/^storage\//, '').replace(/^\//, '');
  return `${API_BASE_URL}/storage/${cleanPath}`;
}

export default apiClient;

