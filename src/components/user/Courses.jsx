import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://dashboard.piueducation.org/api/v1/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch course.");
        } else {
          const data = await response.json();
          setCourses(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Network Error found.", error);
      }
    };

    fetchCourses();
  }, []);

  const maxCourse = 8;
  const courseLimit = courses.slice(0, maxCourse);

  function getColorClass(categoryId) {
    switch (categoryId) {
      case 1:
        return "bg-red-400 rounded-full px-2 text-white text-sm";
      case 2:
        return "bg-green-400 rounded-full px-2 text-white text-sm";
      case 3:
        return "bg-orange-400 rounded-full px-2 text-white text-sm";
      case 4:
        return "bg-slate-400 rounded-full px-2 text-white text-sm";
      default:
        return "bg-blue-400 rounded-full px-2 text-white text-sm";
    }
  }
  return <div className="w-full bg-primary-background py-8 px-2">
      {loading ? <LoadingSpinner /> : <div className="max-w-7xl mx-auto">
            <div className="flex flex-row justify-between items-center my-3">
              <h2 className="text-4xl my-3 font-oswald font-medium">
                {" "}COURSES
              </h2>
              <Link to="/courses" className="flex flex-row items-center hover:underline gap-2">
                <span className="text-gray-500">List All</span>
                <FaAngleRight className="lg:w-7 w-5 lg:h-7 h-5 lg:p-2 p-1 bg-gray-500 text-white rounded-full" />
              </Link>
            </div>
            <div className="grid lg:grid-cols-4 grid-cols-2 gap-1">
              {courseLimit.map((course, index) =>
                <Link
                  to={`/courses/${course.slug}`}
                  className="flex flex-col overflow-hidden px-2"
                  data-aos="fade-up"
                  key={index}
                >
                  <img
                    src={`https://dashboard.piueducation.org/storage/${course.image}`}
                    alt=""
                    className="object-cover lg:h-48 hover:scale-105 transition-all duration-200 ease-in"
                  />
                  <div className="py-2">
                    <div className="flex flex-row justify-between">
                      <span
                        className={getColorClass(
                          course.category ? course.category.id : null
                        )}
                      >
                        {course.category
                          ? course.category.name
                          : "No Category"}
                      </span>
                      <small className="hidden sm:inline lg:text-normal text-sm font-montserrat font-regular">
                        {course.duration}
                      </small>
                    </div>
                    <div className="lg:text-xl block hover:underline my-2 transition duration-300 ease-in-out hover:text-orange-400">
                      {course.title}
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>}
    </div>;
}
