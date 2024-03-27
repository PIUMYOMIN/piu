import React from "react";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import student from "../assets/IMG_0233.jpg";
import ppg from "../assets/piu_ppg.jpg";
import richard from "../assets/Richard's Class.jpg";

export default function News() {
  return (
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
          <Link
            to="#!"
            className="flex flex-col overflow-hidden"
            data-aos="fade-up"
          >
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
          <Link
            to="#!"
            className="flex flex-col overflow-hidden"
            data-aos="fade-up"
          >
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
          <Link
            to="#!"
            className="flex flex-col overflow-hidden"
            data-aos="fade-up"
          >
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
          <Link
            to="#!"
            className="flex flex-col overflow-hidden"
            data-aos="fade-up"
          >
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
          <Link
            to="#!"
            className="flex flex-col overflow-hidden"
            data-aos="fade-up"
          >
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
          <Link
            to="#!"
            className="flex flex-col overflow-hidden"
            data-aos="fade-up"
          >
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
          <Link
            to="#!"
            className="flex flex-col overflow-hidden"
            data-aos="fade-up"
          >
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
  );
}
