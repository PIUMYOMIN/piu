// src/config.js
export const config = {
  // Base URL of the backend (no /api prefix). Example: https://api.piueducation.org
  // For XAMPP Laravel, the typical local URL is: http://10.88.0.3/<project>/public
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL || 'https://api.piueducation.org',
  // Back-compat: some older code expects VITE_API_URL to include an API version path.
  apiUrl:
    import.meta.env.VITE_API_URL ||
    `${import.meta.env.VITE_API_BASE_URL || 'https://api.piueducation.org'}/api/v1`,
  appName: import.meta.env.VITE_APP_NAME || 'PIU Admin Portal',
  env: import.meta.env.VITE_ENV || 'development',
  sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 60,
};

export default config;
