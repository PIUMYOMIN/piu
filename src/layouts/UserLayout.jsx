import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/user/Navbar";
import Menubar from "../components/user/Menubar";
import Footer from "../components/user/Footer";

export default function UserLayout() {
  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden font-roboto">
      <Navbar />
      <Menubar />
      <main className="w-full mx-auto box-border px-3 sm:px-4 md:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
