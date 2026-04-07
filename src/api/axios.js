// src/api/axios.js
import axios from 'axios';
import config from '../config';
import { executeRecaptcha } from '../utils/recaptchaV3';

const API_BASE_URL = config.apiBaseUrl;
const API_V1_URL = `${API_BASE_URL}/api/v1`;
const API_V2_URL = `${API_BASE_URL}/api/v2`;

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

export const apiV1 = createApiClient(API_V1_URL);
export const apiV2 = createApiClient(API_V2_URL);

// Default export for existing imports (assume v2).
const api = apiV2;

export function toStorageUrl(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
  const cleanPath = pathOrUrl.replace(/^storage\//, '').replace(/^\//, '');
  return `${API_BASE_URL}/storage/${cleanPath}`;
}

export default api;