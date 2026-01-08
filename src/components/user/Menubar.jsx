import React, { useState } from "react";
import { FaBars, FaCaretDown, FaCaretUp, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Menu() {
  const [newsHovered, setNewsHovered] = useState(false);
  const [applicationHovered, setApplicationHovered] = useState(false);
  const [academicHovered, setAcademicHovered] = useState(false);
  const [open, setOpen] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuth();

  const handleMobileLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto z-10 font-robotoSlab">
      <div className="lg:bg-green-700 text-white lg:py-2 lg:pl-3">
        <div className="lg:flex items-center justify-between lg:py-5">
          <div 
            className="text-3xl absolute right-2 top-2 cursor-pointer lg:hidden text-dark z-50" 
            onClick={() => setOpen(!open)}
          >
            <FaBars />
          </div>
          
          <ul 
            className={`lg:flex lg:item:center lg:pb-0 pb-12 absolute lg:static lg:z-auto z-20 left-0 w-full lg:w-auto lg:pl-0 pl-5 transition-all duration-500 ease-in ${open ? "top-24 bg-green-700 text-white" : "top-[-490px]"} gap-8`}
          >
            <li className="lg:my-0 my-5">
              <Link to="/" onClick={() => setOpen(false)}>HOME</Link>
            </li>
            
            <li 
              className="relative lg:my-0 my-5" 
              onMouseEnter={() => setAcademicHovered(true)} 
              onMouseLeave={() => setAcademicHovered(false)}
            >
              <button 
                type="button" 
                id="menu-button" 
                aria-expanded={academicHovered} 
                className="flex justify-center items-center" 
                onClick={() => setAcademicHovered(!academicHovered)}
              >
                ACADEMIC {academicHovered ? <FaCaretUp /> : <FaCaretDown />}
              </button>
              
              <div 
                className={`lg:absolute bg-green-700 w-48 ${academicHovered ? "block" : "hidden"} transition-all duration-500 ease-in lg:pt-3 z-10`} 
                role="menu" 
                aria-orientation="vertical" 
                aria-labelledby="menu-button" 
                tabIndex="-1"
              >
                <ul className="px-2">
                  <li className="my-5 hover:text-gray-400" role="menuitem" tabIndex="-1" id="menu-item-0">
                    <Link to="#!" onClick={() => setOpen(false)}>Postgraduate Program</Link>
                  </li>
                  <li className="my-5 hover:text-gray-400" role="menuitem" tabIndex="-1" id="menu-item-1">
                    <Link to="#!" onClick={() => setOpen(false)}>Undergraduate Program</Link>
                  </li>
                  <li className="my-5 hover:text-gray-400" role="menuitem" tabIndex="-1" id="menu-item-2">
                    <Link to="#!" onClick={() => setOpen(false)}>Certificate Program</Link>
                  </li>
                </ul>
              </div>
            </li>
            
            <li 
              className="relative lg:my-0 my-5" 
              onMouseEnter={() => setNewsHovered(true)} 
              onMouseLeave={() => setNewsHovered(false)}
            >
              <button 
                type="button" 
                id="menu-button" 
                aria-expanded={newsHovered} 
                className="flex justify-center items-center" 
                onClick={() => setNewsHovered(!newsHovered)}
              >
                NEWS{newsHovered ? <FaCaretUp /> : <FaCaretDown />}
              </button>
              
              <div 
                className={`lg:absolute bg-green-700 w-48 ${newsHovered ? "block" : "hidden"} transition-all duration-500 ease-in lg:pt-3 z-10`} 
                role="menu" 
                aria-orientation="vertical" 
                aria-labelledby="menu-button" 
                tabIndex="-1"
              >
                <ul className="px-2">
                  <li className="my-5 hover:text-gray-400" role="menuitem" tabIndex="-1" id="menu-item-0">
                    <Link to="/news" onClick={() => setOpen(false)}>News & Events</Link>
                  </li>
                  <li className="my-5 hover:text-gray-400" role="menuitem" tabIndex="-1" id="menu-item-1">
                    <Link to="#!" onClick={() => setOpen(false)}>Announcements</Link>
                  </li>
                </ul>
              </div>
            </li>
            
            <li className="lg:my-0 my-5">
              <Link to="/about-us" onClick={() => setOpen(false)}>ABOUT</Link>
            </li>
            
            {/* Mobile Login/Logout - Only shown on mobile */}
            <li className="md:hidden block lg:my-0 my-5">
              {isAuthenticated ? (
                <div className="flex flex-col">
                  <div className="mb-2 text-sm">
                    <span className="font-medium">{user?.name || 'User'}</span>
                  </div>
                  <button 
                    onClick={handleMobileLogout}
                    className="text-left hover:text-gray-400 transition-colors"
                  >
                    LOGOUT
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  LOGIN
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}