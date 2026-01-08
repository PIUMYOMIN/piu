import React, { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaBook, FaUserGraduate, FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaCog, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.png";

const AdminNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const accountRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsAccountOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/piu/admin/profile");
    setIsAccountOpen(false);
  };

  const handleChangePassword = () => {
    navigate("/piu/admin/change-password");
    setIsAccountOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-[#002147] to-[#003366] text-white px-4 sm:px-6 py-3 flex justify-between items-center shadow-lg z-50 fixed top-0 left-0 right-0 h-16 md:h-18">
      {/* Left Side - Logo and Toggle */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-[#001933] transition-colors"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
        
        <Link to="/piu/admin" className="flex items-center space-x-3">
          <img
            src={logo}
            alt="University Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
          />
          <div className="hidden sm:block">
            <span className="text-sm sm:text-base font-semibold">
              Phaung Daw Oo
            </span>
            <span className="block text-xs sm:text-sm text-gray-300">
              International University
            </span>
          </div>
        </Link>
      </div>

      {/* Center - Quick Links for Desktop */}
      <div className="hidden lg:flex items-center space-x-8">
        <Link 
          to="/piu/admin/admission" 
          className="flex items-center space-x-2 hover:text-blue-200 transition-colors"
        >
          <FaUserGraduate />
          <span>Admissions</span>
        </Link>
        <Link 
          to="/piu/admin/list" 
          className="flex items-center space-x-2 hover:text-blue-200 transition-colors"
        >
          <FaBook />
          <span>Courses</span>
        </Link>
        <Link 
          to="/" 
          target="_blank"
          className="flex items-center space-x-2 hover:text-blue-200 transition-colors"
        >
          <FaHome />
          <span>Main Site</span>
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Messages */}
          <div className="relative group">
            <Link to="/piu/admin/inbox" className="relative hover:text-blue-200 transition-colors">
              <FaEnvelope size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Link>
            <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Messages (3 unread)
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium">{user?.name || 'Admin User'}</div>
              <div className="text-xs text-gray-300">{user?.role || 'Administrator'}</div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 rounded-md hover:bg-[#001933] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* My Account */}
        <div className="relative account-menu" ref={accountRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAccountOpen(!isAccountOpen);
            }}
            className="hover:text-blue-200 transition-colors flex items-center space-x-2"
          >
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium truncate max-w-[120px]">
                {user?.name?.split(' ')[0] || 'User'}
              </div>
            </div>
            <div className="relative">
              <FaUserCircle size={24} />
              <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full border border-white"></span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isAccountOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden">
              {/* User Info */}
              <div className="px-4 py-3 bg-gray-50 border-b">
                <div className="font-medium text-gray-900 truncate">
                  {user?.name || 'Admin User'}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {user?.email || 'admin@university.edu'}
                </div>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user?.role || 'Administrator'}
                  </span>
                </div>
              </div>
              
              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FaUserCircle className="mr-3 text-gray-400" />
                  Profile Settings
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FaCog className="mr-3 text-gray-400" />
                  Change Password
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-gradient-to-b from-[#002147] to-[#001933] border border-gray-700 rounded-lg shadow-xl lg:hidden z-50">
          <div className="px-4 py-3 border-b border-gray-700">
            <div className="font-medium">{user?.name || 'Admin User'}</div>
            <div className="text-sm text-gray-300">{user?.role || 'Administrator'}</div>
          </div>
          
          <div className="py-2">
            <Link 
              to="/piu/admin/admission" 
              className="flex items-center px-4 py-3 hover:bg-[#002147] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaUserGraduate className="mr-3" />
              Admissions
            </Link>
            <Link 
              to="/piu/admin/list" 
              className="flex items-center px-4 py-3 hover:bg-[#002147] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaBook className="mr-3" />
              Courses
            </Link>
            <Link 
              to="/piu/admin/inbox" 
              className="flex items-center px-4 py-3 hover:bg-[#002147] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaEnvelope className="mr-3" />
              Messages
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Link>
            <Link 
              to="/" 
              target="_blank"
              className="flex items-center px-4 py-3 hover:bg-[#002147] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaHome className="mr-3" />
              Main Site
            </Link>
          </div>
          
          <div className="border-t border-gray-700 py-2">
            <button
              onClick={handleProfileClick}
              className="flex items-center w-full text-left px-4 py-3 hover:bg-[#002147] transition-colors"
            >
              <FaUserCircle className="mr-3" />
              Profile Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-3 hover:bg-[#002147] text-red-400 transition-colors"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;