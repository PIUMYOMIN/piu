import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/user/LoadingSpinner";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://piueducation.org/api/v1/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch course.");
        } else {
          const data = await response.json();
          setCourses(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

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
  return (
    <div className="w-full bg-primary-background px-2">
      {loading
        ? <LoadingSpinner />
        : <div className="max-w-7xl mx-auto">
            <div className="text-center bg-green-300 py-28">
              <div className="text-3xl font-oswald">
                Faculty of the Departments
              </div>
              <p className="font-nato">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum
                necessitatibus tempore quos perferendis, magnam illo.
              </p>
            </div>
            <div className="grid lg:grid-cols-4 grid-cols-2 gap-2 mt-10">
              {courses.map((course, index) =>
                <Link
                  to={`/piu/courses/${course.slug}`}
                  className="flex flex-col overflow-hidden"
                  data-aos="fade-up"
                  key={index}
                >
                  <img
                    src={`https://piueducation.org/storage/${course.image}`}
                    alt=""
                    className="object-cover lg:h-48 h-28 hover:scale-105 transition-all duration-200 ease-in"
                  />
                  <div className="py-2">
                    <div className="flex flex-row justify-between">
                      <span
                        className={getColorClass(
                          course.category ? course.category.id : null
                        )}
                      >
                        {course.category ? course.category.name : "No Category"}
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
    </div>
  );
}
