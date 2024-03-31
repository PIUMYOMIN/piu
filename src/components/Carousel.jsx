import React, { useEffect, useState } from "react";
import Swiper from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const LoadingSpinner = () =>
  <div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
  </div>;

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("https://piueducation.org/api/v1/slides");
        if (!response.ok) {
          throw new Error("Failed to fetch slides");
        }
        const data = await response.json();
        setSlides(data);
        setLoading(false); // Set loading to false when fetching completes
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    const swiper = new Swiper(".swiper", {
      loop: true,
      spaceBetween: 30,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      modules: [Navigation, Pagination, Autoplay],
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      pagination: {
        // el: ".swiper-pagination",
        clickable: true
      }
    });
    return () => {
      swiper.destroy();
    };
  }, []);

  return <div className="max-w-7xl mx-auto z-[-10] overflow-hidden relative">
      {loading && <LoadingSpinner />} {/* Conditional rendering of loading spinner */}
      <div className="swiper">
        <div className="swiper-wrapper">
          {slides.map((slide, index) =>
            <div key={index} className="swiper-slide">
              <img
                src={`https://piueducation.org/storage/${slide.slide_image}`}
                alt=""
                className="w-full"
              />
              <div className=" bg-black opacity-70">
                <div className="flex flex-row justify-between px-2 py-2 text-sm text-white">
                  <p>
                    {slide.title}
                  </p>
                  <p>
                    {new Date(slide.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="swiper-pagination" />
        <div className="swiper-button-prev" />
        <div className="swiper-button-next" />
      </div>
    </div>;
};

export default Carousel;
