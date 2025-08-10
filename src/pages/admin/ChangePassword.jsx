import React, { useState } from "react";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    // API call or logic for changing password
    console.log("Old:", oldPassword, "New:", newPassword);
    alert("Password changed successfully!");
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full">
      {/* Title */}
      <h2 className="text-2xl font-bold p-4 bg-[#002147] text-white rounded-t-lg">
        Change Password
      </h2>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-1/2 border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#28ADA0]"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-1/2 border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#28ADA0]"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-1/2 border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#28ADA0]"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#28ADA0] px-6 text-white py-2 rounded-lg hover:bg-[#003366] transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
