// src/router/index.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import {
  About,
  AddAssignment,
  AddCurriculum,
  AddDepartment,
  AddEvent,
  AddGallery,
  AddMOU,
  AddPosition,
  AddSeminar,
  AddStudent,
  AddStudentGrading,
  AddTeam,
  AdminLayout,
  Admission,
  Admission2,
  AdmissionDetails,
  AdmissionPage,
  AllStudents,
  ApplicationFormSubmitSuccessful,
  AssignmentsList,
  BlogsForm,
  BlogsList,
  Campus,
  CampusForm,
  CampusList,
  ChangePassword,
  Contact,
  ContactFormSubmittedSuccessful,
  CourseCategories,
  CourseDetails,
  CourseList,
  Courses,
  CurriculumList,
  Dashboard,
  DepartmentList,
  EventList,
  Faculties,
  FacultiesDetails,
  ForgotPassword,
  Gallery,
  GalleryList,
  GradeForm,
  Home,
  Login,
  MOUList,
  ModuleForm,
  ModulesList,
  NewCourse,
  NewsDetails,
  NewsForm,
  NewsList,
  NewsPage,
  PositionList,
  President,
  ProfileSetting,
  Register,
  ResetPassword,
  SearchResults,
  SeminarList,
  SliderList,
  StudentDetails,
  StudentGradeView,
  StudentGradingList,
  StudentLayout,
  StudentDashboard,
  StudentCourses,
  StudentGrades,
  StudentAssignments,
  StudentAttendance,
  StudentMessages,
  StudentProfile,
  StudentSemesterView,
  StudentYearView,
  TeacherAssignments,
  TeacherAttendance,
  TeacherCourses,
  TeacherDashboard,
  TeacherGrades,
  TeacherLayout,
  TeacherMessages,
  TeacherModules,
  TeacherProfile,
  TeacherStudents,
  TeamList,
  TeamProfile,
  UserDashboard,
  UserDashboardLayout,
  UsersHub,
} from "./lazyPages";

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
      <PrivateRoute requiredRole={["admin", "registrar"]}>
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
      {
        path: "course-list",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <CourseList />
          </RoleRoute>,
          privateSeo("Course List")
        ),
      },
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
      {
        path: "new/:id?",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <NewCourse />
          </RoleRoute>,
          privateSeo("Course Editor")
        ),
      },
      {
        path: "blog-list",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <BlogsList />
          </RoleRoute>,
          privateSeo("Blog List")
        ),
      },
      {
        path: "add-blog",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <BlogsForm />
          </RoleRoute>,
          privateSeo("Add Blog")
        ),
      },
      {
        path: "add-blog/edit/:id",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <BlogsForm />
          </RoleRoute>,
          privateSeo("Edit Blog")
        ),
      },
      {
        path: "news",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <NewsList />
          </RoleRoute>,
          privateSeo("News List")
        ),
      },
      {
        path: "add-news",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <NewsForm />
          </RoleRoute>,
          privateSeo("Add News")
        ),
      },
      {
        path: "add-news/edit/:id",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <NewsForm />
          </RoleRoute>,
          privateSeo("Edit News")
        ),
      },
      {
        path: "campus-list",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <CampusList />
          </RoleRoute>,
          privateSeo("Campus List")
        ),
      },
      {
        path: "new-campus",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <CampusForm />
          </RoleRoute>,
          privateSeo("Add Campus")
        ),
      },
      {
        path: "campus/:id/edit",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <CampusForm />
          </RoleRoute>,
          privateSeo("Edit Campus")
        ),
      },
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
      {
        path: "event-list",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <EventList />
          </RoleRoute>,
          privateSeo("Event List")
        ),
      },
      {
        path: "add-event",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddEvent />
          </RoleRoute>,
          privateSeo("Add Event")
        ),
      },
      {
        path: "events/edit/:id",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddEvent />
          </RoleRoute>,
          privateSeo("Edit Event")
        ),
      },
      {
        path: "curriculum-list",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <CurriculumList />
          </RoleRoute>,
          privateSeo("Curriculum List")
        ),
      },
      {
        path: "add-curriculum",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddCurriculum />
          </RoleRoute>,
          privateSeo("Add Curriculum")
        ),
      },
      {
        path: "add-curriculum/edit/:id",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddCurriculum />
          </RoleRoute>,
          privateSeo("Edit Curriculum")
        ),
      },
      {
        path: "slider",
        element: withSeo(
          <RoleRoute allowedRoles={["admin"]}>
            <SliderList />
          </RoleRoute>,
          privateSeo("Slider Management")
        ),
      },
      {
        path: "mou",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <MOUList />
          </RoleRoute>,
          privateSeo("MOU List")
        ),
      },
      {
        path: "mou/add",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddMOU />
          </RoleRoute>,
          privateSeo("Add MOU")
        ),
      },
      {
        path: "departments",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <DepartmentList />
          </RoleRoute>,
          privateSeo("Departments")
        ),
      },
      {
        path: "departments/new",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddDepartment />
          </RoleRoute>,
          privateSeo("Add Department")
        ),
      },
      {
        path: "departments/edit/:id",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddDepartment />
          </RoleRoute>,
          privateSeo("Edit Department")
        ),
      },
      {
        path: "positions",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <PositionList />
          </RoleRoute>,
          privateSeo("Positions")
        ),
      },
      {
        path: "positions/new",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddPosition />
          </RoleRoute>,
          privateSeo("Add Position")
        ),
      },
      {
        path: "positions/edit/:id",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddPosition />
          </RoleRoute>,
          privateSeo("Edit Position")
        ),
      },
      {
        path: "seminars",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <SeminarList />
          </RoleRoute>,
          privateSeo("Seminars")
        ),
      },
      {
        path: "seminars/add",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddSeminar />
          </RoleRoute>,
          privateSeo("Add Seminar")
        ),
      },
      {
        path: "seminars/edit/:id",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddSeminar />
          </RoleRoute>,
          privateSeo("Edit Seminar")
        ),
      },
      {
        path: "gallery",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <GalleryList />
          </RoleRoute>,
          privateSeo("Gallery Management")
        ),
      },
      {
        path: "gallery/add",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddGallery />
          </RoleRoute>,
          privateSeo("Add Gallery")
        ),
      },
      {
        path: "gallery/add/:id",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddGallery />
          </RoleRoute>,
          privateSeo("Edit Gallery")
        ),
      },
      {
        path: "students",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AllStudents />
          </RoleRoute>,
          privateSeo("Students")
        ),
      },
      {
        path: "students/add",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddStudent />
          </RoleRoute>,
          privateSeo("Add Student")
        ),
      },
      {
        path: "students/edit/:id",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddStudent />
          </RoleRoute>,
          privateSeo("Edit Student")
        ),
      },
      {
        path: "students/:id/details",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <StudentDetails />
          </RoleRoute>,
          privateSeo("Student Details")
        ),
      },
      {
        path: "students/add-grading",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <AddStudentGrading />
          </RoleRoute>,
          privateSeo("Add Student Grading")
        ),
      },
      {
        path: "students/grading",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <StudentGradingList />
          </RoleRoute>,
          privateSeo("Student Grading")
        ),
      },
      {
        path: "students/:id/grading",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <StudentYearView />
          </RoleRoute>,
          privateSeo("Student Year View")
        ),
      },
      {
        path: "students/:studentId/grading/:year",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <StudentSemesterView />
          </RoleRoute>,
          privateSeo("Student Semester View")
        ),
      },
      {
        path: "students/:studentId/:year/:semester",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <StudentGradeView />
          </RoleRoute>,
          privateSeo("Student Grade View")
        ),
      },
      {
        path: "students/:studentId/:year/:semester/new",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <GradeForm />
          </RoleRoute>,
          privateSeo("New Grade")
        ),
      },
      {
        path: "students/:studentId/:year/:semester/edit/:gradeId",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <GradeForm />
          </RoleRoute>,
          privateSeo("Edit Grade")
        ),
      },
      {
        path: "assignments",
        element: withSeo(
          <RoleRoute allowedRoles={["admin"]}>
            <AssignmentsList />
          </RoleRoute>,
          privateSeo("Assignments")
        ),
      },
      {
        path: "assignments/add",
        element: withSeo(
          <RoleRoute allowedRoles={["admin"]}>
            <AddAssignment />
          </RoleRoute>,
          privateSeo("Add Assignment")
        ),
      },
      {
        path: "assignments/edit/:id",
        element: withSeo(
          <RoleRoute allowedRoles={["admin"]}>
            <AddAssignment />
          </RoleRoute>,
          privateSeo("Edit Assignment")
        ),
      },
      {
        path: "modules",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <ModulesList />
          </RoleRoute>,
          privateSeo("Modules")
        ),
      },
      {
        path: "modules/add",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <ModuleForm />
          </RoleRoute>,
          privateSeo("Add Module")
        ),
      },
      {
        path: "modules/edit/:id",
        element: withSeo(
          <RoleRoute allowedRoles={["admin", "registrar"]}>
            <ModuleForm />
          </RoleRoute>,
          privateSeo("Edit Module")
        ),
      },
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
    children: [
      { index: true, element: withSeo(<StudentDashboard />, privateSeo("Student Dashboard")) },
      { path: "profile", element: withSeo(<StudentProfile />, privateSeo("Student Profile")) },
      { path: "courses", element: withSeo(<StudentCourses />, privateSeo("My Courses")) },
      { path: "assignments", element: withSeo(<StudentAssignments />, privateSeo("Assignments")) },
      { path: "grades", element: withSeo(<StudentGrades />, privateSeo("Grades")) },
      { path: "attendance", element: withSeo(<StudentAttendance />, privateSeo("Attendance")) },
      { path: "inbox", element: withSeo(<StudentMessages type="inbox" />, privateSeo("Inbox")) },
      { path: "sent", element: withSeo(<StudentMessages type="sent" />, privateSeo("Sent Messages")) },
    ],
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
      { path: "courses", element: withSeo(<TeacherCourses />, privateSeo("My Courses")) },
      { path: "assignments", element: withSeo(<TeacherAssignments />, privateSeo("Assignments")) },
      { path: "modules", element: withSeo(<TeacherModules />, privateSeo("Course Modules")) },
      { path: "students", element: withSeo(<TeacherStudents />, privateSeo("Students")) },
      { path: "grades", element: withSeo(<TeacherGrades />, privateSeo("Grade Students")) },
      { path: "attendance", element: withSeo(<TeacherAttendance />, privateSeo("Attendance")) },
      { path: "inbox", element: withSeo(<TeacherMessages type="inbox" />, privateSeo("Inbox")) },
      { path: "sent", element: withSeo(<TeacherMessages type="sent" />, privateSeo("Sent Messages")) },
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