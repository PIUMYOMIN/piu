// src/pages/admin/ChangePassword.jsx
import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaSpinner, FaSave } from "react-icons/fa";
import api from "../../api/axios";
import { toast } from "react-toastify";

function ChangePassword() {
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      
      await api.post("/api/v2/user/change-password", {
        current_password: formData.current_password,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
      
      toast.success("Password changed successfully!");
      
      // Reset form
      setFormData({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-lg">
        <h2 className="text-2xl font-bold flex items-center">
          <FaLock className="mr-3" />
          Change Password
        </h2>
        <p className="text-green-100 text-sm mt-1">
          Secure your account with a new password
        </p>
      </div>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Current Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              New Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 6 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full pl-10 pr-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Password Requirements:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className={`flex items-center ${formData.password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${formData.password.length >= 6 ? 'bg-green-600' : 'bg-gray-300'}`} />
                At least 6 characters
              </li>
              <li className={`flex items-center ${formData.password && formData.password_confirmation && formData.password === formData.password_confirmation ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${formData.password && formData.password_confirmation && formData.password === formData.password_confirmation ? 'bg-green-600' : 'bg-gray-300'}`} />
                Passwords must match
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Changing Password...
              </>
            ) : (
              <>
                <FaSave />
                Change Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;