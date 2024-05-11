import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaRegClock,
  FaUsers,
  FaGlobe,
  FaHourglassHalf,
  FaCalendarCheck,
  FaDollarSign
} from "react-icons/fa";
import LoadingSpinner from "../../components/user/LoadingSpinner";
import "../../../src/custom.css";

export default function CourseDetails() {
  const { slug } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () => {
      const fetchCourseDetails = async () => {
        try {
          const response = await fetch(
            `https://piueducation.org/api/v1/courses/${slug}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch course details.");
          } else {
            const data = await response.json();
            setCourseDetails(data);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching course details:", error);
          setLoading(false);
        }
      };

      fetchCourseDetails();
    },
    [slug]
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto bg-secondary-background lg:py-8 lg:px-0 px-2">
      <div className="flex flex-col lg:flex-row gap-2">
        <main className="w-fulll lg:w-8/12">
          <div className="flex flex-col">
            <div>
              <img
                src={`https://piueducation.org/storage/${courseDetails.image}`}
                alt=""
              />
            </div>
            <div>
              <p>
                {courseDetails.title}
              </p>
            </div>
            <div />
            <div className="my-3">
              <h3 className="text-2xl">Course Overview</h3>
              <div className="font-montserrat font-normal">
                <div
                  className="font-montserrat font-normal"
                  dangerouslySetInnerHTML={{
                    __html: courseDetails.description
                  }}
                />
                <div
                  className="font-montserrat font-normal"
                  dangerouslySetInnerHTML={{
                    __html: courseDetails.requirement
                  }}
                />
              </div>
            </div>
          </div>
        </main>
        <div className="w-full lg:w-4/12 px-3">
          <div>
            <div className="px-3">
              <h4 className="text-2xl font-oswald bg-dark-purple text-white px-3 py-2 rounded-t-lg">
                Course Features
              </h4>
              <form action="">
                <ul className="text-surface font-montserrat">
                  <li className="w-full border-b border-orange-400 py-4 flex flex-row items-center gap-2">
                    <FaHome className="text-2xl text-orange-500" />{" "}
                    <div>Class Szie : 18</div>
                  </li>
                  <li className="w-full border-b border-orange-400 py-4 flex flex-row items-center gap-2">
                    <FaBook className="text-2xl text-orange-500" />{" "}
                    <div>Lectures : 12</div>
                  </li>
                  <li className="w-full border-b border-orange-400 py-4 flex flex-row items-center gap-2">
                    <FaCalendarCheck className="text-2xl text-orange-500" />{" "}
                    <div>Start : {courseDetails.start_date}</div>
                  </li>
                  <li className="w-full border-b border-orange-400 py-4 flex flex-row items-center gap-2">
                    <FaRegClock className="text-2xl text-orange-500" />{" "}
                    <div>Time : 9:00AM - 4:00PM</div>
                  </li>
                  <li className="w-full border-b border-orange-400 py-4 flex flex-row items-center gap-2">
                    <FaHourglassHalf className="text-2xl text-orange-500" />{" "}
                    <div>Duration : {courseDetails.duration}</div>
                  </li>
                  <li className="w-full border-b border-orange-400 py-4 flex flex-row items-center gap-2">
                    <FaUsers className="text-2xl text-orange-500" />
                    <div>
                      Seat : {courseDetails.total_seat}
                    </div>
                  </li>
                  <li className="w-full border-b border-orange-400 py-4 flex flex-row items-center gap-2">
                    <FaDollarSign className="text-2xl text-orange-500" />
                    <div>
                      Fees : {courseDetails.fees}
                    </div>
                  </li>
                  <li className="w-full py-4 flex flex-row items-center gap-2">
                    <FaGlobe className="text-2xl text-orange-500" />
                    <div>Language : English</div>
                  </li>
                  <li className="w-full bg-orange-400 text-center text-xl text-white font-oswald rounded-lg hover:bg-dark-purple transition duration-200 ease-in-out">
                    <button type="button" className="w-full py-4">
                      ENROLL NOW
                    </button>
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
