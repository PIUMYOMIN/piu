import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarCheck, FaUser, FaTag } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("https://api.piueducation.org/api/v2/news");
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }
        
        const data = await response.json();
        
        // No need to filter by is_active since API handles it or column doesn't exist
        setNews(data);
      } catch (error) {
        console.error("Network error:", error);
        setError("Unable to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Remove any leading slash or storage/ prefix
    const cleanPath = imagePath.replace(/^\/|^storage\//, '');
    return `https://api.piueducation.org/storage/${cleanPath}`;
  };

  const maxNews = 3;
  const limitedNews = news.slice(0, maxNews);

  if (loading) {
    return (
      <div className="w-full mx-auto lg:my-3 font-robotoSlab bg-secondary-background py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto lg:my-3 font-robotoSlab bg-secondary-background py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading News</h3>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="w-full mx-auto lg:my-3 font-robotoSlab bg-secondary-background py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-yellow-600 mb-2">No News Available</h3>
            <p className="text-yellow-500">Check back later for the latest news and updates.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto lg:my-3 font-robotoSlab bg-secondary-background lg:pt-5 px-2 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div>
          <h2 className="text-4xl my-3 font-oswald font-medium">
            {" "}NEWS & EVENTS
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {limitedNews.map((newItem, index) => (
            <Link
              to={`/news/${newItem.slug || newItem.id}`}
              className="md:mb-2 pb-2 lg:w-96 hover:shadow-2xl transition duration-300 ease-in-out rounded-md bg-white"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              key={newItem.id || index}
            >
              <div className="overflow-hidden h-60 rounded-t-md">
                <img
                  src={getImageUrl(newItem.image)}
                  alt={newItem.title}
                  className="object-cover w-full hover:scale-105 transition duration-300 ease-out h-full"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                  }}
                />
              </div>
              <div className="p-4 flex flex-col justify-between">
                <div className="text-xl my-3 hover:text-orange-500 transition duration-300 ease-in-out">
                  <p className="line-clamp-2">
                    {newItem.title}
                  </p>
                </div>
                <div className="flex flex-row justify-between text-gray-500 text-sm mt-2">
                  <div className="flex items-center">
                    <FaUser className="mr-2" />
                    <span>{newItem.user?.name || 'PIU Faculty'}</span>
                  </div>
                  <div className="flex justify-center items-center">
                    <FaCalendarCheck className="mr-2" />
                    {formatDate(newItem.created_at)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}