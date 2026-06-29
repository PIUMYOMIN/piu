import React, { useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import {
  getDashboardPathForRole,
  resolveUserRole,
  STUDENT_DEFAULT_PASSWORD,
} from '../utils/authRouting';
import { ADMIN_TABS, buildDashboardPath, STUDENT_TABS, TEACHER_TABS } from '../utils/dashboardTabs';

export default function Login() {
  const [portal, setPortal] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, logoutLocal, studentPortalLogin, googleLogin } = useAuth();

  const getErrorMessage = (err, fallback) => {
    const data = err?.response?.data;
    if (data?.errors && typeof data.errors === "object") {
      const first = Object.values(data.errors)[0];
      if (Array.isArray(first) && first[0]) return first[0];
      if (typeof first === "string") return first;
    }
    return data?.message || data?.error || fallback;
  };

  const redirectAfterStaffLogin = useCallback((userData) => {
    const role = resolveUserRole(userData?.user);

    if (portal === 'user' && role !== 'user') {
      logoutLocal();
      setError('This account is not a user account. Please choose the correct portal.');
      return;
    }

    if (portal === 'admin' && role !== 'admin' && role !== 'registrar') {
      logoutLocal();
      setError('This account is not an admin account.');
      return;
    }

    if (portal === 'teacher' && role !== 'teacher') {
      logoutLocal();
      setError('This account is not a teacher account.');
      return;
    }

    let destination = getDashboardPathForRole(role);
    if (role === 'admin' || role === 'registrar') {
      destination = buildDashboardPath(destination, ADMIN_TABS.DASHBOARD);
    } else if (role === 'teacher') {
      destination = buildDashboardPath(destination, TEACHER_TABS.DASHBOARD);
    }

    navigate(destination, { replace: true });
  }, [portal, logoutLocal, navigate]);

  const handleGoogleCredential = useCallback(async (idToken) => {
    setError('');
    setIsSubmitting(true);

    try {
      const userData = await googleLogin(idToken);
      redirectAfterStaffLogin(userData);
    } catch (err) {
      const message = getErrorMessage(err, 'Google sign-in failed. Please try again.');
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [googleLogin, redirectAfterStaffLogin]);

  const handleGoogleError = useCallback((err) => {
    setError(err?.message || 'Google sign-in failed. Please try again.');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (portal === 'student') {
        if (!studentId.trim() || !password) {
          setError('Please enter your student ID and password.');
          setIsSubmitting(false);
          return;
        }
        const studentData = await studentPortalLogin(studentId.trim(), password);
        const role = resolveUserRole(studentData?.user);

        if (role !== "student") {
          logoutLocal();
          setError('This account is not a student account.');
          return;
        }

        navigate(
          buildDashboardPath(getDashboardPathForRole(role), STUDENT_TABS.DASHBOARD),
          { replace: true }
        );
        return;
      }

      if (!email || !password) {
        setError('Please fill in all fields');
        setIsSubmitting(false);
        return;
      }

      const userData = await login(email, password);
      redirectAfterStaffLogin(userData);
    } catch (err) {
      const fallback =
        portal === "student"
          ? "Invalid student ID or password."
          : portal === "user"
            ? "No matching account in the user table. Please choose the correct portal."
            : "Invalid login credentials.";
      const message = getErrorMessage(err, fallback);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setPortal('user')}
            className={`w-full rounded-md border px-4 py-2 text-sm text-left transition ${portal === "user"
                ? "border-green-700 bg-green-50 text-green-900"
                : "border-gray-300 bg-white hover:border-green-600 hover:bg-green-50"
              }`}
          >
            User Portal
          </button>
          <button
            type="button"
            onClick={() => setPortal('admin')}
            className={`w-full rounded-md border px-4 py-2 text-sm text-left transition ${portal === "admin"
                ? "border-green-700 bg-green-50 text-green-900"
                : "border-gray-300 bg-white hover:border-green-600 hover:bg-green-50"
              }`}
          >
            Admin Portal
          </button>
          <button
            type="button"
            onClick={() => setPortal('teacher')}
            className={`w-full rounded-md border px-4 py-2 text-sm text-left transition ${portal === "teacher"
                ? "border-green-700 bg-green-50 text-green-900"
                : "border-gray-300 bg-white hover:border-green-600 hover:bg-green-50"
              }`}
          >
            Teacher Portal
          </button>
          <button
            type="button"
            onClick={() => setPortal('student')}
            className={`w-full rounded-md border px-4 py-2 text-sm text-left transition ${portal === "student"
                ? "border-green-700 bg-green-50 text-green-900"
                : "border-gray-300 bg-white hover:border-green-600 hover:bg-green-50"
              }`}
          >
            Student Portal
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
            {portal === "student"
              ? `Student Portal: sign in with your Student ID and default password (${STUDENT_DEFAULT_PASSWORD}).`
              : portal === "admin"
                ? "Admin Portal: admin and registrar accounts."
                : portal === "teacher"
                  ? "Teacher Portal: teacher accounts."
                  : "User Portal: normal users can login with email and password."}
          </div>

          <div className="rounded-md shadow-sm space-y-4">
            {portal === 'student' ? (
              <>
                <div>
                  <label htmlFor="studentId" className="sr-only">
                    Student ID
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Student ID"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Login..
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>

          {portal !== 'student' && (
            <div className="pt-2 text-center space-y-2">
              <p className="text-sm">
                <Link to="/forgot-password" className="font-medium text-green-700 hover:text-green-600">
                  Forgot your password?
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                  Create one
                </Link>
              </p>
            </div>
          )}

          {portal !== 'student' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-green-50 to-blue-50 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <GoogleSignInButton
                  onCredential={handleGoogleCredential}
                  onError={handleGoogleError}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}