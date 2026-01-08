import React, { useState, useEffect } from "react";
import { FaEnvelope, FaBook, FaUserGraduate, FaUserCircle, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"

const AdminNavbar = ({ toggleSidebar }) => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".account-menu")) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#002147] text-white px-4 sm:px-6 py-3 flex justify-between items-center shadow-md z-50 fixed top-0 left-0 right-0">
      {/* Left Side - Logo and Toggle */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-[#001933] mr-2"
        >
          <FaBars size={20} />
        </button>
        
        <img
          src={logo}
          alt="University Logo"
          className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 object-contain"
        />
        <span className="text-sm sm:text-base md:text-lg font-semibold hidden sm:block">
          Phaung Daw Oo <br className="hidden md:block"/> International University
        </span>
        <span className="text-sm font-semibold sm:hidden">PDO University</span>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4 sm:space-x-6 relative">
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 rounded-md hover:bg-[#001933]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* All Query Message */}
          <div className="relative group">
            <Link to="/queries" className="hover:text-gray-300">
              <FaEnvelope size={20} />
            </Link>
            <span className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              All Query Message
            </span>
          </div>

          {/* Course Booking Message */}
          <div className="relative group">
            <Link to="/course-bookings" className="hover:text-gray-300">
              <FaBook size={20} />
            </Link>
            <span className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              Course Booking
            </span>
          </div>

          {/* Admission Query */}
          <div className="relative group">
            <Link to="/admissions" className="hover:text-gray-300">
              <FaUserGraduate size={20} />
            </Link>
            <span className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              Admission Query
            </span>
          </div>
        </div>

        {/* My Account */}
        <div className="relative account-menu border-l-2 pl-4 sm:pl-6 md:pl-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAccountOpen((prev) => !prev);
            }}
            className="hover:text-gray-300 flex items-center"
          >
            <FaUserCircle size={22} />
          </button>

          {/* Dropdown Menu */}
          {isAccountOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Profile Settings
              </Link>
              <button
                onClick={() => alert("Logging out...")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-[#002147] border border-gray-700 rounded shadow-lg lg:hidden z-50">
          <Link to="/queries" className="block px-4 py-3 hover:bg-[#001933] flex items-center">
            <FaEnvelope className="mr-2" size={16} />
            All Query Message
          </Link>
          <Link to="/course-bookings" className="block px-4 py-3 hover:bg-[#001933] flex items-center">
            <FaBook className="mr-2" size={16} />
            Course Booking
          </Link>
          <Link to="/admissions" className="block px-4 py-3 hover:bg-[#001933] flex items-center">
            <FaUserGraduate className="mr-2" size={16} />
            Admission Query
          </Link>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;