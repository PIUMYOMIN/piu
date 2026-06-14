// src/router/index.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/user/Home";
import Contact from "../pages/user/contact";
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
import UserDashboardLayout from "../layouts/UserDashboardLayout";
import CourseDetails from "../pages/user/CourseDetails";
import NewsDetails from "../pages/user/NewsDetails";
import Gallery from "../components/user/Gallery";
import NewsPage from "../pages/user/News";
import SearchResults from "../pages/user/SearchResults";

// Admin Dashboard
import Dashboard from "../pages/admin/Dashboard";
import UsersHub from "../pages/admin/UsersHub";
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
import UserDashboard from "../pages/user/UserDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherProfile from "../pages/teacher/TeacherProfile";
import Admission from "../pages/user/Admission";
import ApplicationFormSubmitSuccessful from "../pages/user/ApplicationFormSubmitSuccessful";
import ContactFormSubmittedSuccessful from "../pages/user/ContactFormSubmittedSuccessful";

// Auth Components
import PrivateRoute from "../components/PrivateRoute";
import PublicRoute from "../components/PublicRoute";
import RoleRoute from "../components/RoleRoute";
import { RouteSeo } from "../seo";

const withSeo = (element, seo) => (
  <>
    <RouteSeo {...seo} />
    {element}
  </>
);

const publicSeo = (title, description, extra = {}) => ({
  title,
  description,
  ...extra,
});

const privateSeo = (title, description = "Secure PIU dashboard page.", extra = {}) => ({
  title,
  description,
  noindex: true,
  ...extra,
});

