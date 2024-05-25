import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Home from "../pages/user/Home";
import Contact from "../pages/user/Contact";
import President from "../pages/user/President";
import Courses from "../pages/user/Courses";
import AdminCourses from "../pages/admin/Courses";
import Campus from "../pages/user/Campus";
import About from "../pages/user/About";
import Login from "../pages/user/Login";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import CourseDetails from "../pages/user/CourseDetails";
import NewsDetails from "../pages/user/NewsDetails";
import Dashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import Register from "./../pages/user/Register";
import CourseEdit from "../pages/admin/CourseEdit";
import Admission from "../pages/user/Admission";
import ApplicationFormSubmitSuccessful from "../pages/user/ApplicationFormSubmitSuccessful";

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
        path: "/piu/news/:slug",
        element: <NewsDetails />
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
      },
      {
        path: "/piu/admissions/application-form",
        element: <Admission />
      },
      {
        path: "/piu/admissions/application-form-submitted-successfully",
        element: <ApplicationFormSubmitSuccessful />
      }
    ]
  },
  {
    path: "piu/admin",
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
        path: "/piu/admin/users",
        element: <AdminUsers />
      },
      {
        path: "/piu/admin/courses",
        element: <AdminCourses />
      },
      {
        path: "/piu/admin/courses/:slug/edit",
        element: <CourseEdit />
      }
    ]
  }
]);

export default router;
