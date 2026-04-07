// src/main.jsx (or src/index.jsx)
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { AuthInitializer } from './components/AuthInitializer';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading your experience...</p>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AuthInitializer fallback={<LoadingSpinner />}>
          <Suspense fallback={<LoadingSpinner />}>
            <App />
          </Suspense>
        </AuthInitializer>
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={3}
          stacked
        />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);