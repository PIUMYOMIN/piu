import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarCheck } from "react-icons/fa";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://piueducation.org/api/v1/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch course.");
        } else {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);
  return (
    <div className="w-full bg-secondary-background lg:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mt-8 mb-10">
          <h2 className="text-2xl font-montserrat font-medium">
            Our Departments
          </h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
            excepturi beatae vel doloribus eveniet corrupti.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 sm:grid-1 gap-x-10 lg:gap-y-10 gap-y-10 py-5">
          {courses.map((course, index) =>
            <Link
              to="/course-details"
              className="md:mb-2 pb-2 w-96 hover:shadow-2xl transition duration-300 ease-in-out rounded-md"
              data-aos="fade-up"
              key={index}
            >
              <div className="overflow-hidden h-60">
                <img
                  src={`https://piueducation.org/storage/${course.image}`}
                  alt=""
                  className="object-fit hover:scale-105 transition duration-300 ease-out h-full"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div className="text-xl pl-5 my-5 hover:text-orange-500">
                  <p>
                    {course.title}
                  </p>
                </div>
                <div className="flex flex-row justify-between text-zinc-400">
                  <div>
                    <p>Faculty of PIU</p>
                  </div>
                  <div className="flex justify-center items-center pr-2">
                    <FaCalendarCheck /> &nbsp; {course.duration} years
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
