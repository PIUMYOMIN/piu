import React from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProfileAvatar from "../common/ProfileAvatar";
import logo from "../../assets/logo.png";

const StudentNavbar = ({ toggleSidebar, studentName }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-[#002147] text-white px-4 sm:px-6 py-3 flex justify-between items-center shadow-md z-50 fixed top-0 left-0 right-0">
      
      {/* Left side stays same */}
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

        <span className="text-sm sm:text-base md:text-lg font-semibold hidden sm:block leading-tight">
          Phaung Daw Oo <br className="hidden md:block" />
          International University
        </span>

        <span className="text-sm font-semibold sm:hidden">PDO University</span>
      </div>

      {/* Right side – Name + Logout */}
      <div className="flex items-center gap-2 sm:gap-4">
        <ProfileAvatar user={user} size="sm" className="hidden border-white/30 sm:block" />
        <h1 className="hidden text-base font-semibold tracking-wide sm:block md:text-lg lg:text-xl">
          {studentName ? `${studentName}'s Dashboard` : "Student Dashboard"}
        </h1>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
          aria-label="Logout"
        >
          <FaSignOutAlt />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

    </nav>
  );
};

export default StudentNavbar;
