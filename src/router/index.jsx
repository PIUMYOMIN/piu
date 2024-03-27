import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import President from "../pages/President";
import Courses from "../pages/Courses";
import Campus from "../pages/Campus";
import About from "../pages/About";
import Layout from "../pages/layouts/Layout";
import CourseDetails from "../pages/CourseDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/campuses",
        element: <Campus />
      },
      {
        path: "/about-us",
        element: <About />
      },
      {
        path: "/courses",
        element: <Courses />
      },
      {
        path: "/course-details",
        element: <CourseDetails />
      },
      {
        path: "/contact-us",
        element: <Contact />
      },
      {
        path: "/president-of-piu",
        element: <President />
      }
    ]
  }
]);

export default router;