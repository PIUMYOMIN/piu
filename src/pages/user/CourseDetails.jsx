import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaRegClock,
  FaUsers,
  FaGlobe,
  FaHourglassHalf,
  FaCalendarCheck,
  FaDollarSign,
  FaFacebook,
  FaTwitter,
  FaTelegram,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";
import LoadingSpinner from "../../components/user/LoadingSpinner";

export default function CourseDetails() {
  const { slug } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, get all courses to find the one with matching slug
        const response = await fetch("https://api.piueducation.org/api/v2/courses");
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }
        
        const courses = await response.json();
        
        // Find course by slug
        const course = courses.find(c => c.slug === slug);
        
        if (!course) {
          throw new Error("Course not found");
        }
        
        // If we need more details, we can fetch the specific course
        // Or use the course data we already have
        setCourseDetails(course);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [slug]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !courseDetails) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center bg-red-50 rounded-xl p-8">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The course you're looking for doesn't exist."}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  // Construct share URLs
  const currentUrl = window.location.href;
  const shareTitle = courseDetails.title || '';
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`;

  // Handle image URL
  const getImageUrl = () => {
    if (!courseDetails.image) {
      return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    }
    
    if (courseDetails.image.startsWith('http')) {
      return courseDetails.image;
    }
    
    // Try different URL patterns
    const baseUrls = [
      'https://api.piueducation.org/storage/',
      'https://dashboard.piueducation.org/storage/'
    ];
    
    return baseUrls[0] + courseDetails.image.replace(/^storage\//, '');
  };

  return (
    <div className="max-w-7xl mx-auto bg-white py-8 px-4">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/courses" className="hover:text-blue-600">Courses</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{courseDetails.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <main className="lg:w-8/12">
          {/* Course Image */}
          <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
            <img
              src={getImageUrl()}
              alt={courseDetails.title}
              className="w-full h-auto max-h-[500px] object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
              }}
            />
          </div>

          {/* Course Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-0">
                {courseDetails.title}
              </h1>
              
              {/* Share Buttons */}
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Share:</span>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-gray-600 hover:text-blue-600 transition-colors"
                  title="Share on Facebook"
                >
                  <FaFacebook />
                </a>
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-gray-600 hover:text-blue-400 transition-colors"
                  title="Share on Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-gray-600 hover:text-blue-700 transition-colors"
                  title="Share on Telegram"
                >
                  <FaTelegram />
                </a>
              </div>
            </div>

            {/* Course Category */}
            {courseDetails.category && (
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {courseDetails.category.name || courseDetails.category}
              </div>
            )}
          </div>

          {/* Course Overview */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Overview</h3>
            <div className="prose max-w-none">
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: courseDetails.description || 'No description available.' }}
              />
            </div>
          </div>

          {/* Requirements */}
          {courseDetails.requirement && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h3>
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: courseDetails.requirement }}
              />
            </div>
          )}

          {/* Eligibility */}
          {courseDetails.eligibility && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Eligibility</h3>
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: courseDetails.eligibility }}
              />
            </div>
          )}

          {/* How to Apply */}
          {courseDetails.apply && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">How to Apply</h3>
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: courseDetails.apply }}
              />
            </div>
          )}
        </main>

        {/* Sidebar */}
        <div className="lg:w-4/12">
          <div className="sticky top-6">
            {/* Course Features Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-t-xl">
                <h4 className="text-xl font-bold">Course Features</h4>
              </div>
              
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FaHome className="text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Class Size</div>
                      <div className="font-medium">18 Students</div>
                    </div>
                  </li>
                  
                  <li className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FaBook className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Lectures</div>
                      <div className="font-medium">12 Sessions</div>
                    </div>
                  </li>
                  
                  <li className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <FaCalendarCheck className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Start Date</div>
                      <div className="font-medium">{formatDate(courseDetails.start_date)}</div>
                    </div>
                  </li>
                  
                  <li className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <FaRegClock className="text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Time</div>
                      <div className="font-medium">9:00 AM - 4:00 PM</div>
                    </div>
                  </li>
                  
                  <li className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <FaHourglassHalf className="text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium">{courseDetails.duration || 'N/A'}</div>
                    </div>
                  </li>
                  
                  <li className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                      <FaUsers className="text-teal-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Available Seats</div>
                      <div className="font-medium">{courseDetails.total_seat || 'N/A'}</div>
                    </div>
                  </li>
                  
                  <li className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <FaDollarSign className="text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Course Fees</div>
                      <div className="font-medium">{courseDetails.fees || 'Contact for details'}</div>
                    </div>
                  </li>
                  
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <FaGlobe className="text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Language</div>
                      <div className="font-medium">English</div>
                    </div>
                  </li>
                </ul>
                
                {/* Enroll Button */}
                <Link
                  to="/admissions/application-form"
                  className="mt-6 block w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-center font-bold py-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  ENROLL NOW
                </Link>
              </div>
            </div>

            {/* Instructor Info */}
            {courseDetails.ic_name && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Course Instructor</h4>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {courseDetails.ic_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{courseDetails.ic_name}</div>
                    {courseDetails.ic_phone && (
                      <div className="text-sm text-gray-600 mt-1">
                        Contact: {courseDetails.ic_phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}