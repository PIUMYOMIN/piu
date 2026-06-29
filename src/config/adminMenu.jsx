import {
  FaTachometerAlt, FaUserCog, FaKey, FaUsers, FaGraduationCap, FaBookOpen,
  FaBlog, FaUniversity, FaNewspaper, FaListAlt, FaUsersCog, FaSlidersH,
  FaHandshake, FaCalendarAlt, FaBuilding, FaBriefcase, FaChalkboardTeacher,
  FaClock, FaImages, FaSuitcase, FaUserGraduate, FaEnvelope, FaTasks,
  FaBook, FaBookReader,
} from 'react-icons/fa';
import { ADMIN_TABS } from '../utils/dashboardTabs';

export const adminMenu = [
  {
    title: 'Dashboard',
    icon: <FaTachometerAlt />,
    path: '/piu/admin',
    tab: ADMIN_TABS.DASHBOARD,
    roles: ['admin', 'registrar'],
  },
  {
    title: 'Profile Setting',
    icon: <FaUserCog />,
    path: '/piu/admin/profile',
    tab: ADMIN_TABS.PROFILE,
    roles: ['admin', 'registrar'],
  },
  {
    title: 'Change Password',
    icon: <FaKey />,
    path: '/piu/admin/change-password',
    tab: ADMIN_TABS.CHANGE_PASSWORD,
    roles: ['admin', 'registrar'],
  },
  {
    title: 'Users',
    icon: <FaUsers />,
    tab: ADMIN_TABS.USER,
    roles: ['admin'],
    sub: [
      { name: 'All Users', path: '/piu/admin/users', tab: ADMIN_TABS.USER },
      { name: 'User Role', path: '/piu/admin/users', tab: ADMIN_TABS.ROLES },
      { name: 'User Permission', path: '/piu/admin/users', tab: ADMIN_TABS.PERMISSIONS },
    ],
  },
  {
    title: 'Admission',
    icon: <FaGraduationCap />,
    path: '/piu/admin/admission',
    tab: ADMIN_TABS.ADMISSION,
    roles: ['admin', 'registrar'],
  },
  {
    title: 'All Courses',
    icon: <FaBookOpen />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'Course List', path: '/piu/admin/course-list', tab: ADMIN_TABS.COURSES },
      { name: 'Add Course', path: '/piu/admin/new', tab: ADMIN_TABS.ADD_COURSE },
    ],
  },
  {
    title: 'Course Categories',
    icon: <FaListAlt />,
    roles: ['admin', 'registrar'],
    sub: [{ name: 'Categories', path: '/piu/admin/course-categories', tab: ADMIN_TABS.COURSE_CATEGORIES }],
  },
  {
    title: 'All Blogs',
    icon: <FaBlog />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'Blog List', path: '/piu/admin/blog-list', tab: ADMIN_TABS.BLOGS },
      { name: 'Add Blog', path: '/piu/admin/add-blog', tab: ADMIN_TABS.ADD_BLOG },
    ],
  },
  {
    title: 'All News',
    icon: <FaNewspaper />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'News List', path: '/piu/admin/news', tab: ADMIN_TABS.NEWS },
      { name: 'Add News', path: '/piu/admin/add-news', tab: ADMIN_TABS.ADD_NEWS },
    ],
  },
  {
    title: 'Events',
    icon: <FaCalendarAlt />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'Event List', path: '/piu/admin/event-list', tab: ADMIN_TABS.EVENTS },
      { name: 'Add Event', path: '/piu/admin/add-event', tab: ADMIN_TABS.ADD_EVENT },
    ],
  },
  {
    title: 'All Campus',
    icon: <FaUniversity />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'Campus List', path: '/piu/admin/campus-list', tab: ADMIN_TABS.CAMPUS },
      { name: 'Add Campus', path: '/piu/admin/new-campus', tab: ADMIN_TABS.ADD_CAMPUS },
    ],
  },
  {
    title: 'Curriculums',
    icon: <FaListAlt />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'Curriculum List', path: '/piu/admin/curriculum-list', tab: ADMIN_TABS.CURRICULUMS },
      { name: 'Add Curriculum', path: '/piu/admin/add-curriculum', tab: ADMIN_TABS.ADD_CURRICULUM },
    ],
  },
  {
    title: 'Teams',
    icon: <FaUsersCog />,
    roles: ['admin'],
    sub: [
      { name: 'Team List', path: '/piu/admin/team-list', tab: ADMIN_TABS.TEAMS },
      { name: 'Add Team', path: '/piu/admin/add-team', tab: ADMIN_TABS.ADD_TEAM },
    ],
  },
  {
    title: 'Slider',
    icon: <FaSlidersH />,
    path: '/piu/admin/slider',
    tab: ADMIN_TABS.SLIDER,
    roles: ['admin'],
  },
  {
    title: 'MOU Partnership',
    icon: <FaHandshake />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'All MOU', path: '/piu/admin/mou', tab: ADMIN_TABS.MOU },
      { name: 'Add MOU', path: '/piu/admin/mou/add', tab: ADMIN_TABS.ADD_MOU },
    ],
  },
  {
    title: 'Departments',
    icon: <FaBuilding />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'Department List', path: '/piu/admin/departments', tab: ADMIN_TABS.DEPARTMENTS },
      { name: 'Add Department', path: '/piu/admin/departments/new', tab: ADMIN_TABS.ADD_DEPARTMENT },
    ],
  },
  {
    title: 'Positions',
    icon: <FaBriefcase />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'Position List', path: '/piu/admin/positions', tab: ADMIN_TABS.POSITIONS },
      { name: 'Add Position', path: '/piu/admin/positions/new', tab: ADMIN_TABS.ADD_POSITION },
    ],
  },
  {
    title: 'Seminar',
    icon: <FaChalkboardTeacher />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'Seminar List', path: '/piu/admin/seminars', tab: ADMIN_TABS.SEMINARS },
      { name: 'Add Seminar', path: '/piu/admin/seminars/add', tab: ADMIN_TABS.ADD_SEMINAR },
    ],
  },
  {
    title: 'Students',
    icon: <FaUserGraduate />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'All Students', path: '/piu/admin/students', tab: ADMIN_TABS.STUDENTS },
      { name: 'Add Student', path: '/piu/admin/students/add', tab: ADMIN_TABS.ADD_STUDENT },
      { name: 'Add Student Grading', path: '/piu/admin/students/add-grading', tab: ADMIN_TABS.ADD_GRADING },
      { name: 'Student Grading', path: '/piu/admin/students/grading', tab: ADMIN_TABS.GRADING },
    ],
  },
  {
    title: 'Gallery',
    icon: <FaImages />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'Gallery List', path: '/piu/admin/gallery', tab: ADMIN_TABS.GALLERY },
      { name: 'Add Gallery', path: '/piu/admin/gallery/add', tab: ADMIN_TABS.ADD_GALLERY },
    ],
  },
  {
    title: 'Assignments',
    icon: <FaTasks />,
    roles: ['admin'],
    sub: [
      { name: 'Assignment List', path: '/piu/admin/assignments', tab: ADMIN_TABS.ASSIGNMENTS },
      { name: 'Add Assignment', path: '/piu/admin/assignments/add', tab: ADMIN_TABS.ADD_ASSIGNMENT },
    ],
  },
  {
    title: 'Course Modules',
    icon: <FaBook />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'Module List', path: '/piu/admin/modules', tab: ADMIN_TABS.MODULES },
      { name: 'Add Module', path: '/piu/admin/modules/add', tab: ADMIN_TABS.ADD_MODULE },
    ],
  },
  {
    title: 'Exam Time Table',
    icon: <FaClock />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'Time Table List', path: '/piu/admin/timetable-list', tab: 'timetable' },
      { name: 'Add Time Table', path: '/piu/admin/add-timetable', tab: 'add-timetable' },
      { name: 'Exam Sessions', path: '/piu/admin/exam-sessions', tab: 'exam-sessions' },
    ],
  },
  {
    title: 'Job Vacants',
    icon: <FaSuitcase />,
    roles: ['admin'],
    sub: [
      { name: 'Job List', path: '/piu/admin/job-list', tab: 'jobs' },
      { name: 'Add Job', path: '/piu/admin/add-job', tab: 'add-job' },
      { name: 'Job Categories', path: '/piu/admin/job-categories', tab: 'job-categories' },
    ],
  },
  {
    title: 'Mail Box',
    icon: <FaEnvelope />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'Inbox', path: '/piu/admin/inbox', tab: 'inbox' },
      { name: 'Sent Mails', path: '/piu/admin/sent-mails', tab: 'sent-mails' },
      { name: 'Drafts', path: '/piu/admin/drafts', tab: 'drafts' },
    ],
  },
  {
    title: 'Subjects',
    icon: <FaBookReader />,
    roles: ['admin', 'registrar'],
    sub: [
      { name: 'Subject List', path: '/piu/admin/subject-list', tab: 'subjects' },
      { name: 'Add Subject', path: '/piu/admin/add-subject', tab: 'add-subject' },
      { name: 'Subject Categories', path: '/piu/admin/subject-categories', tab: 'subject-categories' },
    ],
  },
];
