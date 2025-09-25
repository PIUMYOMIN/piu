import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from "../../components/user/Carousel";
import Courses from "../../components/user/Courses";
import News from "../../components/user/News";
import Gallery from "../../components/user/Gallery";
import Followers from "../../components/user/Followers";
import President from "../../components/user/President";
import Aos from "aos";
import "aos/dist/aos.css";
import president from "../../assets/president.jpg";

export default function Home() {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  return <div>
      {/* about section start  */}
      <div className="w-full">
        <div className=" max-w-7xl mx-auto lg:p-10 p-2 bg-secondary-background">
          <div className="max-w-4xl mx-auto lg:grid grid-cols-2">
            <div className="flex lg:justify-end justify-center items-center lg:pr-10">
              <img src={president} alt="President" className="object-cover w-60" />
            </div>
            <div className="flex flex-row font-nato">
              <div className="flex flex-col gap-3 py-3">
                <p className="text-2xl lg:py-2 font-montserrat font-regular lg:text-left text-center">
                  About PIU
                </p>
                <p>
                  25th years ago Phaung Daw Oo monastic education school was
                  established by the two brothers, Ven Nayaka and Ven Jotika.
                  During eight years times the school has been developed from
                  primary to high school level: In 1993 Primary, In 1998
                  Secondary, In 2000 High School. In 2011 the principal and
                  his colleagues attended an annual conference of
                  International Network of Engage Buddhist (INEB).
                </p>
                <div className="mt-3">
                  <Link to="/about-us" className="px-3 py-2 bg-blue-400 text-white rounded-md cursor-pointer">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* about section end  */}

      {/* carosel section start  */}
      <Carousel />
      {/* carousel section end  */}

      {/* courses section start */}
      <Courses />
      {/* course section end */}

      {/* follower section start  */}

      <Followers />

      {/* follower section end  */}

      {/* news section start  */}
      <News />
      {/* news section end  */}

      {/* gallery section start  */}
      <Gallery />
      {/* gallery section end  */}

      {/* gallery section start  */}
      <President />
      {/* gallery section end  */}
    </div>;
}
