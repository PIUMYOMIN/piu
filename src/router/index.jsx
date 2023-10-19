import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home'
import Courses from "../pages/Courses";
import About from '../pages/About'
import Contact from '../pages/Contact'
import Campus from '../pages/Campus'
import Layout from "../pages/layouts/Layout";
import Course1 from "./../pages/Course1";
import Course2 from "./../pages/Course2";
import Course3 from "./../pages/Course3";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "/courses",
        element: <Courses />
      },
      {
        path: "/course1",
        element: <Course1 />
      },
      {
        path: "/course2",
        element: <Course2 />
      },
      {
        path: "/course3",
        element: <Course3 />
      },
      {
        path: "/campuses",
        element: <Campus />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/contact",
        element: <Contact />
      }
    ]
  }
]);

export default router;