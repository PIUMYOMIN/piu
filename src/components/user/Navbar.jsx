import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUserCircle, FaCaretDown, FaSignOutAlt } from "react-icons/fa";
import Logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
  };

  return (
    <nav>
      <div className="max-w-7xl mx-auto lg:flex justify-between items-center">
        <Link to="/">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="object-contain w-20" />
            <div className="flex flex-col justify-between gap-0">
              <h2 className="text-3xl font-roboto text-green-700">
                Phaung Daw Oo
              </h2>
              <span className="text-2xl text-yellow-600">
                International University
              </span>
            </div>
          </div>
        </Link>
        <div className="lg:flex flex-col block items-center lg:py-3 mt-2">
          <ul className="flex justify-around lg:flex-row items-center lg:gap-3">
            <li className="hover:border-b border-dark-purple transition-all delay-75 ease-in-out">
              <Link to="/">HOME</Link>
            </li>
            <li className="hover:border-b border-dark-purple transition-all delay-75 ease-in-out">
              <Link to="/courses">COURSES</Link>
            </li>
            <li className="hover:border-b border-dark-purple transition-all delay-75 ease-in-out">
              <Link to="/campus">CAMPUS</Link>
            </li>
            <li className="hover:border-b border-dark-purple transition-all delay-75 ease-in-out">
              <Link to="/about-us">ABOUT</Link>
            </li>
            <li className="hover:border-b border-dark-purple transition-all delay-75 ease-in-out">
              <Link to="/contact-us">CONTACT US</Link>
            </li>
            
            {/* Auth User Icon - Only shown on md screens and above */}
            <li className="md:block hidden text-xl text-dark-purple border-dark-purple transition-all delay-75 ease-in-out relative" ref={dropdownRef}>
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-1 hover:text-green-700 transition-all delay-75 ease-in-out"
                  >
                    <FaUserCircle />
                    <FaCaretDown className={`text-sm transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.name || user?.email || 'User'}
                        </p>
                        {user?.email && (
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {user.email}
                          </p>
                        )}
                      </div>
                      
                      {user?.role && (
                        <div className="px-4 py-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <FaSignOutAlt className="mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <FaUserCircle />
                </Link>
              )}
            </li>
          </ul>
          
          <div className="relative flex items-center w-[100%] lg:mt-3">
            <form action="">
              <div className="p-2">
                <input 
                  type="text" 
                  className="font-normal lg:border-b text-dark lg:w-96 w-[350px] lg:focus:outline-none focus:border-dark-purple px-3 py-1 lg:rounded-e-full relative" 
                  placeholder="Search..." 
                />
              </div>
              <button className="absolute lg:top-1/2 transform -translate-y-1/2 text-slate-500 lg:p-2 cursor-pointer lg:right-10 right-4 top-6" type="submit">
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}