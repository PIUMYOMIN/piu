import React, { useState } from "react";
import { Link } from "react-router-dom";
import { v2 } from "../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const res = await v2.forgotPassword(email.trim());
      setSuccess(res?.message || "Password reset link has been sent to your email.");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Forgot Password</h1>
        <p className="text-sm text-gray-600 text-center mt-2">
          Enter your account email and we will send a reset link.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Email address"
            required
          />

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
          {success && <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md">{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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

