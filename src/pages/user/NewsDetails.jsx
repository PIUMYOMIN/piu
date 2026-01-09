import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import LoadingSpinner from "../../components/user/LoadingSpinner";
import { FaCalendarAlt, FaUser, FaArrowLeft, FaShareAlt, FaPrint, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";

export default function NewsDetails() {
  const { slug } = useParams();
  const location = useLocation();
  const [newsDetails, setNewsDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try both endpoints - by slug and by ID
        const response = await fetch(
          `https://api.piueducation.org/api/v2/news/slug/${slug}`
        );
        
        if (!response.ok) {
          // If slug endpoint fails, try the regular endpoint
          const newsResponse = await fetch(`https://api.piueducation.org/api/v2/news`);
          if (!newsResponse.ok) {
            throw new Error("Failed to fetch news details.");
          }
          
          const allNews = await newsResponse.json();
          // Find news by slug in the array
          const foundNews = allNews.find(news => news.slug === slug);
          if (!foundNews) {
            throw new Error("News not found.");
          }
          setNewsDetails(foundNews);
          
          // Get related news (same category or recent)
          const related = allNews
            .filter(news => news.id !== foundNews.id)
            .slice(0, 3);
          setRelatedNews(related);
        } else {
          const data = await response.json();
          setNewsDetails(data);
          
          // Fetch related news
          try {
            const relatedResponse = await fetch("https://api.piueducation.org/api/v2/news");
            if (relatedResponse.ok) {
              const allNews = await relatedResponse.json();
              const related = allNews
                .filter(news => news.id !== data.id)
                .slice(0, 3);
              setRelatedNews(related);
            }
          } catch (e) {
            console.log("Could not fetch related news:", e);
          }
        }
      } catch (error) {
        console.error("Error fetching news details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsDetails();
  }, [slug]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Share functions
  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = newsDetails?.title || '';
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = newsDetails?.title || '';
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const printPage = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !newsDetails) {
    return (
      <div className="max-w-7xl mx-auto my-10 px-4">
        <div className="text-center py-20">
          <div className="text-4xl text-red-600 mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "News Not Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            The news article you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/news"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            <FaArrowLeft className="mr-2" />
            Back to News
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-8 lg:my-12 px-4">
      {/* Back Button */}
      <div className="mb-6">
        <a
          href="/news"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          Back to News
        </a>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Article Content */}
        <div className="lg:w-2/3">
          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {newsDetails.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                <span>{formatDate(newsDetails.created_at)}</span>
                {formatTime(newsDetails.created_at) && (
                  <span className="ml-2">• {formatTime(newsDetails.created_at)}</span>
                )}
              </div>
              
              {newsDetails.updated_at && newsDetails.updated_at !== newsDetails.created_at && (
                <div className="text-sm text-gray-500">
                  Updated: {formatDate(newsDetails.updated_at)}
                </div>
              )}
              
              {newsDetails.user && (
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span>{newsDetails.user.name || newsDetails.user.email}</span>
                </div>
              )}
            </div>

            {/* Share Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-gray-700 font-medium">Share:</span>
              <button
                onClick={shareOnFacebook}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <FaFacebook />
                Facebook
              </button>
              <button
                onClick={shareOnTwitter}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg"
              >
                <FaTwitter />
                Twitter
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
              >
                <FaLinkedin />
                LinkedIn
              </button>
              <button
                onClick={shareOnWhatsApp}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                <FaWhatsapp />
                WhatsApp
              </button>
              <button
                onClick={printPage}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg ml-auto"
              >
                <FaPrint />
                Print
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {newsDetails.image && (
            <div className="mb-8">
              <img
                src={newsDetails.image.startsWith('http') 
                  ? newsDetails.image 
                  : `https://api.piueducation.org/storage/${newsDetails.image}`}
                alt={newsDetails.title}
                className="w-full h-auto rounded-xl shadow-lg"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                }}
              />
              {newsDetails.image_caption && (
                <p className="text-center text-gray-500 text-sm mt-2 italic">
                  {newsDetails.image_caption}
                </p>
              )}
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-lg max-w-none mb-12">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: newsDetails.body }}
            />
          </div>

          {/* Tags/Categories */}
          {newsDetails.tags && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {newsDetails.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Related News</h3>
              <div className="space-y-6">
                {relatedNews.map((news) => (
                  <a
                    key={news.id}
                    href={`/news/${news.slug}`}
                    className="block group"
                  >
                    <div className="flex gap-4">
                      {news.image && (
                        <div className="flex-shrink-0 w-20 h-20">
                          <img
                            src={news.image.startsWith('http') 
                              ? news.image 
                              : `https://api.piueducation.org/storage/${news.image}`}
                            alt={news.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                          {news.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(news.created_at)}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-600">Published:</span>
                <span className="font-medium">{formatDate(newsDetails.created_at)}</span>
              </li>
              {newsDetails.updated_at && (
                <li className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{formatDate(newsDetails.updated_at)}</span>
                </li>
              )}
              {newsDetails.user && (
                <li className="flex justify-between">
                  <span className="text-gray-600">Author:</span>
                  <span className="font-medium">{newsDetails.user.name || newsDetails.user.email}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
            <p className="mb-4 opacity-90">
              Subscribe to our newsletter for the latest news and updates.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-lg text-gray-900"
                required
              />
              <button
                type="submit"
                className="w-full bg-white text-blue-600 font-semibold px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="text-center mt-12">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2 rotate-90" />
          Back to Top
        </button>
      </div>
    </div>
  );
}