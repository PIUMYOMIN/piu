import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/user/Navbar";
import Menubar from "../components/user/Menubar";
import Footer from "../components/user/Footer";

export default function UserLayout() {
  return (
    <div className=" font-roboto">
      <Navbar />
      <Menubar />
      <div className="w-full mx-auto box-border overflow-hidden">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
