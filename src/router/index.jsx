// src/router/index.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/user/Home";
import Contact from "../pages/user/Contact";
import President from "../pages/user/President";
import Courses from "../pages/user/Courses";
import CourseCategories from "../pages/admin/CourseCategories";
import Campus from "../pages/user/Campus";
import Faculties from "../pages/user/Faculties";
import FacultiesDetails from "../pages/user/FacultiesDetails";
import About from "../pages/user/About";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import StudentLayout from "../layouts/StudentLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import CourseDetails from "../pages/user/CourseDetails";
import NewsDetails from "../pages/user/NewsDetails";
import Gallery from "../components/user/Gallery";
import NewsPage from "../pages/user/News";
import SearchResults from "../pages/user/SearchResults";

// Admin Dashboard
import Dashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import UserRoles from "../pages/admin/UserRoles";
import UserPermissions from "../pages/admin/PermissionsPage";
import AdmissionPage from "../pages/admin/Admission";
import AdmissionDetails from "../pages/admin/AdmissionDetails";
import CourseList from "../pages/admin/CourseList";
import NewCourse from "../pages/admin/AddCourse";
import BlogsForm from "../pages/admin/AddBlogs";
import BlogsList from "../pages/admin/BlogsList";
import NewsList from "../pages/admin/NewsList";
import NewsForm from "../pages/admin/AddNews";
import CampusForm from "../pages/admin/AddCampus";
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
import AddStudentGrading from "../pages/admin/AddStudentGrading";
import GradeForm from "../pages/admin/GradeForm";
import StudentGradingList from "../pages/admin/StudentGradingList";
import StudentYearView from "../pages/admin/StudentYearView";
import StudentSemesterView from "../pages/admin/StudentSemesterView";
import StudentGradeView from "../pages/admin/StudentGradeView";
import AssignmentsList from "../pages/admin/AssignmentList";
import AddAssignment from "../pages/admin/AddAssignment";
import ModulesList from "../pages/admin/ModulesList";
import ModuleForm from "../pages/admin/ModuleForm";
import ProfileSetting from "../pages/admin/ProfileSetting";
import ChangePassword from "../pages/admin/ChangePassword";
import Admission2 from "../pages/user/Admission2";
import TeamProfile from "../pages/user/TeamProfile";
import StudentProfile from "../pages/student/StudentProfile";
import Admission from "../pages/user/Admission";
import ApplicationFormSubmitSuccessful from "../pages/user/ApplicationFormSubmitSuccessful";
import ContactFormSubmittedSuccessful from "../pages/user/ContactFormSubmittedSuccessful";

