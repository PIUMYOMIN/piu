import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTag, FaUserCheck, FaPlusCircle, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaCalendarAlt, FaUserTie, FaDollarSign, FaGraduationCap, FaBook, FaUsers, FaSpinner } from "react-icons/fa";
import api from "../../api/axios";

const CourseList = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch courses from API
  useEffect(() => {
    fetchCourses();
  }, []);

  // Apply filters when search or filters change
  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, categoryFilter, statusFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get("/api/v2/courses");
      console.log("📡 Courses API response:", response.data['image']);
      
      // Transform API data to match frontend format
      const transformedCourses = response.data.map(course => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        image: course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        category: getCategoryName(course.course_category_id),
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
        applicantOpen: course.application_sts === 1,
        fee: course.fees || "N/A",
        instructor: course.ic_name || "Not assigned",
        seats: parseInt(course.total_seat) || 0
      }));
      
      setCourses(transformedCourses);
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      setError("Failed to load courses. Please try again.");
      
      // Fallback to sample data if API fails
      setCourses(getSampleCourses());
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get category name (you might want to fetch this from API)
  const getCategoryName = (categoryId) => {
    const categories = {
      1: "Certificate",
      2: "Master",
      3: "Bachelor",
      4: "Diploma",
      5: "PhD"
    };
    return categories[categoryId] || "Other";
  };

  // Sample courses fallback
  const getSampleCourses = () => [
    {
      id: 1,
      title: "Bachelor of Computer Science",
      slug: "bachelor-of-computer-science",
      description: "Computer Science degree program",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      category: "Bachelor",
      duration: "4 Years",
      startDate: "2025-06-01",
      endDate: "2029-05-30",
      seats: 60,
      enrolled: 45,
      active: true,
      applicantOpen: true,
      fee: "$12,000",
      instructor: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      title: "Master of Business Administration",
      slug: "master-of-business-administration",
      description: "MBA program",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      category: "Master",
      duration: "2 Years",
      startDate: "2025-09-01",
      endDate: "2027-08-31",
      seats: 30,
      enrolled: 28,
      active: false,
      applicantOpen: false,
      fee: "$18,000",
      instructor: "Prof. Michael Chen"
    }
  ];

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
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await api.delete(`/api/v2/courses/${id}`);
      
      // Remove from local state
      setCourses(courses.filter((course) => course.id !== id));
      
      alert("Course deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  const toggleStatus = async (id, field) => {
    try {
      const course = courses.find(c => c.id === id);
      if (!course) return;

      const updatedValue = field === 'active' ? !course.active : !course.applicantOpen;
      
      // Prepare update data
      const updateData = {};
      if (field === 'active') {
        updateData.is_active = updatedValue;
      } else {
        updateData.application_sts = updatedValue ? 1 : 0;
      }

      // Send API request
      const response = await api.put(`/api/v2/courses/${id}`, updateData);
      
      // Update local state
      setCourses(courses.map(course => 
        course.id === id 
          ? { 
              ...course, 
              [field]: updatedValue,
              is_active: field === 'active' ? updatedValue : course.is_active,
              application_sts: field === 'applicantOpen' ? (updatedValue ? 1 : 0) : course.application_sts
            } 
          : course
      ));
      
      console.log(`✅ Course ${field} updated successfully`);
    } catch (error) {
      console.error(`❌ Error updating course ${field}:`, error);
      alert(`Failed to update ${field}. Please try again.`);
    }
  };

  // Get unique categories for filter
  const categories = [...new Set(courses.map(course => course.category))];

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
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
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
          <button
            onClick={() => navigate("/piu/admin/new")}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full lg:w-auto group"
          >
            <FaPlusCircle className="mr-2 group-hover:rotate-90 transition-transform" />
            New Course
          </button>
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
                          {course.category} • {course.duration}
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
                          className={`h-2 rounded-full ${
                            calculateEnrollmentPercentage(course.enrolled, course.seats) >= 80 
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          course.active 
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          course.applicantOpen 
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
          <div>
            Showing <span className="font-semibold">{filteredCourses.length}</span> of{" "}
            <span className="font-semibold">{courses.length}</span> courses
          </div>
          <div className="mt-2 sm:mt-0">
            <button
              onClick={fetchCourses}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaSearch className="mr-1" size={12} />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;