import React from 'react'
import {Outlet} from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Menubar from '../../components/Menubar'
import Footer from "../../components/Footer";

export default function Layout() {
  return <div className=" font-roboto">
      <Navbar />
      <Menubar />
      <div className="w-full mx-auto box-border overflow-hidden">
        <Outlet />
      </div>
      <Footer />
    </div>;
}