// Auth Components
import PrivateRoute from "../components/PrivateRoute";
import PublicRoute from "../components/PublicRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/campus", element: <Campus /> },
      { path: "/admission", element: <Admission2 /> },
      { path: "/admissions/application-form", element: <Admission /> },
      { path: "/admissions/application-form/successfully-submitted", element: <ApplicationFormSubmitSuccessful /> },
      { path: "/about-us", element: <About /> },
      { path: "/courses", element: <Courses /> },
      { path: "/courses/:slug", element: <CourseDetails /> },
      { path: "/team/:slug", element: <TeamProfile /> },
      { path: "/news/:slug", element: <NewsDetails /> },
      { path: "/news", element: <NewsPage /> },
      { path: "/search", element: <SearchResults /> },
      { path: "/gallery", element: <Gallery variant="page" /> },
      { path: "/contact-us", element: <Contact /> },
      { path: "/contact/thank-you-for-contacting-us", element: <ContactFormSubmittedSuccessful /> },
      { path: "/president-of-piu", element: <President /> },
      { path: "/faculties", element: <Faculties /> },
      { path: "/faculties/:slug", element: <FacultiesDetails /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
  {
    path: "piu/admin",
    element: (
      <PrivateRoute requiredRole="admin">
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "profile", element: <ProfileSetting /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "users", element: <AdminUsers /> },
      { path: "users-role", element: <UserRoles /> },
      { path: "user-permission", element: <UserPermissions /> },
      { path: "admission", element: <AdmissionPage /> },
      { path: "admission/:id", element: <AdmissionDetails /> },
      { path: "admission/details", element: <AdmissionDetails /> },
      { path: "course-list", element: <CourseList /> },
      { path: "course-categories", element: <CourseCategories /> },
      { path: "new/:id?", element: <NewCourse /> },
      { path: "blog-list", element: <BlogsList /> },
      { path: "add-blog", element: <BlogsForm /> },
      { path: "add-blog/edit/:id", element: <BlogsForm /> },
      { path: "news", element: <NewsList /> },
      { path: "add-news", element: <NewsForm /> },
      { path: "edit/:id", element: <NewsForm /> },
      { path: "campus-list", element: <CampusList /> },
      { path: "new-campus", element: <CampusForm /> },
      { path: "campus/:id/edit", element: <CampusForm /> },
      { path: "team-list", element: <TeamList /> },
      { path: "add-team", element: <AddTeam /> },
      { path: "add-team/edit/:id", element: <AddTeam /> },
      { path: "event-list", element: <EventList /> },
      { path: "add-event", element: <AddEvent /> },
      { path: "events/edit/:id", element: <AddEvent /> },
      { path: "curriculum-list", element: <CurriculumList /> },
      { path: "add-curriculum", element: <AddCurriculum /> },
      { path: "add-curriculum/edit/:id", element: <AddCurriculum /> },
      { path: "slider", element: <SliderList /> },
      { path: "mou", element: <MOUList /> },
      { path: "mou/add", element: <AddMOU /> },
      { path: "departments", element: <DepartmentList /> },
      { path: "departments/new", element: <AddDepartment /> },
      { path: "departments/edit/:id", element: <AddDepartment /> },
      { path: "positions", element: <PositionList /> },
      { path: "positions/new", element: <AddPosition /> },
      { path: "positions/edit/:id", element: <AddPosition /> },
      { path: "seminars", element: <SeminarList /> },
      { path: "seminars/add", element: <AddSeminar /> },
      { path: "seminars/edit/:id", element: <AddSeminar /> },
      { path: "gallery", element: <GalleryList /> },
      { path: "gallery/add", element: <AddGallery /> },
      { path: "gallery/add/:id", element: <AddGallery /> },
      { path: "students", element: <AllStudents /> },
      { path: "students/add", element: <AddStudent /> },
      { path: "students/edit/:id", element: <AddStudent /> },
      { path: "students/:id/details", element: <StudentDetails /> },
      { path: "students/add-grading", element: <AddStudentGrading /> },
      { path: "students/grading", element: <StudentGradingList /> },
      { path: "students/:id/grading", element: <StudentYearView /> },
      { path: "students/:studentId/grading/:year", element: <StudentSemesterView /> },
      { path: "students/:studentId/:year/:semester", element: <StudentGradeView /> },
      { path: "students/:studentId/:year/:semester/new", element: <GradeForm /> },
      { path: "students/:studentId/:year/:semester/edit/:gradeId", element: <GradeForm /> },
      { path: "assignments", element: <AssignmentsList /> },
      { path: "assignments/add", element: <AddAssignment /> },
      { path: "assignments/edit/:id", element: <AddAssignment /> },
      { path: "modules", element: <ModulesList /> },
      { path: "modules/add", element: <ModuleForm /> },
      { path: "modules/edit/:id", element: <ModuleForm /> },
    ],
  },
  {
    path: "piu/student",
    element: (
      <PrivateRoute requiredRole="student">
        <StudentLayout />
      </PrivateRoute>
    ),
    children: [{ path: "/piu/student", element: <StudentProfile /> }],
  },
  {
    path: "piu/teacher",
    element: (
      <PrivateRoute requiredRole="teacher">
        <TeacherLayout />
      </PrivateRoute>
    ),
    children: [],
  },
]);

export default router;