// src/config.js
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v2',
  appName: import.meta.env.VITE_APP_NAME || 'PIU Admin Portal',
  env: import.meta.env.VITE_ENV || 'development',
  sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 60,
};

export default config;