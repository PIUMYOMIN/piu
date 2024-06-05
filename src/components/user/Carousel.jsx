import React, { useEffect, useState } from "react";
import Swiper from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import LoadingSpinner from "../../components/user/LoadingSpinner";
import "swiper/swiper-bundle.css";

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("https://dashboard.piueducation.org/api/v1/slides");
        if (!response.ok) {
          throw new Error("Failed to fetch slides");
        }
        const data = await response.json();
        setSlides(data);
        setLoading(false);
      } catch (error) {
        console.error("Network error found.", error);
      }
    };

    fetchSlides();
  }, []);

  useEffect(
    () => {
      if (!loading) {
        const swiper = new Swiper(".swiper", {
          loop: true,
          spaceBetween: 30,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false
          },
          modules: [Navigation, Pagination, Autoplay],
          pagination: {
            el: ".swiper-pagination",
            clickable: true
          }
        });
        return () => {
          swiper.destroy();
        };
      }
    },
    [loading]
  );

  return !loading
    ? <div className="max-w-7xl mx-auto z-[-10] overflow-hidden relative">
        <div className="swiper">
          <div className="swiper-wrapper">
            {slides.map((slide, index) =>
              <div key={slide.id} className="swiper-slide">
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
        </div>
      </div>
    : <LoadingSpinner />;
};

export default Carousel;
