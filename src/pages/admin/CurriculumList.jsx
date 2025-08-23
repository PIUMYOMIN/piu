import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CurriculumList = () => {
  const navigate = useNavigate();

  const [curriculums, setCurriculums] = useState([
    {
      id: 1,
      title: "Introduction to Programming",
      description: "Basics of programming with Python",
      course: "Bachelor of Computer Science",
      year: "1",
      moduleCode: "CS101",
    },
    {
      id: 2,
      title: "Advanced Marketing",
      description: "Marketing strategies and case studies",
      course: "Master of Business Administration",
      year: "2",
      moduleCode: "MBA202",
    },
  ]);

  const handleDelete = (id) => {
    setCurriculums(curriculums.filter((cur) => cur.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2
        className="text-lg font-bold text-white p-4 rounded-t"
        style={{ backgroundColor: "#002147" }}
      >
        Curriculums List
      </h2>
        <button
          className="bg-green-600 text-white px-3 py-2 rounded text-sm"
          onClick={() => navigate("/piu/admin/add-curriculum")}
        >
          + New Curriculum
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="border p-2">#</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Course</th>
              <th className="border p-2">Year</th>
              <th className="border p-2">Module Code</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {curriculums.map((cur, index) => (
              <tr key={cur.id} className="text-sm">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{cur.title}</td>
                <td className="border p-2">{cur.description}</td>
                <td className="border p-2">{cur.course}</td>
                <td className="border p-2">{cur.year}</td>
                <td className="border p-2">{cur.moduleCode}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                    onClick={() =>
                      navigate(`/piu/admin/add-curriculum/edit/${cur.id}`, {
                        state: cur,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                    onClick={() => handleDelete(cur.id)}
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

export default CurriculumList;
