import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaAngleRight,
  FaClock,
  FaGraduationCap,
  FaUserTie,
  FaCalendarAlt,
  FaSearch,
  FaTag,
  FaFilter,
  FaTimes
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch courses and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch courses
        const coursesResponse = await fetch("https://api.piueducation.org/api/v2/courses");
        if (!coursesResponse.ok) throw new Error("Failed to fetch courses.");
        const coursesData = await coursesResponse.json();

        // Process image URLs
        const processedCourses = coursesData.map(course => {
          // Handle image URL properly
          let imageUrl = course.image;
          if (imageUrl && !imageUrl.startsWith('http')) {
            // Remove any 'storage/' prefix if it exists
            imageUrl = imageUrl.replace(/^storage\//, '');
            imageUrl = `https://api.piueducation.org/storage/${imageUrl}`;
          }
          return { ...course, image: imageUrl };
        });

        setCourses(processedCourses);
        setFilteredCourses(processedCourses.slice(0, 8));

        // Fetch categories if available
        try {
          const categoriesResponse = await fetch("https://api.piueducation.org/api/v2/course-categories");
          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            setCategories(categoriesData);
          }
        } catch (catError) {
          console.error("Failed to fetch categories:", catError);
        }

        setLoading(false);
      } catch (error) {
        console.error("Network Error:", error);
        setError("Failed to load courses. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = courses;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(course =>
        course.category && course.category.id === parseInt(selectedCategory)
      );
    }

    // Limit to 8 for initial display
    if (!searchTerm && selectedCategory === "all") {
      result = result.slice(0, 8);
    }

    setFilteredCourses(result);
  }, [courses, searchTerm, selectedCategory]);

  // Function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Remove any leading slash or storage/ prefix
    const cleanPath = imagePath.replace(/^\/|^storage\//, '');
    return `https://api.piueducation.org/storage/${cleanPath}`;
  };

  const getColorClass = (categoryId) => {
    const colors = [
      "bg-gradient-to-r from-red-500 to-red-600",
      "bg-gradient-to-r from-green-500 to-green-600",
      "bg-gradient-to-r from-orange-500 to-orange-600",
      "bg-gradient-to-r from-blue-500 to-blue-600",
      "bg-gradient-to-r from-purple-500 to-purple-600",
      "bg-gradient-to-r from-pink-500 to-pink-600",
      "bg-gradient-to-r from-indigo-500 to-indigo-600",
      "bg-gradient-to-r from-teal-500 to-teal-600",
    ];
    return colors[categoryId % colors.length] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setShowFilters(false);
  };

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FaGraduationCap className="text-2xl text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load courses</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-oswald">
              Explore Our <span className="text-blue-600">Courses</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover a wide range of academic programs designed to help you achieve your educational goals
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-10">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
              {/* Search Bar */}
              <div className="relative w-full lg:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search courses by name or description..."
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FaTimes className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Filter Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFilter />
                Filters {showFilters ? "↑" : "↓"}
              </button>

              {/* View All Link */}
              <Link
                to="/courses"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium group"
              >
                View All Courses
                <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Filter Panel */}
            <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="flex flex-wrap gap-3 items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <FaTag className="text-gray-500" />
                  <span className="font-medium text-gray-700">Filter by:</span>
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Active Filters Badge */}
                {(searchTerm || selectedCategory !== "all") && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
                  >
                    <FaTimes />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 mb-12">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <Link
                  to={`/courses/${course.slug}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-200"
                  key={course.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  {/* Course Image */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={getImageUrl(course.image)}
                      alt={course.title}
                      className="object-cover lg:h-48 hover:scale-105 transition-all duration-200 ease-in w-full"
                    />
                    {/* Category Badge */}
                    {course.category && (
                      <div className={`absolute top-3 left-3 ${getColorClass(course.category.id)} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}>
                        {course.category.name}
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    {course.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    {/* Course Details */}
                    <div className="space-y-2 text-sm text-gray-500">
                      {course.duration && (
                        <div className="flex items-center gap-2">
                          <FaClock className="text-blue-500" />
                          <span>{course.duration}</span>
                        </div>
                      )}

                      {course.start_date && (
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-green-500" />
                          <span>Starts {formatDate(course.start_date)}</span>
                        </div>
                      )}

                      {course.ic_name && (
                        <div className="flex items-center gap-2">
                          <FaUserTie className="text-purple-500" />
                          <span className="truncate">{course.ic_name}</span>
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-blue-600 font-medium text-sm group-hover:text-blue-800 transition-colors">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FaGraduationCap className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory !== "all"
                    ? "Try adjusting your search or filters"
                    : "No courses available at the moment"}
                </p>
                {(searchTerm || selectedCategory !== "all") && (
                  <button
                    onClick={resetFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Call to Action */}
          {/* {filteredCourses.length > 0 && (
            <div className="text-center py-10">
              <div className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-full mx-auto">
                <FaGraduationCap className="text-5xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Ready to Start Your Journey?
                </h3>
                <p className="text-gray-600 mb-6">
                  Explore our full catalog of courses and find the perfect program for you
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/courses"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                  >
                    Browse All Courses
                  </Link>
                  <Link
                    to="/admissions"
                    className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}