import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import logo from "../../assets/logo.png";

const TeacherNavbar = ({ toggleSidebar, teacherName }) => {
  return (
    <nav className="bg-[#002147] text-white px-4 sm:px-6 py-3 flex justify-between items-center shadow-md z-50 fixed top-0 left-0 right-0">
      
      {/* LEFT SIDE */}
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
          Phaung Daw Oo <br className="hidden md:block" />
          International University
        </span>

        <span className="text-sm font-semibold sm:hidden">PDO University</span>
      </div>

      {/* RIGHT – Dynamic Teacher Dashboard */}
      <h1 className="text-base sm:text-lg md:text-xl font-semibold tracking-wide">
        {teacherName ? `${teacherName}'s Dashboard` : "Teacher Dashboard"}
      </h1>
    </nav>
  );
};

export default TeacherNavbar;
