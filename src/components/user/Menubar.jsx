import React, { useState } from "react";
import { FaBars, FaCaretDown, FaCaretUp, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Menu() {
  const [open, setOpen] = useState(false);

  const [newsHovered, setNewsHovered] = useState(false);
  const [applicationHovered, setApplicationHovered] = useState(false);
  const [academicHovered, setAcademicHovered] = useState(false);

  return <div className="max-w-7xl mx-auto z-10 font-robotoSlab">
      <div className="lg:bg-dark-purple text-white lg:py-2 lg:pl-3">
        <div className="lg:flex items-center justify-between lg:py-5">
          <div className="text-3xl absolute right-2 top-2 cursor-pointer lg:hidden text-dark z-50" onClick={() => setOpen(!open)}>
            <FaBars />
          </div>
          <ul className={`lg:flex lg:item:center lg:pb-0 pb-12 absolute lg:static lg:z-auto z-20 left-0 w-full lg:w-auto lg:pl-0 pl-5 transition-all duration-500 ease-in ${open ? "top-24 bg-dark-purple text-white" : "top-[-490px]"} gap-8`}>
            <li className="lg:my-0 my-5">
              <Link to="/">HOME</Link>
            </li>
            <li className="relative lg:my-0 my-5" onMouseEnter={() => setAcademicHovered(true)} onMouseLeave={() => setAcademicHovered(false)}>
              <button type="button" id="menu-button" aria-expanded={academicHovered} className="flex justify-center items-center" onClick={() => setAcademicHovered(!academicHovered)}>
                ACADEMIC {academicHovered ? <FaCaretUp /> : <FaCaretDown />}
              </button>
              <div className={`lg:absolute bg-dark-purple w-48 
              ${academicHovered ? "block" : "hidden"}
              transition-all duration-500 ease-in lg:pt-3 z-10`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                <ul className="px-2">
                  <li className="my-5 hover:text-gray-400" role="menuitem" tabIndex="-1" id="menu-item-0">
                    <Link to="#!">Postgraduate Program</Link>
                  </li>
                  <li className="my-5 hover:text-gray-400" role="menuitem" tabIndex="-1" id="menu-item-1">
                    <Link to="#!">Undergraduate Program</Link>
                  </li>
                  <li className="my-5 hover:text-gray-400" role="menuitem" tabIndex="-1" id="menu-item-2">
                    <Link to="#!">Certificate Program</Link>
                  </li>
                </ul>
              </div>
            </li>
            <li className="relative lg:my-0 my-5" onMouseEnter={() => setNewsHovered(true)} onMouseLeave={() => setNewsHovered(false)}>
              <button type="button" id="menu-button" aria-expanded={newsHovered} className="flex justify-center items-center" onClick={() => setNewsHovered(!newsHovered)}>
                NEWS{newsHovered ? <FaCaretUp /> : <FaCaretDown />}
              </button>
              <div className={`lg:absolute bg-dark-purple w-48 ${newsHovered ? "block" : "hidden"} transition-all duration-500 ease-in lg:pt-3 z-10`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                <ul className="px-2">
                  <li className="my-5 hover:text-gray-400" role="menuitem" tabIndex="-1" id="menu-item-0">
                    <Link to="/news">News & Events</Link>
                  </li>
                  <li className="my-5 hover:text-gray-400" role="menuitem" tabIndex="-1" id="menu-item-1">
                    <Link to="#!">Announcements</Link>
                  </li>
                </ul>
              </div>
            </li>
            {/* <li
              className="relative lg:my-0 my-5"
              onMouseEnter={() => setApplicationHovered(true)}
              onMouseLeave={() => setApplicationHovered(false)}
            >
              <button
                type="button"
                id="menu-button"
                aria-expanded={applicationHovered}
                className="flex justify-center items-center"
                onClick={() => setApplicationHovered(!applicationHovered)}
              >
                ADMISSION{applicationHovered ? <FaCaretUp /> : <FaCaretDown />}
              </button>
              <div
                className={`lg:absolute bg-dark-purple w-48 ${applicationHovered
                  ? "block"
                  : "hidden"} transition-all duration-500 ease-in lg:pt-3 z-10`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <ul className="px-2">
                  <li
                    className="my-5 hover:text-gray-400"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-0"
                  >
                    <Link to="/admissions/application-form">
                      Application Form
                    </Link>
                  </li>
                </ul>
              </div>
            </li> */}
            <li className="lg:my-0 my-5">
              <Link to="/about-us">ABOUT</Link>
            </li>
            <li className="md:hidden block lg:my-0 my-5">
              <Link to="https://dashboard.piueducation.org" target="_blank">
                LOGIN
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>;
}
