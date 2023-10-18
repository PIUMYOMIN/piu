import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Logo() {
  let [open, setOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto z-10 lg:bg-dark-purple text-white md:py-2 lg:pl-3">
      <div className="md:flex items-center justify-between">
        <div
          className="text-3xl absolute right-2 top-2 cursor-pointer md:hidden text-dark z-50"
          onClick={() => setOpen(!open)}
        >
          <FaBars />
        </div>
        <ul
          className={`md:flex md:item:center md:pb-0 pb-12 absolute md:static md:z-auto z-20 left-0 w-full md:w-auto md:pl-0 pl-5 transition-all duration-500 ease-in ${open
            ? "top-20 bg-dark-purple text-white"
            : "top-[-490px]"} gap-3`}
        >
          <li className="md:my-0 my-5">
            <Link to="">Home</Link>
          </li>
          <li className="md:my-0 my-5">
            <Link to="/courses">Courses</Link>
          </li>
          <li className="md:my-0 my-5">
            <Link to="/campuses">Campuses</Link>
          </li>
          <li className="md:my-0 my-5">
            <Link to="/about">About</Link>
          </li>
          <li className="md:my-0 my-5">
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
