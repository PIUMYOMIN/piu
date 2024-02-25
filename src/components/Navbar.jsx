import React from "react";
import { Link } from "react-router-dom";
import profile from "../assets/profile.svg";
import cart from "../assets/cart.svg";
import { FaPhoneAlt, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import Logo from '../assets/logo.png'


export default function Navbar() {
  return <nav>
      <div className="max-w-7xl mx-auto lg:flex justify-between items-center border-b">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="object-contain w-20" />
          <div className="flex flex-col justify-between gap-0">
            <h2 className="text-3xl font-roboto text-green-700">
              Phaung Daw Oo
            </h2>
            <span className="text-2xl">International University</span>
          </div>
        </div>
        <div className="lg:flex flex-col block items-center lg:py-5 mt-2">
          <ul className="flex justify-around lg:flex-row items-center lg:gap-3">
            <li>
              <Link to="/">HOME</Link>
            </li>
            <li>
              <Link to="/courses">COURSES</Link>
            </li>
            <li>
              <Link to="/campuses">CAMPUS</Link>
            </li>
            <li>
              <Link to="/about-us">ABOUT</Link>
            </li>
            <li>
              <Link to="/contact-us">CONTACT US</Link>
            </li>
          </ul>
          <div className=" relative flex items-center w-[100%] lg:mt-3">
            <form action="">
              <div className="p-2">
                <input type="text" className="font-normal lg:border-b text-dark lg:w-96 w-[350px] lg:focus:outline-none focus:border-dark-purple px-3 py-1 lg:rounded-e-full relative" placeholder="Search..." />
              </div>
              <button className="absolute lg:top-1/2 transform -translate-y-1/2 text-slate-500 lg:p-2 cursor-pointer lg:right-10 right-4 top-6" type="submit">
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>;
}
