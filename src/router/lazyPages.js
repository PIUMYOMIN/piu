import { lazy } from "react";

// Public pages
export const Home = lazy(() => import("../pages/user/Home"));
export const Contact = lazy(() => import("../pages/user/contact"));
export const President = lazy(() => import("../pages/user/President"));
export const Courses = lazy(() => import("../pages/user/Courses"));
export const Campus = lazy(() => import("../pages/user/Campus"));
export const Faculties = lazy(() => import("../pages/user/Faculties"));
export const FacultiesDetails = lazy(() => import("../pages/user/FacultiesDetails"));
export const About = lazy(() => import("../pages/user/About"));
export const CourseDetails = lazy(() => import("../pages/user/CourseDetails"));
export const NewsDetails = lazy(() => import("../pages/user/NewsDetails"));
export const Gallery = lazy(() => import("../components/user/Gallery"));
export const NewsPage = lazy(() => import("../pages/user/News"));
export const SearchResults = lazy(() => import("../pages/user/SearchResults"));
export const Admission2 = lazy(() => import("../pages/user/Admission2"));
export const TeamProfile = lazy(() => import("../pages/user/TeamProfile"));
export const Admission = lazy(() => import("../pages/user/Admission"));
export const ApplicationFormSubmitSuccessful = lazy(() =>
  import("../pages/user/ApplicationFormSubmitSuccessful")
);
export const ContactFormSubmittedSuccessful = lazy(() =>
  import("../pages/user/ContactFormSubmittedSuccessful")
);

// Auth pages
export const Login = lazy(() => import("../auth/Login"));
export const Register = lazy(() => import("../auth/Register"));
export const ForgotPassword = lazy(() => import("../auth/ForgotPassword"));
export const ResetPassword = lazy(() => import("../auth/ResetPassword"));

// Layouts (loaded only when their section is visited)
export const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
export const StudentLayout = lazy(() => import("../layouts/StudentLayout"));
export const TeacherLayout = lazy(() => import("../layouts/TeacherLayout"));
export const UserDashboardLayout = lazy(() => import("../layouts/UserDashboardLayout"));

// Admin pages
export const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
export const UsersHub = lazy(() => import("../pages/admin/UsersHub"));
export const AdmissionPage = lazy(() => import("../pages/admin/Admission"));
export const AdmissionDetails = lazy(() => import("../pages/admin/AdmissionDetails"));
export const CourseList = lazy(() => import("../pages/admin/CourseList"));
export const NewCourse = lazy(() => import("../pages/admin/AddCourse"));
export const BlogsForm = lazy(() => import("../pages/admin/AddBlogs"));
export const BlogsList = lazy(() => import("../pages/admin/BlogsList"));
export const NewsList = lazy(() => import("../pages/admin/NewsList"));
export const NewsForm = lazy(() => import("../pages/admin/AddNews"));
export const CampusForm = lazy(() => import("../pages/admin/AddCampus"));
export const CampusList = lazy(() => import("../pages/admin/CampusList"));
export const AddTeam = lazy(() => import("../pages/admin/AddTeam"));
export const TeamList = lazy(() => import("../pages/admin/TeamList"));
export const AddEvent = lazy(() => import("../pages/admin/AddEvent"));
export const EventList = lazy(() => import("../pages/admin/EventList"));
export const AddCurriculum = lazy(() => import("../pages/admin/AddCurriculum"));
export const CurriculumList = lazy(() => import("../pages/admin/CurriculumList"));
export const SliderList = lazy(() => import("../pages/admin/SliderList"));
export const MOUList = lazy(() => import("../pages/admin/MOUList"));
export const AddMOU = lazy(() => import("../pages/admin/AddMOU"));
export const DepartmentList = lazy(() => import("../pages/admin/DepartmentsList"));
export const AddDepartment = lazy(() => import("../pages/admin/AddDepartment"));
export const PositionList = lazy(() => import("../pages/admin/PositionList"));
export const AddPosition = lazy(() => import("../pages/admin/AddPosition"));
export const SeminarList = lazy(() => import("../pages/admin/SeminarList"));
export const AddSeminar = lazy(() => import("../pages/admin/AddSeminar"));
export const GalleryList = lazy(() => import("../pages/admin/GalleryList"));
export const AddGallery = lazy(() => import("../pages/admin/AddGallery"));
export const AllStudents = lazy(() => import("../pages/admin/AllStudents"));
export const AddStudent = lazy(() => import("../pages/admin/AddStudent"));
export const StudentDetails = lazy(() => import("../pages/admin/StudentDetails"));
export const AddStudentGrading = lazy(() => import("../pages/admin/AddStudentGrading"));
export const GradeForm = lazy(() => import("../pages/admin/GradeForm"));
export const StudentGradingList = lazy(() => import("../pages/admin/StudentGradingList"));
export const StudentYearView = lazy(() => import("../pages/admin/StudentYearView"));
export const StudentSemesterView = lazy(() => import("../pages/admin/StudentSemesterView"));
export const StudentGradeView = lazy(() => import("../pages/admin/StudentGradeView"));
export const AssignmentsList = lazy(() => import("../pages/admin/AssignmentList"));
export const AddAssignment = lazy(() => import("../pages/admin/AddAssignment"));
export const ModulesList = lazy(() => import("../pages/admin/ModulesList"));
export const ModuleForm = lazy(() => import("../pages/admin/ModuleForm"));
export const ProfileSetting = lazy(() => import("../pages/admin/ProfileSetting"));
export const ChangePassword = lazy(() => import("../pages/admin/ChangePassword"));
export const CourseCategories = lazy(() => import("../pages/admin/CourseCategories"));

// Student / teacher / user portals
export const StudentDashboard = lazy(() => import("../pages/student/StudentDashboard"));
export const StudentCourses = lazy(() => import("../pages/student/StudentCourses"));
export const StudentGrades = lazy(() => import("../pages/student/StudentGrades"));
export const StudentAssignments = lazy(() => import("../pages/student/StudentAssignments"));
export const StudentAttendance = lazy(() => import("../pages/student/StudentAttendance"));
export const StudentMessages = lazy(() => import("../pages/student/StudentMessages"));
export const StudentProfile = lazy(() => import("../pages/student/StudentProfile"));
export const UserDashboard = lazy(() => import("../pages/user/UserDashboard"));
export const TeacherDashboard = lazy(() => import("../pages/teacher/TeacherDashboard"));
export const TeacherProfile = lazy(() => import("../pages/teacher/TeacherProfile"));
