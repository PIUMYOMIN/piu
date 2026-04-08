import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUserCircle, FaCaretDown, FaSignOutAlt } from "react-icons/fa";
import Logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";

function getUserRole(user) {
  const raw = user?.role ?? (Array.isArray(user?.roles) ? user.roles[0] : "");
  return String(raw || "").toLowerCase();
}

function getProfilePathByRole(role) {
  if (role === "admin") return "/piu/admin/profile";
  if (role === "student") return "/piu/student";
  if (role === "teacher") return "/piu/teacher";
  if (role === "user") return "/piu/user";
  return "/login";
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const role = getUserRole(user);

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

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchTerm("");
  };

  return (
    <nav>
      <div className="max-w-7xl mx-auto lg:flex justify-between items-center">
        <Link to="/">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="object-contain w-20" loading="eager" decoding="async" />
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
                        <Link
                          to={getProfilePathByRole(role)}
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <FaUserCircle className="mr-2 text-gray-500" />
                          Profile
                        </Link>

                        {role === "admin" && (
                          <Link
                            to="/piu/admin"
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <i className="fas fa-gauge mr-2 text-gray-500"></i>
                            Dashboard
                          </Link>
                        )}

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
          
          <div className="relative flex items-center w-full lg:mt-3 px-2">
            <form onSubmit={handleSearchSubmit} className="w-full max-w-md mx-auto lg:mx-0">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-gray-700 shadow-sm focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="Search courses, news, events..."
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-green-700"
                  type="submit"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}