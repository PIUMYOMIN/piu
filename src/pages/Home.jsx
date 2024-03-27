import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";
import Courses from "../components/Courses";
import News from "../components/News";
import Aos from "aos";
import "aos/dist/aos.css";
import about from "../assets/about_piu.jpg";
import { FaFacebook, FaYoutube, FaTelegram, FaUsers } from "react-icons/fa";

export default function Home() {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  });
  return (
    <div>
      {/* carosel section start  */}
      <Carousel />
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
      <Courses />
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
      <News />
      {/* news section end  */}
    </div>
  );
}
