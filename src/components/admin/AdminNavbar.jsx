// import React, { useState } from "react";
// import Logo from '../../assets/logo.png';
// import { useAuth } from "../../contexts/AuthContext"
// import { useNavigate } from "react-router-dom";

// export default function adminNavbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   // const { logout } = useAuth();
//   const navigate = useNavigate();

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/piu")
//   };

//   const name = localStorage.getItem("name");
//   const email = localStorage.getItem("email");
//   const phone = localStorage.getItem("phone");
//   const address = localStorage.getItem("address");
//   const city = localStorage.getItem("city");
//   const country = localStorage.getItem("country");
//   const picture = localStorage.getItem("picture");
//   return (
//     <>
//       <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
//         <div className="px-3 py-3 lg:px-5 lg:pl-3">
//           <div className="relative flex items-center justify-between">
//             <div className="flex items-center justify-start rtl:justify-end">
//               <button
//                 data-drawer-target="logo-sidebar"
//                 data-drawer-toggle="logo-sidebar"
//                 aria-controls="logo-sidebar"
//                 type="button"
//                 className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//               >
//                 <span className="sr-only">Open sidebar</span>
//                 <svg
//                   className="w-6 h-6"
//                   aria-hidden="true"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     clipRule="evenodd"
//                     fillRule="evenodd"
//                     d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
//                   />
//                 </svg>
//               </button>
//               <a href="/piu/admin" className="flex ms-2 md:me-24">
//                 <img
//                   src={Logo}
//                   className="h-8 me-3"
//                   alt="FlowBite Logo"
//                 />
//                 <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
//                   PIU Myanmar
//                 </span>
//               </a>
//             </div>
//             <div className="flex items-center">
//               <div className="flex flex-col items-center ms-3">
//                 <div>
//                   <button
//                     type="button"
//                     className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
//                     aria-expanded={isOpen}
//                     onClick={toggleDropdown}
//                   >
//                     <span className="sr-only">Open user menu</span>
//                     {picture ? 
//                       <img
//                         className="w-8 h-8 rounded-full"
//                         src={picture}
//                         alt="user photo"
//                       /> 
//                       : 
//                       <img
//                         className="w-8 h-8 rounded-full"
//                         src={`https://piueducation.org/storage/${picture}`}
//                         alt="user photo"
//                       />
//                     }
//                   </button>
//                 </div>
//                 {isOpen &&
//                   <div
//                     className="absolute top-5 mr-32 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
//                     id="dropdown-user"
//                   >
//                     <div className="px-4 py-3" role="none">
//                       <p
//                         className="text-sm text-gray-900 dark:text-white"
//                         role="none"
//                       >
//                         {name}
//                       </p>
//                       <p
//                         className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
//                         role="none"
//                       >
//                         {email}
//                       </p>
//                     </div>
//                     <ul className="py-1" role="none">
//                       <li>
//                         <a
//                           href="#"
//                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
//                           role="menuitem"
//                         >
//                           Dashboard
//                         </a>
//                       </li>
//                       <li>
//                         <a
//                           href="#"
//                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
//                           role="menuitem"
//                         >
//                           Settings
//                         </a>
//                       </li>
//                       <li>
//                         <a
//                           href="#"
//                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
//                           role="menuitem"
//                         >
//                           Earnings
//                         </a>
//                       </li>
//                       <li>
//                         <button
//                           onClick={handleLogout}
//                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
//                           role="menuitem"
//                         >
//                           Sign out
//                         </button>
//                       </li>
//                     </ul>
//                   </div>}
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   )
// }


import React, { useState, useEffect } from "react";
import { FaEnvelope, FaBook, FaUserGraduate, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"

const AdminNavbar = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);

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
    <nav className="bg-[#002147] text-white px-6 py-3 flex justify-between items-center shadow-md z-50 fixed top-0 left-0 right-0">
      {/* Left Side */}
      <div className="flex items-center space-x-3 ms-10">
        <img
          src={logo}
          alt="University Logo"
          className="h-16 w-16 object-contain"
        />
        <span className="text-lg font-semibold">Phaung Daw Oo <br/> International University</span>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-6 relative mr-10">
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

        {/* My Account */}
        <div className="relative account-menu border-l-2 px-10">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent closing when clicking button
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
    </nav>
  );
};

export default AdminNavbar;

