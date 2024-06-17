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
import TeamProfile from "../pages/user/TeamProfile";

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
        path: "/",
        element: <Home />
      },
      {
        path: "/campus",
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
        path: "/courses/:slug",
        element: <CourseDetails />
      },
      {
        path: "/team/:slug",
        element: <TeamProfile />
      },
      {
        path: "/news/:slug",
        element: <NewsDetails />
      },
      {
        path: "/contact-us",
        element: <Contact />
      },
      {
        path: "/president-of-piu",
        element: <President />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/admissions/application-form",
        element: <Admission />
      },
      {
        path: "/admissions/application-form/successfully-submitted",
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
