import React, { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Modal from "react-modal";
import LoadingSpinner from "../../components/user/LoadingSpinner";
import { Link } from "react-router-dom";
import {
  FaTag,
  FaCalendar,
  FaUser,
  FaSearch,
  FaFilter,
  FaTimes,
  FaExternalLinkAlt,
  FaImages,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";

Modal.setAppElement("#root");

export default function Gallery() {
  const [galleries, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [uniqueTags, setUniqueTags] = useState([]);
  const [filteredGalleries, setFilteredGalleries] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try multiple endpoints if needed
        const response = await fetch("https://api.piueducation.org/api/v2/gallery");
        
        if (!response.ok) {
          // Try alternative endpoint
          const altResponse = await fetch("https://api.piueducation.org/api/v1/gallery");
          if (!altResponse.ok) {
            throw new Error(`Failed to fetch gallery: ${response.status}`);
          }
          const data = await altResponse.json();
          processGalleryData(data);
        } else {
          const data = await response.json();
          processGalleryData(data);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
        setError("Unable to load gallery images. Please try again later.");
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Process gallery data
  const processGalleryData = (data) => {
    // Handle both array and object responses
    const galleryData = Array.isArray(data) ? data : (data.data || []);
    
    // Extract unique tags
    const tags = [...new Set(galleryData
      .map(item => item.image_tag)
      .filter(tag => tag && tag.trim() !== '')
    )];
    
    setUniqueTags(tags);
    setGallery(galleryData);
    setFilteredGalleries(galleryData);
    setLoading(false);
  };

  // Apply filters
  useEffect(() => {
    let filtered = galleries;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(gallery => 
        gallery.image_tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gallery.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tag filter
    if (selectedTag !== "all") {
      filtered = filtered.filter(gallery => 
        gallery.image_tag === selectedTag
      );
    }

    setFilteredGalleries(filtered);
  }, [galleries, searchTerm, selectedTag]);

  const maxImages = 9;
  const limitedGalleries = filteredGalleries.slice(0, maxImages);

  const openModal = index => {
    setCurrentImageIndex(index);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Remove 'storage/' prefix if it exists
    const cleanPath = imagePath.replace(/^storage\//, '');
    return `https://api.piueducation.org/storage/${cleanPath}`;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedTag("all");
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center bg-red-50 rounded-xl p-8">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Gallery Unavailable</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            <FaSpinner className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto font-robotoSlab py-8 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          University <span className="text-blue-600">Gallery</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore moments from campus life, events, and activities at Phaung Daw Oo International University
        </p>
        
        {/* Filter Controls */}
        <div className="mt-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">

            {/* Tag Filter */}
            {uniqueTags.length > 0 && (
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full lg:w-auto"
              >
                <option value="all">All Tags</option>
                {uniqueTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            )}

            {/* Clear Filters */}
            {(searchTerm || selectedTag !== "all") && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                <FaTimes />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Stats */}
      <div className="mb-8 flex flex-wrap justify-center gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{galleries.length}</div>
          <div className="text-gray-600">Total Images</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{uniqueTags.length}</div>
          <div className="text-gray-600">Categories</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{filteredGalleries.length}</div>
          <div className="text-gray-600">Currently Showing</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:grid grid-cols-2 gap-8 mb-12">
        {/* About Section */}
        <div className="mb-8 lg:mb-0" data-aos="fade-up">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              About Our University
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                As the education in Myanmar is lasting behind so do every aspect of Myanmar. 
                Therefore, it is desperately needed to lift the status of education in Myanmar. 
                We can see that the countries which have internationally high ranking universities 
                become well developed ones in the world.
              </p>
              <p>
                To establish quality assurance university, qualified teachers and eligible 
                students are needed. As Myanmar has been deteriorating for many years, 
                qualified teachers are very difficult to have, which means no eligible 
                students become.
              </p>
              <p>
                I have been facing this broken process of education system for over a decade. 
                Good quality university students have to become from good quality basic 
                education level students i.e primary, secondary, and tertiary.
              </p>
            </div>
            <Link
              to="/about-us"
              className="inline-flex items-center mt-6 text-blue-600 hover:text-blue-800 font-medium"
            >
              Continue Reading
              <FaExternalLinkAlt className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Gallery Section */}
        <div data-aos="fade-up">
          {filteredGalleries.length > 0 ? (
            <>
              <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                <Masonry gutter="16px">
                  {limitedGalleries.map((gallery, index) => (
                    <div
                      key={gallery.id || index}
                      className="relative group overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                      onClick={() => openModal(index)}
                    >
                      <img
                        src={getImageUrl(gallery.image)}
                        alt={gallery.image_tag || 'Gallery image'}
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        {gallery.image_tag && (
                          <div className="flex items-center text-white mb-2">
                            <FaTag className="mr-2" size={14} />
                            <span className="font-medium truncate">{gallery.image_tag}</span>
                          </div>
                        )}
                        
                        {gallery.created_at && (
                          <div className="flex items-center text-white/80 text-sm">
                            <FaCalendar className="mr-2" size={12} />
                            <span>{formatDate(gallery.created_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <FaImages className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Images Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedTag !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "No gallery images available at the moment"}
              </p>
              {(searchTerm || selectedTag !== "all") && (
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Gallery Image Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="relative bg-black text-white max-w-4xl mx-auto rounded-xl overflow-hidden">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          >
            <FaTimes size={24} />
          </button>
          
          {/* Carousel */}
          <Carousel
            selectedItem={currentImageIndex}
            showThumbs={false}
            infiniteLoop
            useKeyboardArrows
            showStatus={false}
            showIndicators={filteredGalleries.length > 1}
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10"
                >
                  ←
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10"
                >
                  →
                </button>
              )
            }
          >
            {filteredGalleries.map((gallery, index) => (
              <div key={gallery.id || index} className="relative">
                <img
                  src={getImageUrl(gallery.image)}
                  alt={gallery.image_tag || 'Gallery image'}
                  className="w-full max-h-[70vh] object-contain"
                />
                
                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  {gallery.image_tag && (
                    <h3 className="text-xl font-bold text-white mb-2">
                      {gallery.image_tag}
                    </h3>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-white/80">
                    {gallery.created_at && (
                      <div className="flex items-center">
                        <FaCalendar className="mr-2" />
                        <span>{formatDate(gallery.created_at)}</span>
                      </div>
                    )}
                    
                    {gallery.user?.name && (
                      <div className="flex items-center">
                        <FaUser className="mr-2" />
                        <span>By {gallery.user.name}</span>
                      </div>
                    )}
                    
                    {gallery.link1 && (
                      <a
                        href={gallery.link1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-300 hover:text-blue-100"
                      >
                        <FaExternalLinkAlt className="mr-2" />
                        Related Link
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
          
          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {filteredGalleries.length}
          </div>
        </div>
      </Modal>

      {/* Styles */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          position: relative;
          background: transparent;
          border: none;
          outline: none;
          max-width: 90vw;
          max-height: 90vh;
        }
        
        @media (max-width: 768px) {
          .modal-content {
            max-width: 95vw;
            max-height: 95vh;
          }
        }
      `}</style>
    </div>
  );
}