import React, { useEffect, useState } from "react";
import Swiper from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import LoadingSpinner from "./LoadingSpinner";
import "swiper/swiper-bundle.css";
import { v2 } from "../../api/v2";
import { toStorageUrl } from "../../api/axios";

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await v2.getSlides();
        
        // Handle image URLs
        const processedSlides = data.map(slide => {
          let imageUrl = slide.slide_image || slide.image;
          
          // If image doesn't start with http, prepend storage URL
          imageUrl = toStorageUrl(imageUrl) || imageUrl;
          
          return {
            ...slide,
            slide_image: imageUrl
          };
        });
        
        setSlides(processedSlides);
        setLoading(false);
      } catch (error) {
        console.error("Network error found.", error);
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (!loading && slides.length > 0) {
      const swiper = new Swiper(".swiper", {
        loop: true,
        spaceBetween: 0,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        modules: [Navigation, Pagination, Autoplay],
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
      });
      return () => {
        swiper.destroy();
      };
    }
  }, [loading, slides]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // If no slides, show nothing or a placeholder
  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto z-[-10] overflow-hidden relative">
      <div className="swiper">
        <div className="swiper-wrapper">
          {slides.map((slide, index) => (
            <div key={slide.id || index} className="swiper-slide">
              <img
                src={slide.slide_image}
                alt={slide.title || "Slide"}
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80";
                }}
              />
              <div className="bg-black opacity-70">
                <div className="flex flex-row justify-between px-4 py-2 text-sm text-white">
                  <p className="font-medium truncate mr-2">
                    {slide.title || "News & Update"}
                  </p>
                  <p className="text-gray-300 whitespace-nowrap">
                    {slide.created_at
                      ? new Date(slide.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Recent"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="swiper-pagination" />
      </div>
    </div>
  );
};

export default Carousel;