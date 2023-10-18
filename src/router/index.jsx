import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home'
import Courses from "../pages/Courses";
import About from '../pages/About'
import Contact from '../pages/Contact'
import Campus from '../pages/Campus'
import Layout from "../pages/layouts/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/campuses",
        element: <Campus />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      }
    ]
  }
]);

export default router;