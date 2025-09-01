import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell
} from "recharts";

const mockStats = {
  totalStudents: 1235,
  newAdmissions: 58,
  activeCourses: 45,
  pendingQueries: 12,
};

const recentQueries = [
  { id: 1, name: "John Doe", message: "Interested in Computer Science", time: "2 hours ago" },
  { id: 2, name: "Jane Smith", message: "Asked about scholarship", time: "5 hours ago" },
  { id: 3, name: "Mark Lee", message: "Wants campus tour", time: "1 day ago" },
  { id: 4, name: "Sara Khan", message: "Inquiring about fees", time: "1 day ago" },
];

const enrollmentData = [
  { month: "Jan", students: 100 },
  { month: "Feb", students: 120 },
  { month: "Mar", students: 150 },
  { month: "Apr", students: 170 },
  { month: "May", students: 160 },
  { month: "Jun", students: 180 },
  { month: "Jul", students: 200 },
  { month: "Aug", students: 210 },
  { month: "Sep", students: 230 },
  { month: "Oct", students: 250 },
  { month: "Nov", students: 270 },
  { month: "Dec", students: 300 },
];

const courseDistribution = [
  { name: "Computer Science", value: 35 },
  { name: "Business", value: 25 },
  { name: "Engineering", value: 20 },
  { name: "Arts", value: 15 },
  { name: "Other", value: 5 },
];

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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Total Students" 
          value={mockStats.totalStudents} 
          icon={studentIcon}
          trend={{ value: 12, label: 'from last month' }}
        />
        <Card 
          title="New Admissions" 
          value={mockStats.newAdmissions} 
          icon={admissionIcon}
          trend={{ value: 5, label: 'this week' }}
        />
        <Card 
          title="Active Courses" 
          value={mockStats.activeCourses} 
          icon={courseIcon}
          trend={{ value: 3, label: 'new courses' }}
        />
        <Card 
          title="Pending Queries" 
          value={mockStats.pendingQueries} 
          icon={queryIcon}
          trend={{ value: -2, label: 'since yesterday' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Enrollment Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={enrollmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#002147" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Distribution Chart */}
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Course Distribution</h2>
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
        </div>
      </div>

      {/* Recent Queries and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Admission Queries */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Admission Queries</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
              View all
            </button>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentQueries.map((query) => (
              <li key={query.id} className="py-3">
                <div className="flex justify-between">
                  <p className="font-semibold text-gray-900 dark:text-white">{query.name}</p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{query.time}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{query.message}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
              <Link to="/piu/admin/students/add">Add New Student</Link>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
              <Link to="/piu/admin/new">Create Course</Link>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
              Generate Report
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
              Send Notification
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;