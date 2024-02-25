import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import Swiper from "swiper";
import "swiper/css";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import img1 from "../assets/1.png";
import img2 from "../assets/2.png";
import img3 from "../assets/3.png";
import student from "../assets/IMG_0233.jpg";
import about from "../assets/about_piu.jpg";
import english from "../assets/diploma_in_english.jpg";
import tourism from "../assets/1.jpg";
import computer from "../assets/2.jpg";
import social from "../assets/4.jpg";
import ppg from "../assets/piu_ppg.jpg";
import richard from "../assets/Richard's Class.jpg";
import {
  FaCalendarCheck,
  FaAngleRight,
  FaFacebook,
  FaYoutube,
  FaTelegram,
  FaUsers
} from "react-icons/fa";

export default function Home() {
  useEffect(() => {
    const swiper = new Swiper(".swiper", {
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      modules: [Navigation, Pagination],
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      }
    });
    return () => {
      swiper.destroy();
    };
    Aos.init({ duration: 2000 });
  }, []);
  return (
    <div>
      {/* carosel section start  */}
      <div className="max-w-7xl mx-auto z-[-10] overflow-hidden">
        <div className="swiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <img src={img1} alt="" className="w-full" />
              <div className="bg-gray-950 opacity-20">
                <div className="flex flex-row justify-between px-2 py-2 text-xs text-white">
                  <p>Phaung Daw Oo International University</p>
                  <p>12:00 PM 07 Oct 2024</p>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <img src={img2} alt="" className="w-full" />
              <div className="bg-gray-950 opacity-20">
                <div className="flex flex-row justify-between px-2 py-2 text-xs text-white">
                  <p>Phaung Daw Oo International University</p>
                  <p>12:00 PM 07 Oct 2024</p>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <img src={img3} alt="" className="w-full" />
              <div className="bg-gray-950 opacity-20">
                <div className="flex flex-row justify-between px-2 py-2 text-xs text-white">
                  <p>Phaung Daw Oo International University</p>
                  <p>12:00 PM 07 Oct 2024</p>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-pagination" />
          <div className="swiper-button-prev" />
          <div className="swiper-button-next" />
        </div>
      </div>
      {/* carousel section end  */}

      {/* about section start  */}
      <div className="w-full">
        <div className=" max-w-5xl mx-auto">
          <div className="lg:flex flex-row justify-center items-center my-5 py-5 bg-primary-background">
            <div className="lg:w-1/2 flex justify-center items-center">
              <img src={about} alt="" className="object-cover lg:w-80 w-72" />
            </div>
            <div className="lg:w-1/2 flex flex-row font-nato">
              <div className="flex flex-col gap-3 py-3">
                <div className="">
                  <p className="text-3xl lg:py-2 font-montserrat font-regular lg:text-left text-center">
                    About PIU
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Debitis vero totam ipsa facere cumque officia odio sunt eum
                    enim libero quis blanditiis, quos culpa ad error nihil
                    doloribus laudantium voluptatem impedit adipisci rem? Unde
                    magnam tenetur quia iure, iste eum sed repellat architecto
                    porro, quaerat aliquam dolores deleniti quod maxime?
                  </p>
                  <div className="mt-3">
                    <Link
                      to="/about-us"
                      className="px-3 py-2 bg-blue-400 text-white rounded-md cursor-pointer"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* about section end  */}

      {/* courses section start */}
      <div className="w-full bg-secondary-background lg:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mt-8 mb-10">
            <h2 className="text-2xl font-montserrat font-medium">
              Our Departments
            </h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              excepturi beatae vel doloribus eveniet corrupti.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 sm:grid-1 gap-x-10 lg:gap-y-10 gap-y-10 py-5">
            <Link
              to="#!"
              className="md:mb-2 w-96 hover:shadow-2xl transition duration-300 ease-in-out rounded-md"
            >
              <div className="overflow-hidden h-60">
                <img
                  src={student}
                  alt=""
                  className="object-contain hover:scale-105 transition duration-300 ease-out"
                />
              </div>
              <div className=" pl-8 flex flex-col">
                <div className="text-xl pr-2 my-3 hover:text-orange-500">
                  Master's of Science in Social Entrepreneurship
                </div>
                <div className="flex flex-row justify-between text-zinc-400">
                  <div>
                    <p>Faculty of PIU</p>
                  </div>
                  <div className="flex justify-center items-center pr-2">
                    <FaCalendarCheck /> &nbsp; 4 years
                  </div>
                </div>
              </div>
            </Link>
            <Link
              to="#!"
              className="md:mb-2 w-96 hover:shadow-2xl transition duration-300 ease-in-out rounded-md"
            >
              <div className="overflow-hidden h-60">
                <img
                  src={computer}
                  alt=""
                  className="object-contain hover:scale-105 transition duration-300 ease-out"
                />
              </div>
              <div className=" pl-8 flex flex-col">
                <div className="text-xl pr-2 my-3 hover:text-orange-500">
                  Master's of Science in Business Administration
                </div>
                <div className="flex flex-row justify-between text-zinc-400">
                  <div>
                    <p>Faculty of PIU</p>
                  </div>
                  <div className="flex justify-center items-center pr-2">
                    <FaCalendarCheck /> &nbsp; 4 years
                  </div>
                </div>
              </div>
            </Link>
            <Link
              to="#!"
              className="md:mb-2 w-96 hover:shadow-2xl transition duration-300 ease-in-out rounded-md"
            >
              <div className="overflow-hidden h-60">
                <img
                  src={social}
                  alt=""
                  className="object-contain hover:scale-105 transition duration-300 ease-out"
                />
              </div>
              <div className=" pl-8 flex flex-col">
                <div className="text-xl pr-2 my-3 hover:text-orange-500">
                  Bachelor's of Science in Social Science
                </div>
                <div className="flex flex-row justify-between text-zinc-400">
                  <div>
                    <p>Faculty of PIU</p>
                  </div>
                  <div className="flex justify-center items-center pr-2">
                    <FaCalendarCheck /> &nbsp; 4 years
                  </div>
                </div>
              </div>
            </Link>
            <Link
              to="#!"
              className="md:mb-2 w-96 hover:shadow-2xl transition duration-300 ease-in-out rounded-md"
            >
              <div className="overflow-hidden h-60">
                <img
                  src={english}
                  alt=""
                  className="object-contain hover:scale-105 transition duration-300 ease-out"
                />
              </div>
              <div className=" pl-8 flex flex-col">
                <div className="text-xl pr-2 my-3 hover:text-orange-500">
                  Bachelor's of Arts in English
                </div>
                <div className="flex flex-row justify-between text-zinc-400">
                  <div>
                    <p>Faculty of PIU</p>
                  </div>
                  <div className="flex justify-center items-center pr-2">
                    <FaCalendarCheck /> &nbsp; 4 years
                  </div>
                </div>
              </div>
            </Link>
            <Link
              to="#!"
              className="md:mb-2 w-96 hover:shadow-2xl transition duration-300 ease-in-out rounded-md"
            >
              <div className="overflow-hidden h-60">
                <img
                  src={tourism}
                  alt=""
                  className="object-contain hover:scale-105 transition duration-300 ease-out"
                />
              </div>
              <div className=" pl-8 flex flex-col">
                <div className="text-xl pr-2 my-3 hover:text-orange-500">
                  Bachelor's of Arts in Tourism
                </div>
                <div className="flex flex-row justify-between text-zinc-400">
                  <div>
                    <p>Faculty of PIU</p>
                  </div>
                  <div className="flex justify-center items-center pr-2">
                    <FaCalendarCheck /> &nbsp; 4 years
                  </div>
                </div>
              </div>
            </Link>
            <Link
              to="#!"
              className="md:mb-2 w-96 hover:shadow-2xl transition duration-300 ease-in-out rounded-md"
            >
              <div className="overflow-hidden h-60">
                <img
                  src={computer}
                  alt=""
                  className="object-contain hover:scale-105 transition duration-300 ease-out"
                />
              </div>
              <div className=" pl-8 flex flex-col">
                <div className="text-xl pr-2 my-3 hover:text-orange-500">
                  Bachelor of Arts in Buddhist Studies
                </div>
                <div className="flex flex-row justify-between text-zinc-400">
                  <div>
                    <p>Faculty of PIU</p>
                  </div>
                  <div className="flex justify-center items-center pr-2">
                    <FaCalendarCheck /> &nbsp; 4 years
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* course section end */}

      {/* follower section start  */}

      <div className="w-full bg-dark-purple text-white">
        <div className="max-w-7xl mx-auto py-10">
          <div className="grid lg:grid-cols-4 grid-cols-2 lg:gap-10 gap-6 font-roboto font-medium">
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="text-3xl">
                <FaFacebook />
              </div>
              <div className="flex flex-col justify-center items-center">
                <small>Facebook</small>
                <span className="text-3xl">12021</span>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="text-3xl">
                <FaYoutube />
              </div>
              <div className="flex flex-col justify-center items-center">
                <small>Youtute</small>
                <span className="text-3xl">3251</span>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="text-3xl">
                <FaTelegram />
              </div>
              <div className="flex flex-col justify-center items-center">
                <small>Telegram</small>
                <span className="text-3xl">8512</span>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="text-3xl">
                <FaUsers />
              </div>
              <div className="flex flex-col justify-center items-center">
                <small>Students</small>
                <span className="text-3xl">850</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* follower section end  */}

      {/* news section start  */}
      <div className="w-full bg-primary-background py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-row justify-between items-center my-3">
            <h2 className="text-4xl my-3 font-oswald font-medium"> NEWS</h2>
            <Link
              to="#!"
              className="flex flex-row items-center hover:underline gap-2"
            >
              <span className="text-gray-500">List All</span>
              <FaAngleRight className="lg:w-7 w-5 lg:h-7 h-5 lg:p-2 p-1 bg-gray-500 text-white rounded-full" />
            </Link>
          </div>
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-5">
            <Link to="#!" className="flex flex-col overflow-hidden">
              <img
                src={student}
                alt=""
                className="object-cover lg:h-48 h-32 hover:scale-105 transition-all duration-200 ease-in"
              />
              <div className="py-2">
                <span className="bg-blue-400 rounded-full px-2 text-white text-sm">
                  Master's Program
                </span>
                <Link to="#!" className="lg:text-xl block hover:underline">
                  PIU 2024 Admission Form Open
                </Link>
              </div>
            </Link>
            <Link to="#!" className="flex flex-col overflow-hidden">
              <img
                src={ppg}
                alt=""
                className="object-cover lg:h-48 h-32 hover:scale-105 transition-all duration-200 ease-in"
              />
              <div className="py-2">
                <span className="bg-green-900 rounded-full px-2 text-white text-sm">
                  Bachelor's Program
                </span>
                <Link to="#!" className="lg:text-xl block hover:underline">
                  President's motivational speech
                </Link>
              </div>
            </Link>
            <Link to="#!" className="flex flex-col overflow-hidden">
              <img
                src={richard}
                alt=""
                className="object-cover lg:h-48 h-32 hover:scale-105 transition-all duration-200 ease-in"
              />
              <div className="py-2">
                <span className="bg-green-900 rounded-full px-2 text-white text-sm">
                  Bachelor's Program
                </span>
                <Link to="#!" className="lg:text-xl block hover:underline">
                  Model Teaching by Richard
                </Link>
              </div>
            </Link>
            <Link to="#!" className="flex flex-col overflow-hidden">
              <img
                src={student}
                alt=""
                className="object-cover lg:h-48 h-32 hover:scale-105 transition-all duration-200 ease-in"
              />
              <div className="py-2">
                <span className=" bg-sky-900 rounded-full px-2 text-white text-sm">
                  Master's Program
                </span>
                <Link to="#!" className="lg:text-xl block hover:underline">
                  PIU 2024 Admission Form Open
                </Link>
              </div>
            </Link>
            <Link to="#!" className="flex flex-col overflow-hidden">
              <img
                src={student}
                alt=""
                className="object-cover lg:h-48 h-32 hover:scale-105 transition-all duration-200 ease-in"
              />
              <div className="py-2">
                <span className="bg-blue-400 rounded-full px-2 text-white text-sm">
                  Master's Program
                </span>
                <Link to="#!" className="lg:text-xl block hover:underline">
                  PIU 2024 Admission Form Open
                </Link>
              </div>
            </Link>
            <Link to="#!" className="flex flex-col overflow-hidden">
              <img
                src={student}
                alt=""
                className="object-cover lg:h-48 h-32 hover:scale-105 transition-all duration-200 ease-in"
              />
              <div className="py-2">
                <span className="bg-blue-400 rounded-full px-2 text-white text-sm">
                  Master's Program
                </span>
                <Link to="#!" className="lg:text-xl block hover:underline">
                  PIU 2024 Admission Form Open
                </Link>
              </div>
            </Link>
            <Link to="#!" className="flex flex-col overflow-hidden">
              <img
                src={student}
                alt=""
                className="object-cover lg:h-48 h-32 hover:scale-105 transition-all duration-200 ease-in"
              />
              <div className="py-2">
                <span className="bg-blue-400 rounded-full px-2 text-white text-sm">
                  Master's Program
                </span>
                <Link to="#!" className="lg:text-xl block hover:underline">
                  PIU 2024 Admission Form Open
                </Link>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* news section end  */}
    </div>
  );
}