const router = createBrowserRouter([
  {
    path: "/login",
    element: withSeo(
      <PublicRoute>
        <Login />
      </PublicRoute>,
      privateSeo("Login", "Access your PIU account.")
    ),
  },
  {
    path: "/register",
    element: withSeo(
      <PublicRoute>
        <Register />
      </PublicRoute>,
      privateSeo("Register", "Create a PIU account.")
    ),
  },
  {
    path: "/forgot-password",
    element: withSeo(
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>,
      privateSeo("Forgot Password", "Reset access to your PIU account.")
    ),
  },
  {
    path: "/reset-password",
    element: withSeo(
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>,
      privateSeo("Reset Password", "Choose a new password for your PIU account.")
    ),
  },
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: withSeo(
          <Home />,
          publicSeo(
            "Home",
            "Discover academics, admissions, news, and student life at Phaung Daw Oo International University."
          )
        ),
      },
      {
        path: "/campus",
        element: withSeo(
          <Campus />,
          publicSeo("Campus", "Explore the PIU campus experience in Mandalay, Myanmar.")
        ),
      },
      {
        path: "/admission",
        element: withSeo(
          <Admission2 />,
          publicSeo(
            "Admissions Overview",
            "Review PIU admission requirements, tuition details, and the application guide."
          )
        ),
      },
      { path: "/admissions", element: <Navigate to="/admissions/application-form" replace /> },
      {
        path: "/admissions/application-form",
        element: withSeo(
          <Admission />,
          publicSeo(
            "Apply for Admission",
            "Submit your admission application to PIU and upload the required documents online."
          )
        ),
      },
      {
        path: "/admissions/application-form/successfully-submitted",
        element: withSeo(
          <ApplicationFormSubmitSuccessful />,
          privateSeo("Application Submitted", "Admission submission confirmation page.")
        ),
      },
      {
        path: "/about-us",
        element: withSeo(
          <About />,
          publicSeo(
            "About Us",
            "Learn the history, mission, and vision of Phaung Daw Oo International University."
          )
        ),
      },
      {
        path: "/courses",
        element: withSeo(
          <Courses />,
          publicSeo(
            "Courses",
            "Browse undergraduate, diploma, certificate, and advanced programs offered by PIU."
          )
        ),
      },
      {
        path: "/courses/:slug",
        element: withSeo(
          <CourseDetails />,
          publicSeo("Course Details", "Explore course information, requirements, and enrollment details at PIU.")
        ),
      },
      {
        path: "/team/:slug",
        element: withSeo(
          <TeamProfile />,
          publicSeo("Team Profile", "Meet PIU leadership and academic team members.")
        ),
      },
      {
        path: "/news/:slug",
        element: withSeo(
          <NewsDetails />,
          publicSeo("News Details", "Read the latest PIU announcements, updates, and stories.")
        ),
      },
      {
        path: "/news",
        element: withSeo(
          <NewsPage />,
          publicSeo("News & Events", "Stay up to date with PIU news, announcements, and campus events.")
        ),
      },
      {
        path: "/search",
        element: withSeo(
          <SearchResults />,
          privateSeo("Search Results", "Internal site search results page.")
        ),
      },
      {
        path: "/gallery",
        element: withSeo(
          <Gallery variant="page" />,
          publicSeo("Gallery", "View photos and moments from PIU programs, campus life, and events.")
        ),
      },
      {
        path: "/contact-us",
        element: withSeo(
          <Contact />,
          publicSeo("Contact Us", "Get in touch with Phaung Daw Oo International University in Mandalay.")
        ),
      },
      {
        path: "/contact/thank-you-for-contacting-us",
        element: withSeo(
          <ContactFormSubmittedSuccessful />,
          privateSeo("Contact Submitted", "Contact form submission confirmation page.")
        ),
      },
      {
        path: "/president-of-piu",
        element: withSeo(
          <President />,
          publicSeo(
            "President of PIU",
            "Read about the founder president and educational vision behind Phaung Daw Oo International University."
          )
        ),
      },
      {
        path: "/faculties",
        element: withSeo(
          <Faculties />,
          publicSeo("Faculties", "Meet the faculty members and academic leaders at PIU.")
        ),
      },
      {
        path: "/faculties/:slug",
        element: withSeo(
          <FacultiesDetails />,
          publicSeo("Faculty Profile", "Read biographies and academic profiles of PIU faculty members.")
        ),
      },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
  {
    path: "piu/admin",
    element: withSeo(
      <PrivateRoute requiredRole={["admin", "teacher", "registrar"]}>
        <AdminLayout />
      </PrivateRoute>,
      privateSeo("Admin Dashboard", "Private PIU administration area.")
    ),
    children: [
      { index: true, element: withSeo(<Dashboard />, privateSeo("Dashboard")) },
      { path: "profile", element: withSeo(<ProfileSetting />, privateSeo("Profile Settings")) },
      { path: "change-password", element: withSeo(<ChangePassword />, privateSeo("Change Password")) },
      {
        path: "users",
        element: withSeo(
          <RoleRoute allowedRoles={["admin"]}>
            <UsersHub />
          </RoleRoute>,
          privateSeo("Users")
        ),
      },
      {
        path: "users-role",
        element: <Navigate to="/piu/admin/users?tab=roles" replace />,
      },
      {
        path: "user-permission",
        element: <Navigate to="/piu/admin/users?tab=permissions" replace />,
      },
      {
        path: "admission",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AdmissionPage />
          </RoleRoute>,
          privateSeo("Admission Management")
        ),
      },
      {
        path: "admission/:id",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AdmissionDetails />
          </RoleRoute>,
          privateSeo("Admission Details")
        ),
      },
      {
        path: "admission/details",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AdmissionDetails />
          </RoleRoute>,
          privateSeo("Admission Details")
        ),
      },
      { path: "course-list", element: withSeo(<CourseList />, privateSeo("Course List")) },
      { path: "list", element: <Navigate to="/piu/admin/course-list" replace /> },
      {
        path: "course-categories",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <CourseCategories />
          </RoleRoute>,
          privateSeo("Course Categories")
        ),
      },
      { path: "new/:id?", element: withSeo(<NewCourse />, privateSeo("Course Editor")) },
      { path: "blog-list", element: withSeo(<BlogsList />, privateSeo("Blog List")) },
      { path: "add-blog", element: withSeo(<BlogsForm />, privateSeo("Add Blog")) },
      { path: "add-blog/edit/:id", element: withSeo(<BlogsForm />, privateSeo("Edit Blog")) },
      { path: "news", element: withSeo(<NewsList />, privateSeo("News List")) },
      { path: "add-news", element: withSeo(<NewsForm />, privateSeo("Add News")) },
      { path: "add-news/edit/:id", element: withSeo(<NewsForm />, privateSeo("Edit News")) },
      { path: "campus-list", element: withSeo(<CampusList />, privateSeo("Campus List")) },
      { path: "new-campus", element: withSeo(<CampusForm />, privateSeo("Add Campus")) },
      { path: "campus/:id/edit", element: withSeo(<CampusForm />, privateSeo("Edit Campus")) },
      {
        path: "team-list",
        element: withSeo(
          <RoleRoute allowedRoles={["admin"]}>
            <TeamList />
          </RoleRoute>,
          privateSeo("Team List")
        ),
      },
      {
        path: "add-team",
        element: withSeo(
          <RoleRoute allowedRoles={["admin"]}>
            <AddTeam />
          </RoleRoute>,
          privateSeo("Add Team Member")
        ),
      },
      {
        path: "add-team/edit/:id",
        element: withSeo(
          <RoleRoute allowedRoles={["admin"]}>
            <AddTeam />
          </RoleRoute>,
          privateSeo("Edit Team Member")
        ),
      },
      { path: "event-list", element: withSeo(<EventList />, privateSeo("Event List")) },
      { path: "add-event", element: withSeo(<AddEvent />, privateSeo("Add Event")) },
      { path: "events/edit/:id", element: withSeo(<AddEvent />, privateSeo("Edit Event")) },
      { path: "curriculum-list", element: withSeo(<CurriculumList />, privateSeo("Curriculum List")) },
      { path: "add-curriculum", element: withSeo(<AddCurriculum />, privateSeo("Add Curriculum")) },
      { path: "add-curriculum/edit/:id", element: withSeo(<AddCurriculum />, privateSeo("Edit Curriculum")) },
      {
        path: "slider",
        element: withSeo(
          <RoleRoute allowedRoles={["admin"]}>
            <SliderList />
          </RoleRoute>,
          privateSeo("Slider Management")
        ),
      },
      { path: "mou", element: withSeo(<MOUList />, privateSeo("MOU List")) },
      { path: "mou/add", element: withSeo(<AddMOU />, privateSeo("Add MOU")) },
      { path: "departments", element: withSeo(<DepartmentList />, privateSeo("Departments")) },
      { path: "departments/new", element: withSeo(<AddDepartment />, privateSeo("Add Department")) },
      { path: "departments/edit/:id", element: withSeo(<AddDepartment />, privateSeo("Edit Department")) },
      { path: "positions", element: withSeo(<PositionList />, privateSeo("Positions")) },
      { path: "positions/new", element: withSeo(<AddPosition />, privateSeo("Add Position")) },
      { path: "positions/edit/:id", element: withSeo(<AddPosition />, privateSeo("Edit Position")) },
      { path: "seminars", element: withSeo(<SeminarList />, privateSeo("Seminars")) },
      { path: "seminars/add", element: withSeo(<AddSeminar />, privateSeo("Add Seminar")) },
      { path: "seminars/edit/:id", element: withSeo(<AddSeminar />, privateSeo("Edit Seminar")) },
      { path: "gallery", element: withSeo(<GalleryList />, privateSeo("Gallery Management")) },
      { path: "gallery/add", element: withSeo(<AddGallery />, privateSeo("Add Gallery")) },
      { path: "gallery/add/:id", element: withSeo(<AddGallery />, privateSeo("Edit Gallery")) },
      { path: "students", element: withSeo(<AllStudents />, privateSeo("Students")) },
      { path: "students/add", element: withSeo(<AddStudent />, privateSeo("Add Student")) },
      { path: "students/edit/:id", element: withSeo(<AddStudent />, privateSeo("Edit Student")) },
      { path: "students/:id/details", element: withSeo(<StudentDetails />, privateSeo("Student Details")) },
      { path: "students/add-grading", element: withSeo(<AddStudentGrading />, privateSeo("Add Student Grading")) },
      { path: "students/grading", element: withSeo(<StudentGradingList />, privateSeo("Student Grading")) },
      { path: "students/:id/grading", element: withSeo(<StudentYearView />, privateSeo("Student Year View")) },
      { path: "students/:studentId/grading/:year", element: withSeo(<StudentSemesterView />, privateSeo("Student Semester View")) },
      { path: "students/:studentId/:year/:semester", element: withSeo(<StudentGradeView />, privateSeo("Student Grade View")) },
      { path: "students/:studentId/:year/:semester/new", element: withSeo(<GradeForm />, privateSeo("New Grade")) },
      { path: "students/:studentId/:year/:semester/edit/:gradeId", element: withSeo(<GradeForm />, privateSeo("Edit Grade")) },
      { path: "assignments", element: withSeo(<AssignmentsList />, privateSeo("Assignments")) },
      { path: "assignments/add", element: withSeo(<AddAssignment />, privateSeo("Add Assignment")) },
      { path: "assignments/edit/:id", element: withSeo(<AddAssignment />, privateSeo("Edit Assignment")) },
      { path: "modules", element: withSeo(<ModulesList />, privateSeo("Modules")) },
      { path: "modules/add", element: withSeo(<ModuleForm />, privateSeo("Add Module")) },
      { path: "modules/edit/:id", element: withSeo(<ModuleForm />, privateSeo("Edit Module")) },
      { path: "*", element: <Navigate to="/piu/admin" replace /> },
    ],
  },
  {
    path: "piu/student",
    element: withSeo(
      <PrivateRoute requiredRole="student">
        <StudentLayout />
      </PrivateRoute>,
      privateSeo("Student Portal", "Private student portal.")
    ),
    children: [{ index: true, element: withSeo(<StudentProfile />, privateSeo("Student Profile")) }],
  },
  {
    path: "piu/teacher",
    element: withSeo(
      <PrivateRoute requiredRole="teacher">
        <TeacherLayout />
      </PrivateRoute>,
      privateSeo("Teacher Portal", "Private teacher portal.")
    ),
    children: [
      { index: true, element: withSeo(<TeacherDashboard />, privateSeo("Teacher Dashboard")) },
      { path: "profile", element: withSeo(<TeacherProfile />, privateSeo("Teacher Profile")) },
    ],
  },
  {
    path: "piu/user",
    element: withSeo(
      <PrivateRoute requiredRole="user">
        <UserDashboardLayout />
      </PrivateRoute>,
      privateSeo("User Dashboard", "Private PIU user dashboard.")
    ),
    children: [{ index: true, element: withSeo(<UserDashboard />, privateSeo("User Dashboard")) }],
  },
]);

export default router;
