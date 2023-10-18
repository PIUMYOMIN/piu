import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaTelegram,
  FaBars
} from "react-icons/fa";

export default function Menubar() {
  let [open, setOpen] = useState(false);
  return (
    <div className="shadow-md w-full fixed top-0 left-0">
      <div className="md:flex items-center justify-between = py-4 md:px-10 px-7">
        <div className="font-bold cursor-pointer">
          <span className="text-3xl text-dark">Logo</span>
        </div>
        <ul className="flex gap-3">
          <li className="">
            <Link to="">Home</Link>
          </li>
          <li className="">
            <Link to="">Services</Link>
          </li>
          <li className="">
            <Link to="">Portfolio</Link>
          </li>
          <li className="">
            <Link to="">About</Link>
          </li>
          <li className="">
            <Link to="">Contact</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
