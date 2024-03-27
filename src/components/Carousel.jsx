import React, { useEffect, useState } from "react";
import Swiper from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Carousel() {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("https://piueducation.org/api/v1/slides");
        if (!response.ok) {
          throw new Error("Failed to fetch slides");
        }
        const data = await response.json();
        setSlides(data);
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
        el: ".swiper-pagination",
        clickable: true
      }
    });
    return () => {
      swiper.destroy();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto z-[-10] overflow-hidden">
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
                <div className="flex flex-row justify-between px-2 py-2 text-xs text-white">
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
    </div>
  );
}
