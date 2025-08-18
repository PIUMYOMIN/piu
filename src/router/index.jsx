import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Home from "../pages/user/Home";
import Contact from "../pages/user/Contact";
import President from "../pages/user/President";
import Courses from "../pages/user/Courses";
import Campus from "../pages/user/Campus";
import Faculties from "../pages/user/Faculties";
import FacultiesDetails from "../pages/user/FacultiesDetails";
import About from "../pages/user/About";
import Login from "../pages/user/Login";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import CourseDetails from "../pages/user/CourseDetails";
import NewsDetails from "../pages/user/NewsDetails";
import Dashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import UserRoles from "../pages/admin/RolesPage";
import UserPermissions from "../pages/admin/PermissionsPage";
import AdmissionPage from "../pages/admin/Admission";
import CourseList from "../pages/admin/CourseList";
import NewCourse from "../pages/admin/NewCourse";
import Register from "./../pages/user/Register";
import ProfileSetting from "../pages/admin/ProfileSetting";
import ChangePassword from "../pages/admin/ChangePassword";
import Admission from "../pages/user/Admission";
import Admission2 from "../pages/user/Admission2";
import ApplicationFormSubmitSuccessful from "../pages/user/ApplicationFormSubmitSuccessful";
import TeamProfile from "../pages/user/TeamProfile";
import ContactFormSubmittedSuccessful from "../pages/user/ContactFormSubmittedSuccessful";

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
        path: "/admission",
        element: <Admission2 />
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
        path: "*", //404 found and redirect to homepage//
        element: <Navigate to="/" />
      },
      {
        path: "/faculties",
        element: <Faculties />
      },
      {
        path: "/faculties/:slug",
        element: <FacultiesDetails />
      },
      // {
      //   path: "/admissions/application-form",
      //   element: <Admission />
      // },
      // {
      //   path: "/admissions/application-form/successfully-submitted",
      //   element: <ApplicationFormSubmitSuccessful />
      // },
      // {
      //   path: "/contact/thank-you-for-contacting-us",
      //   element: <ContactFormSubmittedSuccessful />
      // }
    ]
  },
  {
    path: "piu/admin",
    element: (
      // <AuthProvider>
        <AdminLayout />
      // </AuthProvider>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />
      },
      {
        path: "/piu/admin/profile",
        element: <ProfileSetting />
      },
      {
        path: "/piu/admin/change-password",
        element: <ChangePassword />
      },
      {
        path: "/piu/admin/users",
        element: <AdminUsers />
      },
      {
        path: "/piu/admin/users-role",
        element: <UserRoles />
      },
      {
        path: "/piu/admin/user-permission",
        element: <UserPermissions />
      },
      {
        path: "piu/admin/admission",
        element: <AdmissionPage />
      },
      {
        path: "/piu/admin/list",
        element: <CourseList />
      },
      {
        path: "/piu/admin/new",
        element: <NewCourse />
      }
      // {
      //   path: "/piu/admin/courses",
      //   element: <AdminCourses />
      // },
      // {
      //   path: "/piu/admin/courses/:slug/edit",
      //   element: <CourseEdit />
      // }
    ]
  }
]);

export default router;
