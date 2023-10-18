import React from "react";
import { Link } from "react-router-dom";
import profile from "../assets/profile.svg";
import cart from "../assets/cart.svg";
import { FaPhoneAlt, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import Logo from '../assets/logo.png'


export default function Navbar() {
  return <nav>
      <div className="max-w-7xl mx-auto lg:flex md:block justify-between items-center border-b">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="object-contain w-20" />
          <div className="flex flex-col justify-between gap-0">
            <h2 className="text-3xl font-roboto text-green-700">
              Phaung Daw Oo
            </h2>
            <span className="text-2xl">International University</span>
          </div>
        </div>
        <div className="lg:flex flex-col md:block items-center md:py-5">
          <ul className="flex justify-around md:flex-row items-center gap-3">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/campuses">Campuses</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="contact">Contact us</Link>
            </li>
          </ul>
          <div className=" relative flex items-center w-[100%] md:mt-3">
            <form action="">
              <div className="p-2">
                <input type="text" className="font-normal lg:border-b text-dark lg:w-96 w-[350px] lg:focus:outline-none focus:border-dark-purple lg:focus:border px-3 py-1 lg:rounded-e-full relative" placeholder="Search..." />
              </div>
              <button className="absolute lg:right-3 lg:top-1/2 transform -translate-y-1/2 text-slate-500 md:p-2 cursor-pointer md:right-10 right-4 top-6" type="submit">
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>;
}
