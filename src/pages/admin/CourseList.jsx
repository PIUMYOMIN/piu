import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CourseList = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/50",
      name: "Bachelor of Computer Science",
      category: "Bachelor",
      duration: "4 Years",
      startDate: "2025-06-01",
      endDate: "2029-05-30",
      seats: 60,
      active: true,
      applicantOpen: true,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/50",
      name: "Master of Business Administration",
      category: "Master",
      duration: "2 Years",
      startDate: "2025-09-01",
      endDate: "2027-08-31",
      seats: 30,
      active: false,
      applicantOpen: false,
    },
  ]);

  const handleDelete = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        Course List
      </h2>
      <div className="flex justify-end my-4">
        <button
          onClick={() => navigate("/piu/admin/new")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + New Course
        </button>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Image</th>
              <th className="border p-2">Course Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Duration</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Total Seats</th>
              <th className="border p-2">Active</th>
              <th className="border p-2">Applicant On/Off</th>
              <th className="border p-2">Edit</th>
              <th className="border p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="border p-2">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-10 h-10 rounded"
                  />
                </td>
                <td className="border p-2">{course.name}</td>
                <td className="border p-2">{course.category}</td>
                <td className="border p-2">{course.duration}</td>
                <td className="border p-2">{course.startDate}</td>
                <td className="border p-2">{course.endDate}</td>
                <td className="border p-2">{course.seats}</td>
                <td className="border p-2">{course.active ? "Yes" : "No"}</td>
                <td className="border p-2">
                  <input type="checkbox" checked={course.applicantOpen} readOnly />
                </td>
                <td className="border p-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                    onClick={() =>
                      navigate(`/piu/admin/new/${course.id}`, { state: course })
                    }
                  >
                    Edit
                  </button>
                </td>
                <td className="border p-2">
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseList;
