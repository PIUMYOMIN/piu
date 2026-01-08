import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/axios";

export default function NewCourse() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eligibility: "",
    requirement: "",
    fees: "",
    apply: "",
    start_date: "",
    end_date: "",
    duration: "",
    total_seat: "",
    ic_name: "",
    ic_phone: "",
    course_category_id: "",
    image: null,
    is_active: true,
    application_sts: true
  });

  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load categories and course data
  useEffect(() => {
    loadCategories();
    
    if (params.id) {
      loadCourseData();
    }
  }, [params.id]);

  const loadCategories = async () => {
    try {
      const response = await api.get("/api/v2/course-categories");
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/v2/courses/${params.id}`);
      const course = response.data.data || response.data;
      
      setFormData({
        title: course.title || "",
        description: course.description || "",
        eligibility: course.eligibility || "",
        requirement: course.requirement || "",
        fees: course.fees || "",
        apply: course.apply || "",
        start_date: course.start_date ? course.start_date.split(' ')[0] : "", // Format for date input
        end_date: course.end_date ? course.end_date.split(' ')[0] : "",
        duration: course.duration || "",
        total_seat: course.total_seat || "",
        ic_name: course.ic_name || "",
        ic_phone: course.ic_phone || "",
        course_category_id: course.course_category_id || "",
        image: null,
        is_active: course.is_active || true,
        application_sts: course.application_sts || true
      });
      
      if (course.image) {
        setPreview(course.image);
      }
    } catch (error) {
      console.error("Failed to load course:", error);
      toast.error("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === "image" && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
    
    if (errors.description) {
      setErrors({
        ...errors,
        description: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
    }
    
    if (!formData.description.trim() || formData.description === "<p><br></p>") {
      newErrors.description = "Description is required";
    }
    
    if (!formData.course_category_id) {
      newErrors.course_category_id = "Category is required";
    }
    
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    
    if (formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = "End date cannot be before start date";
    }
    
    if (formData.total_seat && formData.total_seat < 1) {
      newErrors.total_seat = "Seats must be at least 1";
    }
    
    if (formData.fees && parseFloat(formData.fees) < 0) {
      newErrors.fees = "Fee cannot be negative";
    }
    
    if (formData.ic_phone && !/^\d{10,15}$/.test(formData.ic_phone)) {
      newErrors.ic_phone = "Please enter a valid phone number (10-15 digits)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (key === 'image' && !formData[key]) {
          // Skip if no image
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      let response;
      if (params.id) {
        // Update existing course
        response = await api.post(`/api/v2/courses/${params.id}?_method=PUT`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Course updated successfully!");
      } else {
        // Create new course
        response = await api.post("/api/v2/courses", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Course created successfully!");
      }

      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/piu/admin/list");
      }, 1500);
      
    } catch (error) {
      console.error("Error saving course:", error);
      
      // Handle validation errors from server
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        const errorMessages = {};
        
        Object.keys(serverErrors).forEach(key => {
          errorMessages[key] = serverErrors[key][0];
        });
        
        setErrors(errorMessages);
        toast.error("Please fix the errors in the form");
      } else {
        toast.error(error.response?.data?.message || "Failed to save course");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/piu/admin/list");
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  if (loading && params.id) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">
          {params.id ? "Edit Course" : "Create New Course"}
        </h2>
        <p className="text-blue-100 mt-1">
          {params.id 
            ? "Update the course details below" 
            : "Add a new course to your institution's offerings"
          }
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.title 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Enter course title"
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="course_category_id"
                value={formData.course_category_id}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.course_category_id 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.course_category_id && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.course_category_id}
                </p>
              )}
            </div>

            {/* Instructor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructor Name
              </label>
              <input
                type="text"
                name="ic_name"
                value={formData.ic_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter instructor name"
              />
            </div>

            {/* Instructor Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructor Phone
              </label>
              <input
                type="tel"
                name="ic_phone"
                value={formData.ic_phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.ic_phone 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Enter phone number"
              />
              {errors.ic_phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.ic_phone}
                </p>
              )}
            </div>

            {/* Status Checkboxes */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="application_sts"
                  checked={formData.application_sts}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Accepting Applications
                </label>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g., 12 weeks, 6 months"
              />
            </div>

            {/* Fees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Fee
              </label>
              <input
                type="text"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.fees 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="e.g., $1000 or Free"
              />
              {errors.fees && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.fees}
                </p>
              )}
            </div>

            {/* Total Seats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Seats
              </label>
              <input
                type="number"
                name="total_seat"
                value={formData.total_seat}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.total_seat 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Number of available seats"
              />
              {errors.total_seat && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.total_seat}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.start_date 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                required
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.start_date}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.end_date 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.end_date}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={handleDescriptionChange}
              modules={modules}
              className="h-48 mb-16"
              placeholder="Write detailed course description..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <i className="fas fa-exclamation-circle mr-1"></i>
                {errors.description}
              </p>
            )}
          </div>

          {/* Additional Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Eligibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Eligibility Criteria
              </label>
              <textarea
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter eligibility requirements"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </label>
              <textarea
                name="requirement"
                value={formData.requirement}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter course requirements"
              />
            </div>

            {/* Application Process */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Process
              </label>
              <textarea
                name="apply"
                value={formData.apply}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Describe the application process"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Image
            </label>
            <div className="flex items-center space-x-6">
              {preview && (
                <div className="flex-shrink-0">
                  <img
                    src={preview}
                    alt="Course preview"
                    className="h-32 w-48 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 5MB. Recommended: 16:9 aspect ratio
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors flex items-center justify-center min-w-[120px] ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {params.id ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {params.id ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Course
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Course
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}