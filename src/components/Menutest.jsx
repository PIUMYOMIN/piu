import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button';
import { FaBars } from "react-icons/fa";

export default function Menutest() {
  let [open, setOpen] = useState(false)
  return <div className="shadow-md w-full fixed top-0 left-0">
      <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
        <div className="font-bold cursor-pointer">
          <span className="text-3xl text-dark">Logo</span>
        </div>
        <div className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden text-dark z-10" onClick={() => setOpen(!open)}>
        <FaBars />
        </div>
        <ul className={`md:flex md:item:center md:pb-0 pb-12 absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? "top-20 bg-dark-purple text-white" : "top-[-490px]"}`}>
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link to="">Home</Link>
          </li>
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link to="">Services</Link>
          </li>
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link to="">Portfolio</Link>
          </li>
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link to="">About</Link>
          </li>
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link to="">Contact</Link>
          </li>
          <Button />
        </ul>
      </div>
    </div>;
}
