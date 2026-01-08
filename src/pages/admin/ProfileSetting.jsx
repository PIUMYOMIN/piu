import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe, FaEdit, FaCamera, FaSave, FaSpinner } from "react-icons/fa";
import api from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProfileSetting() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    bio: "",
    profile_image: null,
  });
  
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v2/user/profile");
      const userData = response.data.user;
      
      setCurrentUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        country: userData.country || "",
        bio: userData.bio || "",
        profile_image: null,
      });
      
      if (userData.profile_image) {
        setImagePreview(userData.profile_image);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile_image: file,
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("bio", formData.bio);
      
      if (formData.profile_image instanceof File) {
        formDataToSend.append("profile_image", formData.profile_image);
      }

      const response = await api.put("/api/v2/user/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update local user data
      setCurrentUser(response.data.user);
      
      toast.success("Profile updated successfully!");
      
      // Clear file input
      setFormData(prev => ({ ...prev, profile_image: null }));
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#002147] to-[#003366] text-white p-6 rounded-t-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FaUser className="text-4xl text-gray-400" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors group-hover:block">
              <FaCamera />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">{currentUser?.name}</h1>
            <div className="flex flex-wrap gap-3 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                <FaEnvelope className="inline mr-1" /> {currentUser?.email}
              </span>
              {currentUser?.role && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </span>
              )}
              {currentUser?.phone && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  <FaPhone className="inline mr-1" /> {currentUser.phone}
                </span>
              )}
            </div>
            {currentUser?.bio && (
              <p className="text-gray-200 text-sm italic">"{currentUser.bio}"</p>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaUser className="mr-2 text-blue-500" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Bio / About Me
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaPhone className="mr-2 text-green-500" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  City
                </label>
                <div className="relative">
                  <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Country
                </label>
                <div className="relative">
                  <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Profile Image
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors">
                Choose Image
                <input
                  type="file"
                  name="profile_image"
                  accept=".jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                {formData.profile_image?.name || "No file chosen"}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Recommended: Square image, max 2MB (JPG, PNG, GIF)
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={updating}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <FaSave />
                  Update Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetting;