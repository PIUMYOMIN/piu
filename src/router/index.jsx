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
import BlogsForm from "../pages/admin/BlogsForm";
import BlogsList from "../pages/admin/BlogsList";
import NewsList from "../pages/admin/NewsList";
import NewsForm from "../pages/admin/NewsForm";
import CampusForm from "../pages/admin/CampusForm";
import CampusList from "../pages/admin/CampusList";
import AddTeam from "../pages/admin/AddTeam";
import TeamList from "../pages/admin/TeamList";
import AddEvent from "../pages/admin/AddEvent";
import EventList from "../pages/admin/EventList";
import AddCurriculum from "../pages/admin/AddCurriculum";
import CurriculumList from "../pages/admin/CurriculumList";
import SliderList from "../pages/admin/SliderList";
import MOUList from "../pages/admin/MOUList";
import AddMOU from "../pages/admin/AddMOU";
import DepartmentList from "../pages/admin/DepartmentsList";
import AddDepartment from "../pages/admin/AddDepartment";
import PositionList from "../pages/admin/PositionList";
import AddPosition from "../pages/admin/AddPosition";
import SeminarList from "../pages/admin/SeminarList";
import AddSeminar from "../pages/admin/AddSeminar";
import GalleryList from "../pages/admin/GalleryList";
import AddGallery from "../pages/admin/AddGallery";
import AllStudents from "../pages/admin/AllStudents";
import AddStudent from "../pages/admin/AddStudent";
import StudentDetails from "../pages/admin/StudentDetails";
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
        element: <CourseList />,
      },
      {
        path: "/piu/admin/new/:id?",
        element: <NewCourse />,
      },
      {
        path: "/piu/admin/blog-list",
        element: <BlogsList />
      },
      {
        path: "/piu/admin/add-blog",
        element: <BlogsForm />
      },
      { path: "add-blog/edit/:id", 
        element: <BlogsForm /> 
      },
      {
        path: "/piu/admin/news",
        element: <NewsList />
      },
      {
        path: "/piu/admin/add-news",
        element: <NewsForm />
      },
      { path: "add-news/edit/:id", 
        element: <NewsForm /> 
      },
      {
        path: "/piu/admin/campus-list",
        element: <CampusList />
      },
      {
        path: "/piu/admin/new-campus",
        element: <CampusForm />
      },
      {
        path: "/piu/admin/campus/:id/edit",
        element: <CampusForm />
      },
      {
        path: "/piu/admin/team-list",
        element: <TeamList />
      },
      {
        path: "/piu/admin/add-team",
        element: <AddTeam />
      },
      {
        path: "/piu/admin/add-team/edit/:id",
        element: <AddTeam />
      },
      {
        path: "/piu/admin/event-list",
        element: <EventList />
      },
      {
        path: "/piu/admin/add-event",
        element: <AddEvent />
      },
      {
        path: "/piu/admin/events/edit/:id",
        element: <AddEvent />
      },
      {
        path: "/piu/admin/curriculum-list",
        element: <CurriculumList />,
      },
      {
        path: "/piu/admin/add-curriculum",
        element: <AddCurriculum />,
      },
      {
        path: "/piu/admin/add-curriculum/edit/:id",
        element: <AddCurriculum />,
      },
      {
        path: "/piu/admin/slider",
        element: <SliderList />
      },
      {
        path: "/piu/admin/mou",
        element: <MOUList />
      },
      {
        path: "/piu/admin/mou/add",
        element: <AddMOU />
      },
      {
        path: "/piu/admin/departments",
        element: <DepartmentList />
      },
      {
        path: "/piu/admin/departments/new",
        element: <AddDepartment />
      },
      {
        path: "/piu/admin/departments/edit/:id",
        element: <AddDepartment />
      },
      {
        path: "/piu/admin/positions",
        element: <PositionList />
      },
      {
        path: "/piu/admin/positions/new",
        element: <AddPosition />
      },
      {
        path: "/piu/admin/positions/edit/:id",
        element: <AddPosition />
      },
      {
        path: "/piu/admin/seminars",
        element: <SeminarList />
      },
      {
        path: "/piu/admin/seminars/add",
        element: <AddSeminar />
      },
      {
        path: "/piu/admin/seminars/edit/:id",
        element: <AddSeminar />
      },
      {
        path: "/piu/admin/gallery",
        element: <GalleryList />
      },
      {
        path: "/piu/admin/gallery/add",
        element: <AddGallery />
      },
      {
        path: "/piu/admin/gallery/add/:id",
        element: <AddGallery />
      },
      {
        path: "/piu/admin/students",
        element: <AllStudents />
      },
      {
        path: "/piu/admin/students/add",
        element: <AddStudent />
      },
      {
        path: "/piu/admin/students/edit/:id",
        element: <AddStudent />
      },
      {
        path: "/piu/admin/students/:id/details",
        element: <StudentDetails />
      }
    ]
  }
]);

export default router;
