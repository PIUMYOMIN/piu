// src/config.js
export const config = {
  // Base URL of the backend (no /api prefix). Example: http://localhost:8000
  // For XAMPP Laravel, the typical local URL is: http://localhost/<project>/public
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost/PIU-Web-Project/public',
  // Back-compat: some older code expects VITE_API_URL to include /api/v2
  apiUrl:
    import.meta.env.VITE_API_URL ||
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost/PIU-Web-Project/public'}/api/v2`,
  appName: import.meta.env.VITE_APP_NAME || 'PIU Admin Portal',
  env: import.meta.env.VITE_ENV || 'development',
  sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 60,
};

export default config;