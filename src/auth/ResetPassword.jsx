import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { v2 } from "../utils/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isInvalid = useMemo(() => !token, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid reset token.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await v2.resetPassword({
        token,
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(res?.message || "Password reset successfully. You can login now.");
      setPassword("");
      setPasswordConfirmation("");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Reset Password</h1>
        <p className="text-sm text-gray-600 text-center mt-2">
          Enter your new password to complete reset.
        </p>

        {isInvalid && (
          <div className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded-md">
            Missing reset token. Please open the full link from your email.
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Email address"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="New password"
            required
          />
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Confirm new password"
            required
          />

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
          {success && <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md">{success}</div>}

          <button
            type="submit"
            disabled={loading || isInvalid}
            className="w-full py-3 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-green-700 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

