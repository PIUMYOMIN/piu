import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/user/LoadingSpinner";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("https://api.piueducation.org/api/v2/courses");

        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }

        const data = await response.json();

        console.log("Raw API Data:", data); // Debug

        // If API already returns full URLs, use them directly
        // If not, construct the URL properly
        const processedCourses = data.map(course => {
          // Handle image URL
          let imageUrl = course.image;
          if (course.image && !course.image.startsWith('http')) {
            // Remove 'storage/' prefix if it exists
            const cleanPath = course.image.replace(/^storage\//, '');
            imageUrl = `https://api.piueducation.org/storage/${cleanPath}`;
          }

          return {
            ...course,
            image: imageUrl,
            // Ensure category exists
            category: course.category || course.course_category || null
          };
        });

        // Filter only active courses if your API returns is_active field
        const activeCourses = processedCourses.filter(course =>
          course.is_active === true || course.is_active === 1 || course.is_active === undefined
        );

        console.log("Processed courses:", activeCourses); // Debug
        setCourses(activeCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Unable to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  function getColorClass(categoryId) {
    if (!categoryId) return "bg-gray-400 rounded-full px-2 text-white text-sm";

    switch (categoryId) {
      case 1:
        return "bg-red-400 rounded-full px-2 text-white text-sm";
      case 2:
        return "bg-green-400 rounded-full px-2 text-white text-sm";
      case 3:
        return "bg-orange-400 rounded-full px-2 text-white text-sm";
      case 4:
        return "bg-slate-400 rounded-full px-2 text-white text-sm";
      default:
        return "bg-blue-400 rounded-full px-2 text-white text-sm";
    }
  }

  // Helper function to get category name
  const getCategoryName = (course) => {
    if (course.category && course.category.name) {
      return course.category.name;
    }
    if (course.course_category_id) {
      // Map IDs to names if category object not available
      const categoryMap = {
        1: "Certificate",
        2: "Master",
        3: "Bachelor",
        4: "Diploma",
        5: "PhD"
      };
      return categoryMap[course.course_category_id] || "Other";
    }
    return "No Category";
  };

  // Helper function to get category ID
  const getCategoryId = (course) => {
    if (course.category && course.category.id) {
      return course.category.id;
    }
    return course.course_category_id;
  };

  if (loading) {
    return (
      <div className="w-full bg-primary-background px-2 min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-primary-background px-2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center bg-red-100 py-9">
            <div className="text-3xl font-oswald text-red-600">
              Error Loading Courses
            </div>
            <p className="font-nato text-red-500 mt-2">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="w-full bg-primary-background px-2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center bg-yellow-100 py-9">
            <div className="text-3xl font-oswald text-yellow-600">
              No Courses Available
            </div>
            <p className="font-nato text-yellow-500 mt-2">
              Check back later for available courses.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-primary-background px-2">
      <div className="max-w-7xl mx-auto">
        <div className="text-center bg-green-300 py-9">
          <div className="text-3xl font-oswald">
            All Courses
          </div>
          <p className="font-nato">
            Choose the Course That Aligns with Your Goals!
          </p>
          <div className="mt-2 text-sm text-gray-600">
            Showing {courses.length} {courses.length === 1 ? 'course' : 'courses'}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 mt-10">
          {courses.map((course, index) => {
            console.log(`Course ${index}:`, course); // Debug each course

            return (
              <Link
                to={`/courses/${course.slug || course.id}`}
                className="flex flex-col overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index % 4 * 100}
                key={course.id || index}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      course.image && course.image.startsWith('http')
                        ? course.image
                        : `https://api.piueducation.org/storage/${course.image}`
                    }
                    alt={course.title}
                    className="object-cover w-full h-48 hover:scale-105 transition-transform duration-500 ease-in-out"
                    onError={(e) => {
                      console.error("Image failed:", course.image);
                      // Try alternative URLs
                      const alternatives = [
                        `https://dashboard.piueducation.org/storage/${course.image}`,
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                      ];

                      for (let altUrl of alternatives) {
                        if (altUrl !== e.target.src) {
                          e.target.src = altUrl;
                          break;
                        }
                      }
                    }}
                  />
                  {/* Status Badge */}
                  {course.is_active === false && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Coming Soon
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex flex-row justify-between items-center mb-2">
                    <span
                      className={getColorClass(getCategoryId(course))}
                    >
                      {getCategoryName(course)}
                    </span>
                    <small className="hidden sm:inline lg:text-normal text-sm font-montserrat font-regular">
                      {course.duration || "N/A"}
                    </small>
                  </div>

                  <div className="lg:text-xl block hover:underline my-2 transition duration-300 ease-in-out hover:text-orange-400 font-medium text-gray-800">
                    {course.title}
                  </div>

                  {/* Additional Info (Optional) */}
                  {course.ic_name && (
                    <div className="text-sm text-gray-600 mt-2 truncate">
                      Instructor: {course.ic_name}
                    </div>
                  )}

                  {course.start_date && (
                    <div className="text-xs text-gray-500 mt-1">
                      Starts: {new Date(course.start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short'
                      })}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}