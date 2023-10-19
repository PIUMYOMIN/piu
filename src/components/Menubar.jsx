import React, { useState } from "react";
import { FaBars, FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Menu() {
  let [open, setOpen] = useState(false);
  const [courseDropDownOpen, setCourseDropDownOpen] = useState(false);

  const toggleCourseDropDown = () => {
    setCourseDropDownOpen(!courseDropDownOpen);
  };

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
          <li
            className={`relative group cursor-pointer ${courseDropDownOpen &&
              "hover-dropdown"}`}
            onMouseEnter={() => setCourseDropDownOpen(true)}
            onMouseLeave={() => setCourseDropDownOpen(false)}
          >
            <Link to="/courses" onClick={toggleCourseDropDown}>
              Courses
            </Link>
            <div
              className={`md:absolute left-0 ${courseDropDownOpen
                ? "block"
                : "hidden"} bg-dark-purple text-white w-40 shadow-md`}
            >
              <ul>
                <li className="my-5">
                  <Link to="/course1">Course 1</Link>
                </li>
                <li className="my-5">
                  <Link to="/course2">Course 2</Link>
                </li>
                <li className="my-5">
                  <Link to="/course3">Course 3</Link>
                </li>
              </ul>
            </div>
            <div
              className={`absolute md:hidden top-2 right-3 ${courseDropDownOpen
                ? "plus-minus"
                : ""}`}
              onClick={toggleCourseDropDown}
            >
              {courseDropDownOpen ? <FaMinus /> : <FaPlus />}
            </div>
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
