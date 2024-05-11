import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarCheck } from "react-icons/fa";

const LoadingSpinner = () =>
  <div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
  </div>;

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("https://piueducation.org/api/v1/news");
        if (!response.ok) {
          throw new Error("Failed to fetch news.");
        } else {
          const data = await response.json();
          setNews(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);
  return <div className="w-full bg-secondary-background lg:py-8 px-2 overflow-hidden">
      {loading ? <LoadingSpinner /> : <div className="max-w-7xl mx-auto">
            <div className="text-center mt-8 mb-10">
              <h2 className="text-4xl my-3 font-oswald font-medium">
                {" "}NEWS & EVENTS
              </h2>
              <p className="font-montserrat font-regular">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
                excepturi beatae vel doloribus eveniet corrupti.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {news.map((newItem, index) =>
                <Link
                  to={`/piu/news/${newItem.slug}`}
                  className="md:mb-2 pb-2 w-96 hover:shadow-2xl transition duration-300 ease-in-out rounded-md"
                  data-aos="fade-up"
                  key={index}
                >
                  <div className="overflow-hidden h-60">
                    <img
                      src={`https://piueducation.org/storage/${newItem.image}`}
                      alt=""
                      className="object-fit w-full hover:scale-105 transition duration-300 ease-out h-full"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="text-xl md:pl-5 my-5 hover:text-orange-500 transition duration-300 ease-in-out">
                      <p>
                        {newItem.title}
                      </p>
                    </div>
                    <div className="flex flex-row justify-between text-zinc-400 md:pl-2">
                      <div>
                        <p>Faculty of PIU</p>
                      </div>
                      <div className="flex justify-center items-center pr-2">
                        <FaCalendarCheck /> &nbsp;
                        {new Date(newItem.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>}
    </div>;
}
