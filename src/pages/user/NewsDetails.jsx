import React, { useState, useLocator, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../components/user/LoadingSpinner";


export default function NewsDetails() {
  const { slug } = useParams();
  const [newsDetails, setNewsDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () => {
      const fetchNewsDetails = async () => {
        try {
          const response = await fetch(
            `https://dashboard.piueducation.org/api/v1/news/${slug}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch news details.");
          } else {
            const data = await response.json();
            setNewsDetails(data);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching course details:", error);
          setLoading(false);
        }
      };
      fetchNewsDetails();
    },
    [slug]
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  const createdDate = new Date(newsDetails.updated_at);
  const day = createdDate.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const month = monthNames[createdDate.getMonth()];
  const year = createdDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  return <div className="max-w-7xl mx-auto my-5 lg:px-0 px-3">
      <div className="lg:ml-40">
        <div className="lg:text-2xl text-gray-600 font-merriweather my-5">
          {newsDetails.title}
        </div>
        <div>
          <img src={`https://dashboard.piueducation.org/storage/${newsDetails.image}`} alt={newsDetails.title} />
          <p className="lg:ml-24">
            {formattedDate}
          </p>
        </div>
      </div>
      <div className="lg:ml-32 lg:my-10">
        <div className="lg:ml-32 text-wrap" dangerouslySetInnerHTML={{ __html: newsDetails.body }} />
      </div>
    </div>;
}
