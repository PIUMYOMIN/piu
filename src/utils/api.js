// src/utils/api.js
import axios from 'axios';
import config from '../config';
import { executeRecaptcha, isRecaptchaConfigured, normalizeAction } from './recaptchaV3';

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

      const shouldRecaptcha = requestConfig.recaptcha === true || Boolean(requestConfig.recaptcha?.enabled);

      if (shouldRecaptcha) {
        const method = (requestConfig.method || 'get').toLowerCase();
        const rawUrl = requestConfig.url || '';
        const action =
          requestConfig.recaptcha?.action ||
          `api_${method}_${String(rawUrl).replace(/[^a-zA-Z0-9_/-]/g, '').slice(0, 80)}`
            .replaceAll('/', '_')
            .replaceAll('-', '_')
            .replace(/_+/g, '_')
            .replace(/^_+|_+$/g, '');

        const normalizedAction = normalizeAction(action);
        const recaptchaToken = await executeRecaptcha(normalizedAction);
        if (recaptchaToken) {
          requestConfig.headers['X-Recaptcha-Token'] = recaptchaToken;
          requestConfig.headers['X-Recaptcha-Action'] = normalizedAction;
        } else if (isRecaptchaConfigured()) {
          return Promise.reject(
            Object.assign(new Error('Security verification failed to load. Please refresh the page, disable ad blockers, and try again.'), {
              isRecaptchaError: true,
            })
          );
        }
      }

      delete requestConfig.recaptcha;

      // Let the browser set multipart boundaries for file uploads.
      if (typeof FormData !== 'undefined' && requestConfig.data instanceof FormData) {
        delete requestConfig.headers['Content-Type'];
        delete requestConfig.headers['content-type'];
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
        localStorage.removeItem('user');
        localStorage.removeItem('account_type');
        if (!window.location.pathname.startsWith('/login')) {
          window.location.assign('/login');
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export const apiClient = createApiClient(API_V1_URL);

function unwrapResponseData(data) {
  if (data && typeof data === 'object' && 'data' in data) return data.data;
  return data;
}

function unwrapResponseArray(data) {
  const unwrapped = unwrapResponseData(data);

  if (Array.isArray(unwrapped)) return unwrapped;
  if (Array.isArray(unwrapped?.data)) return unwrapped.data;

  return [];
}

// Back-compat: old code used separate v1/v2 wrappers.
export const v1 = {
  getTeam: () => apiClient.get('/team').then((r) => r.data),
  getTeamMember: (slug) => apiClient.get(`/team/${slug}`).then((r) => r.data),
  getCourses: () => apiClient.get('/courses').then((r) => r.data),
  submitApplicationForm: (payload) =>
    apiClient
      .post('/admissions', payload, {
        recaptcha: { enabled: true, action: 'admission_form_submit' },
      })
      .then((r) => r.data),
  submitContactForm: (formData) =>
    apiClient
      .post('/contact/form-submit', formData, {
        recaptcha: { enabled: true, action: 'contact_form_submit' },
      })
      .then((r) => r.data),
};

export const v2 = {
  // Auth
  register: (userData) => apiClient.post('/register', userData).then((r) => r.data),
  login: (payload) => apiClient.post('/login', payload).then((r) => r.data),
  googleLogin: (payload) => apiClient.post('/auth/google', payload).then((r) => r.data),
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
  getSlides: () => apiClient.get('/slides').then((r) => unwrapResponseArray(r.data)),
  getNews: () => apiClient.get('/news').then((r) => unwrapResponseArray(r.data)),
  getNewsBySlug: (slug) => apiClient.get(`/news/slug/${slug}`).then((r) => unwrapResponseData(r.data)),
  getEvents: () => apiClient.get('/events').then((r) => unwrapResponseArray(r.data)),
  getCourses: () => apiClient.get('/courses').then((r) => unwrapResponseArray(r.data)),
  getCourseCategories: () => apiClient.get('/course-categories').then((r) => unwrapResponseArray(r.data)),
  getGallery: () => apiClient.get('/gallery').then((r) => unwrapResponseArray(r.data)),

  // Admissions — long timeout for multi-file uploads on slow networks
  submitAdmission: (formData, options = {}) =>
    apiClient
      .post('/admissions', formData, {
        timeout: options.timeout ?? 300000,
        onUploadProgress: options.onUploadProgress,
        recaptcha: { enabled: true, action: 'admission_form_submit' },
      })
      .then((r) => r.data),
};

export function toStorageUrl(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
  const cleanPath = pathOrUrl.replace(/^storage\//, '').replace(/^\//, '');
  return `${API_BASE_URL}/storage/${cleanPath}`;
}

export default apiClient;
