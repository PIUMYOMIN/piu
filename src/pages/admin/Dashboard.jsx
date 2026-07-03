import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell
} from "recharts";
import adminApi from "../../api/admin";
import { useAuth } from "../../contexts/AuthContext";
import { isRegistrarRole, resolveUserRole } from "../../utils/authRouting";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Card = ({ title, value, icon, trend }) => (
  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow dark:bg-gray-800">
    <div className="flex items-center justify-between w-full">
      <div>
        <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        {trend && (
          <p className={`mt-1 text-sm ${trend.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend.value > 0 ? '↑' : '↓'} {trend.value}% {trend.label}
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-800">
        {icon}
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const role = resolveUserRole(user);
  const isRegistrar = isRegistrarRole(role);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalAdmissions: 0,
    activeCourses: 0,
    totalModules: 0,
    totalAssignments: 0,
  });
  const [recentAdmissions, setRecentAdmissions] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [courseDistribution, setCourseDistribution] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const studentsPromise = adminApi.students.list();
        const coursesPromise = adminApi.courses.list();
        const modulesPromise = adminApi.modules.list();
        const assignmentsPromise = adminApi.assignments.list();

        const [studentsData, coursesData, modulesData, assignmentsPayload] = await Promise.all([
          studentsPromise,
          coursesPromise,
          modulesPromise,
          assignmentsPromise,
        ]);

        let users = [];
        let admissions = [];
        if (!isRegistrar) {
          const [usersData, admissionsData] = await Promise.all([
            adminApi.users.list(),
            adminApi.admissions.list(),
          ]);
          users = Array.isArray(usersData) ? usersData : [];
          admissions = Array.isArray(admissionsData) ? admissionsData : [];
        }

        if (!mounted) return;
        const students = Array.isArray(studentsData) ? studentsData : [];
        const courses = Array.isArray(coursesData) ? coursesData : [];
        const modules = Array.isArray(modulesData) ? modulesData : [];
        const assignments = Array.isArray(assignmentsPayload) ? assignmentsPayload : [];

        const totalUsers = users.length;
        const totalStudents = students.length;
        const totalAdmissions = admissions.length;
        const activeCourses = courses.filter((c) => c?.is_active === true || c?.is_active === 1 || c?.is_active === undefined).length;
        const totalModules = modules.length;
        const totalAssignments = assignments.length;

        setStats({
          totalUsers,
          totalStudents,
          totalAdmissions,
          activeCourses,
          totalModules,
          totalAssignments,
        });

        if (!isRegistrar) {
          const recent = admissions
            .slice()
            .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
            .slice(0, 5);
          setRecentAdmissions(recent);

          const now = new Date();
          const months = Array.from({ length: 12 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
            return { year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleString("en-US", { month: "short" }) };
          });
          const counts = months.map((m) => {
            const c = admissions.filter((a) => {
              if (!a?.created_at) return false;
              const d = new Date(a.created_at);
              return d.getFullYear() === m.year && d.getMonth() === m.month;
            }).length;
            return { month: m.label, students: c };
          });
          setEnrollmentData(counts);
        } else {
          setRecentAdmissions([]);
          const programMap = new Map();
          for (const student of students) {
            const programName = student?.course?.title || "Unassigned";
            programMap.set(programName, (programMap.get(programName) || 0) + 1);
          }
          setEnrollmentData(
            Array.from(programMap.entries())
              .map(([month, studentsCount]) => ({ month, students: studentsCount }))
              .sort((a, b) => b.students - a.students)
              .slice(0, 6)
          );
        }

        const distMap = new Map();
        for (const c of courses) {
          const name = c?.category?.name || c?.course_category?.name || "Other";
          distMap.set(name, (distMap.get(name) || 0) + 1);
        }
        const dist = Array.from(distMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
        setCourseDistribution(dist);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [isRegistrar]);

  // (kept simple; charts render even when 0s)

  const studentIcon = (
    <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const admissionIcon = (
    <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const courseIcon = (
    <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const queryIcon = (
    <svg className="w-6 h-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );

  const moduleIcon = (
    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const assignmentIcon = (
    <svg className="w-6 h-6 text-amber-600 dark:text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );

  return (
    <div className="space-y-6">
      {isRegistrar && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          Registrar workspace — manage student registration, course modules, and assignments.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Students"
          value={loading ? "—" : stats.totalStudents}
          icon={studentIcon}
        />
        {isRegistrar ? (
          <>
            <Card
              title="Course Modules"
              value={loading ? "—" : stats.totalModules}
              icon={moduleIcon}
            />
            <Card
              title="Assignments"
              value={loading ? "—" : stats.totalAssignments}
              icon={assignmentIcon}
            />
            <Card
              title="Active Programs"
              value={loading ? "—" : stats.activeCourses}
              icon={courseIcon}
            />
          </>
        ) : (
          <>
            <Card
              title="Total Admissions"
              value={loading ? "—" : stats.totalAdmissions}
              icon={admissionIcon}
            />
            <Card
              title="Active Courses"
              value={loading ? "—" : stats.activeCourses}
              icon={courseIcon}
            />
            <Card
              title="Total Users"
              value={loading ? "—" : stats.totalUsers}
              icon={queryIcon}
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {isRegistrar ? "Students by Program" : "Enrollment Trends"}
          </h2>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="students" fill="#002147" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Course Distribution Chart */}
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Course Distribution</h2>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">Loading…</div>
          ) : courseDistribution.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">No course data</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={courseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {courseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Queries and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {!isRegistrar && (
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Admissions</h2>
            <Link
              to="/piu/admin/admission"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <li className="py-6 text-gray-500">Loading…</li>
            ) : recentAdmissions.length === 0 ? (
              <li className="py-6 text-gray-500">No admissions yet.</li>
            ) : (
              recentAdmissions.map((a) => (
                <li key={a.id} className="py-3">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{a.name}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm truncate">{a.email}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {a.created_at ? new Date(a.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        )}

        <div className={`bg-white rounded-lg shadow p-6 dark:bg-gray-800 ${isRegistrar ? "lg:col-span-3" : ""}`}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/piu/admin/students/add"
              className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Add New Student
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </Link>
            <Link
              to="/piu/admin/students"
              className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              View All Students
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <Link
              to="/piu/admin/modules/add"
              className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Add Course Module
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" />
              </svg>
            </Link>
            <Link
              to="/piu/admin/students/grading"
              className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Student Grading
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Link>
            <Link
              to="/piu/admin/assignments/add"
              className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Add Assignment
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </Link>
            {!isRegistrar && (
              <>
                <Link
                  to="/piu/admin/new"
                  className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Create Course
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </Link>
                <Link
                  to="/piu/admin/admission"
                  className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Review Admissions
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;