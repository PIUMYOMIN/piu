import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../components/user/LoadingSpinner";

export default function TeamProfile() {
  const { slug } = useParams();
  const [teamProfileDetails, setTeamProfileDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () => {
      const fetchTeamProfile = async () => {
        try {
          const response = await fetch(
            `https://api.piueducation.org/api/v1/team/${slug}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch team profile.");
          } else {
            const data = await response.json();
            setTeamProfileDetails(data);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching team profile:", error);
          setLoading(true);
        }
      };
      fetchTeamProfile();
    },
    [slug]
  );

  if (!teamProfileDetails) {
    return <LoadingSpinner />;
  }

  return <div className="max-w-7xl mx-auto">
      <div className="lg:flex py-10" key="">
        <div className="lg:w-1/2 lg:px-0 px-2">
          <img src={`https://api.piueducation.org/storage/${teamProfileDetails.profile}`} alt="" className="w-96" />
          <div className="w-96 text-center">
            <div className="text-xl text-slate-600">
              {teamProfileDetails.name}
            </div>
            <div>
              {teamProfileDetails.position.name}
            </div>
          </div>
        </div>
        <div className="lg:w-3/4 lg:px-0 px-2">
          <div>
            <div dangerouslySetInnerHTML={{ __html: teamProfileDetails.description }} />
          </div>
        </div>
      </div>
    </div>;
}
