import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Home from "../pages/user/Home";
import Contact from "../pages/user/Contact";
import President from "../pages/user/President";
import Courses from "../pages/user/Courses";
import Campus from "../pages/user/Campus";
import About from "../pages/user/About";
import Login from "../pages/user/Login";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import CourseDetails from "../pages/user/CourseDetails";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Register from "./../pages/user/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <UserLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "/piu",
        element: <Home />
      },
      {
        path: "/piu/campuses",
        element: <Campus />
      },
      {
        path: "/piu/about-us",
        element: <About />
      },
      {
        path: "/piu/courses",
        element: <Courses />
      },
      {
        path: "/piu/courses/:slug",
        element: <CourseDetails />
      },
      {
        path: "/piu/contact-us",
        element: <Contact />
      },
      {
        path: "/piu/president-of-piu",
        element: <President />
      },
      {
        path: "/piu/login",
        element: <Login />
      },
      {
        path: "/piu/register",
        element: <Register />
      }
    ]
  },
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <AdminLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />
      },
      {
        path: "users",
        element: <Users />
      },
      {
        path: "courses",
        element: <Courses />
      }
    ]
  }
]);

export default router;
