import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTag, FaUserCheck, FaPlusCircle, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaCalendarAlt, FaUserTie, FaDollarSign, FaGraduationCap, FaBook, FaUsers, FaSpinner, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import api from "../../api/axios";

const CourseList = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]); // Store fetched categories
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState(null);

  // Fetch courses and categories from API
  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  // Apply filters when search or filters change
  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, categoryFilter, statusFilter]);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get("/api/v2/course-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      showToast("Failed to load categories. Using default categories.", "error");
      // Fallback to default categories
      setCategories([
        { id: 1, name: "Certificate" },
        { id: 2, name: "Master" },
        { id: 3, name: "Bachelor" },
        { id: 4, name: "Diploma" },
        { id: 5, name: "PhD" }
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/api/v2/courses");

      // Transform API data to match frontend format
      const transformedCourses = response.data.map(course => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        image: course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        category: getCategoryName(course.course_category_id),
        category_id: course.course_category_id,
        course_category_id: course.course_category_id,
        duration: course.duration || "N/A",
        startDate: course.start_date || "N/A",
        endDate: course.end_date || "N/A",
        total_seat: course.total_seat || "0",
        enrolled: "0", // You'll need to get this from enrollments API
        is_active: course.is_active || false,
        application_sts: course.application_sts || 0,
        fees: course.fees || "N/A",
        ic_name: course.ic_name || "Not assigned",
        ic_phone: course.ic_phone || "N/A",
        user_id: course.user_id,
        created_at: course.created_at,
        updated_at: course.updated_at,
        // Additional fields for UI
        active: course.is_active || false,
        applicantOpen: course.application_sts === 1 || course.application_sts === true,
        fee: course.fees || "N/A",
        instructor: course.ic_name || "Not assigned",
        seats: parseInt(course.total_seat) || 0
      }));

      setCourses(transformedCourses);
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      setError("Failed to load courses. Please try again.");
      showToast("Failed to load courses. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get category name from fetched categories
  const getCategoryName = (categoryId) => {
    if (!categories || categories.length === 0) {
      // Fallback if categories not loaded yet
      const defaultCategories = {
        1: "Certificate",
        2: "Master",
        3: "Bachelor",
        4: "Diploma",
        5: "PhD"
      };
      return defaultCategories[categoryId] || "Other";
    }

    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Other";
  };

  const filterCourses = () => {
    let filtered = courses.filter(course => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && course.active) ||
        (statusFilter === "inactive" && !course.active);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    setFilteredCourses(filtered);
  };

  const handleDelete = async (id) => {
    const courseTitle = courses.find(c => c.id === id)?.title;
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/v2/courses/${id}`);

      // Remove from local state
      setCourses(courses.filter((course) => course.id !== id));

      showToast(`Course "${courseTitle}" deleted successfully!`, "success");
    } catch (error) {
      console.error("❌ Error deleting course:", error);
      showToast("Failed to delete course. Please try again.", "error");
    }
  };

  const toggleStatus = async (id, field) => {
    try {
      const course = courses.find(c => c.id === id);
      if (!course) return;

      const courseTitle = course.title;
      const currentValue = field === 'active' ? course.active : course.applicantOpen;
      const newValue = !currentValue;

      // Use the correct API endpoint based on the field
      if (field === 'active') {
        // Toggle active status using isActive endpoint
        await api.post(`/api/v2/courses/${id}/isActive`);

        // Update local state
        setCourses(courses.map(course =>
          course.id === id
            ? {
              ...course,
              active: newValue,
              is_active: newValue
            }
            : course
        ));

        const statusMessage = newValue ? "activated" : "deactivated";
        showToast(`Course "${courseTitle}" ${statusMessage} successfully!`, "success");

      } else if (field === 'applicantOpen') {
        // Toggle application status using application endpoint
        await api.post(`/api/v2/courses/${id}/application`);

        // Update local state
        setCourses(courses.map(course =>
          course.id === id
            ? {
              ...course,
              applicantOpen: newValue,
              application_sts: newValue ? 1 : 0
            }
            : course
        ));

        const statusMessage = newValue ? "opened for applications" : "closed for applications";
        showToast(`Course "${courseTitle}" ${statusMessage}!`, "success");
      }
    } catch (error) {
      console.error(`❌ Error updating course ${field}:`, error);
      showToast(`Failed to update course. Please try again.`, "error");
    }
  };

  // Get unique categories for filter from fetched categories
  const uniqueCategories = [...new Set(courses.map(course => course.category))];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return dateString;
    }
  };

  // Calculate enrollment percentage
  const calculateEnrollmentPercentage = (enrolled, seats) => {
    if (!seats || seats === 0) return 0;
    return Math.round((parseInt(enrolled) / parseInt(seats)) * 100);
  };

  // Toast component
  const Toast = () => {
    if (!toast) return null;

    const bgColor = toast.type === "success" ? "bg-green-50 border-green-200" :
      toast.type === "error" ? "bg-red-50 border-red-200" :
        "bg-blue-50 border-blue-200";

    const textColor = toast.type === "success" ? "text-green-800" :
      toast.type === "error" ? "text-red-800" :
        "text-blue-800";

    const icon = toast.type === "success" ? <FaCheckCircle className="text-green-500" /> :
      toast.type === "error" ? <FaTimesCircle className="text-red-500" /> :
        <FaInfoCircle className="text-blue-500" />;

    return (
      <div className="fixed top-4 right-4 z-50 animate-slideIn">
        <div className={`flex items-center p-4 mb-3 rounded-lg border ${bgColor} ${textColor} shadow-lg max-w-md`}>
          <div className="text-lg mr-3">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            <FaTimesCircle />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
        <span className="ml-3 text-gray-600">Loading courses...</span>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Toast Notification */}
      <Toast />

      {/* Header */}
      <div className="bg-gradient-to-r from-[#002147] to-[#003366] p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center">
          <FaGraduationCap className="mr-3" />
          Course Management
        </h2>
        <p className="text-blue-100 mt-1">Manage academic courses and programs</p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Search and Add Button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Category Filter */}
              <div className="relative w-full sm:w-40">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTag className="text-gray-400" />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none bg-white"
                  disabled={loadingCategories}
                >
                  <option value="all">All Categories</option>
                  {loadingCategories ? (
                    <option>Loading categories...</option>
                  ) : (
                    uniqueCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {loadingCategories ? (
                    <FaSpinner className="animate-spin text-gray-400" />
                  ) : (
                    <FaSearch className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative w-full sm:w-40">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserCheck className="text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Add Course Button */}
          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={() => navigate("/piu/admin/course-categories")}
              className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full lg:w-auto group"
            >
              <FaTag className="mr-2" />
              Manage Categories
            </button>
            <button
              onClick={() => navigate("/piu/admin/new")}
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full lg:w-auto group"
            >
              <FaPlusCircle className="mr-2 group-hover:rotate-90 transition-transform" />
              New Course
            </button>
          </div>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  {/* Course Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-14 w-14">
                        <img
                          className="h-14 w-14 rounded-lg object-cover border border-gray-200"
                          src={course.image}
                          alt={course.title}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80";
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {course.title}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <FaBook className="mr-1" size={10} />
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${course.category === 'Certificate' ? 'bg-yellow-100 text-yellow-800' :
                              course.category === 'Master' ? 'bg-purple-100 text-purple-800' :
                                course.category === 'Bachelor' ? 'bg-blue-100 text-blue-800' :
                                  course.category === 'Diploma' ? 'bg-green-100 text-green-800' :
                                    course.category === 'PhD' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                            }`}>
                            {course.category}
                          </span>
                          <span className="mx-2">•</span>
                          {course.duration}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <FaUserTie className="mr-1" size={10} />
                          {course.instructor}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Details */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-900 flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-500" size={12} />
                        {formatDate(course.startDate)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-500" size={12} />
                        {formatDate(course.endDate)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <FaDollarSign className="mr-2 text-blue-500" size={12} />
                        {course.fee}
                      </div>
                    </div>
                  </td>

                  {/* Enrollment */}
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center">
                        <FaUsers className="mr-2 text-blue-500" size={14} />
                        <span className="font-medium">{course.enrolled}</span> / {course.seats} seats
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${calculateEnrollmentPercentage(course.enrolled, course.seats) >= 80
                              ? "bg-red-500"
                              : calculateEnrollmentPercentage(course.enrolled, course.seats) >= 50
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          style={{ width: `${calculateEnrollmentPercentage(course.enrolled, course.seats)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {calculateEnrollmentPercentage(course.enrolled, course.seats)}% filled
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="space-y-3">
                      {/* Active Status */}
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${course.active
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}>
                          {course.active ? "Active" : "Inactive"}
                        </span>
                        <button
                          onClick={() => toggleStatus(course.id, 'active')}
                          className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                          title={course.active ? "Deactivate" : "Activate"}
                        >
                          {course.active ? (
                            <FaToggleOn className="text-green-500 text-lg" />
                          ) : (
                            <FaToggleOff className="text-gray-400 text-lg" />
                          )}
                        </button>
                      </div>

                      {/* Application Status */}
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${course.applicantOpen
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}>
                          {course.applicantOpen ? "Applications Open" : "Applications Closed"}
                        </span>
                        <button
                          onClick={() => toggleStatus(course.id, 'applicantOpen')}
                          className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                          title={course.applicantOpen ? "Close Applications" : "Open Applications"}
                        >
                          {course.applicantOpen ? (
                            <FaToggleOn className="text-blue-500 text-lg" />
                          ) : (
                            <FaToggleOff className="text-gray-400 text-lg" />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => navigate(`/piu/admin/new/${course.id}`, { state: course })}
                        className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 rounded-md transition-colors text-sm font-medium"
                        title="Edit course"
                      >
                        <FaEdit className="mr-1.5" size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="inline-flex items-center justify-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 rounded-md transition-colors text-sm font-medium"
                        title="Delete course"
                      >
                        <FaTrash className="mr-1.5" size={12} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <FaGraduationCap className="text-2xl text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No courses found</h3>
              <p className="text-gray-500">
                {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first course"
                }
              </p>
              {!searchTerm && categoryFilter === "all" && statusFilter === "all" && (
                <button
                  onClick={() => navigate("/piu/admin/new")}
                  className="mt-4 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FaPlusCircle className="mr-2" />
                  Create First Course
                </button>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <span className="mr-4">
              Showing <span className="font-semibold">{filteredCourses.length}</span> of{" "}
              <span className="font-semibold">{courses.length}</span> courses
            </span>
            {loadingCategories ? (
              <span className="flex items-center text-gray-500">
                <FaSpinner className="animate-spin mr-1" size={12} />
                Loading categories...
              </span>
            ) : (
              <span className="text-gray-500">
                {categories.length} categories available
              </span>
            )}
          </div>
          <div className="mt-2 sm:mt-0 flex gap-4">
            <button
              onClick={() => {
                fetchCategories();
                showToast("Categories refreshed!", "success");
              }}
              className="inline-flex items-center text-purple-600 hover:text-purple-800"
            >
              <FaTag className="mr-1" size={12} />
              Refresh Categories
            </button>
            <button
              onClick={() => {
                fetchCourses();
                showToast("Courses list refreshed!", "success");
              }}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaSearch className="mr-1" size={12} />
              Refresh Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;