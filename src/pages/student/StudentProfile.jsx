// StudentProfile.jsx
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const StudentProfile = () => {
  const {studentName} = useOutletContext();

  const [student] = useState({
    name: "Alex Johnson",
    studentId: "S12345678",
    major: "Computer Science",
    gpa: 3.75,
    email: "alex.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    enrollmentYear: 2022,
    expectedGraduation: 2026,
    standing: "Junior",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  });

  const [courses] = useState([
    { code: "CS301", name: "Data Structures", credits: 4, grade: "A-" },
    { code: "CS305", name: "Algorithms", credits: 4, grade: "B+" },
    { code: "MATH202", name: "Discrete Mathematics", credits: 3, grade: "A" },
    { code: "PHIL101", name: "Ethics in Technology", credits: 3, grade: "A-" },
    { code: "CS310", name: "Database Systems", credits: 4, grade: "B+" }
  ]);

  const [performance] = useState({
    assignment: 87,
    attendance: 95,
    participation: 92,
    overall: 89
  });

  const ProgressBar = ({ percentage, color }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <span className={`text-xl ${color.replace('bg-', 'text-')}`}>
            {icon}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{studentName}</h1>
          <p className="text-gray-600 mt-2">Academic information and performance metrics</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
                <h2 className="text-xl font-bold text-gray-900 mt-4">{student.name}</h2>
                <p className="text-gray-600">{student.major}</p>
                <p className="text-sm text-gray-500 mt-1">Student ID: {student.studentId}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{student.gpa}</p>
                    <p className="text-xs text-gray-600">GPA</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{student.standing}</p>
                    <p className="text-xs text-gray-600">Standing</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-envelope mr-3 w-4 text-blue-500"></i>
                  {student.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-phone mr-3 w-4 text-blue-500"></i>
                  {student.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-calendar mr-3 w-4 text-blue-500"></i>
                  {student.enrollmentYear} - {student.expectedGraduation}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Assignments</span>
                    <span className="font-medium">{performance.assignment}%</span>
                  </div>
                  <ProgressBar percentage={performance.assignment} color="bg-blue-500" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Attendance</span>
                    <span className="font-medium">{performance.attendance}%</span>
                  </div>
                  <ProgressBar percentage={performance.attendance} color="bg-green-500" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Participation</span>
                    <span className="font-medium">{performance.participation}%</span>
                  </div>
                  <ProgressBar percentage={performance.participation} color="bg-purple-500" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Overall Performance</span>
                    <span className="font-medium">{performance.overall}%</span>
                  </div>
                  <ProgressBar percentage={performance.overall} color="bg-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Courses and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Total Credits"
                value="54"
                subtitle="Completed / 120 required"
                icon="📚"
                color="bg-blue-500"
              />
              <StatCard
                title="Courses This Semester"
                value="5"
                subtitle="15 credit hours"
                icon="🎓"
                color="bg-green-500"
              />
              <StatCard
                title="Assignments Due"
                value="3"
                subtitle="Next 7 days"
                icon="⏰"
                color="bg-yellow-500"
              />
              <StatCard
                title="Academic Standing"
                value="Good"
                subtitle="No issues reported"
                icon="✅"
                color="bg-emerald-500"
              />
            </div>

            {/* Current Courses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Current Courses</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {courses.map((course, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{course.code} - {course.name}</h4>
                        <p className="text-sm text-gray-600">{course.credits} credits</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          course.grade === 'A' ? 'bg-green-100 text-green-800' :
                          course.grade.includes('A') ? 'bg-blue-100 text-blue-800' :
                          course.grade.includes('B') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.grade}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">Current Grade</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Academic Advisor</h4>
                  <p className="text-gray-600">Dr. Sarah Williams</p>
                  <p className="text-sm text-gray-500">sarah.williams@university.edu</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Department</h4>
                  <p className="text-gray-600">Computer Science & Engineering</p>
                  <p className="text-sm text-gray-500">Building A, Room 305</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Scholarships</h4>
                  <p className="text-gray-600">Dean's Scholarship</p>
                  <p className="text-sm text-gray-500">$5,000 per semester</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Extracurricular</h4>
                  <p className="text-gray-600">Programming Club, Chess Team</p>
                  <p className="text-sm text-gray-500">Active member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;