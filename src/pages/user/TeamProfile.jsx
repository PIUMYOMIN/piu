import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../components/user/LoadingSpinner";
import { v1 } from "../../api/v1";
import { toStorageUrl } from "../../api/axios";

export default function TeamProfile() {
  const { slug } = useParams();
  const [teamProfileDetails, setTeamProfileDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () => {
      const fetchTeamProfile = async () => {
        try {
          const data = await v1.getTeamMember(slug);
          setTeamProfileDetails(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching team profile:", error);
          setLoading(false);
        }
      };
      fetchTeamProfile();
    },
    [slug]
  );

  if (loading || !teamProfileDetails) {
    return <LoadingSpinner />;
  }

  return <div className="max-w-7xl mx-auto">
      <div className="lg:flex py-10" key="">
        <div className="lg:w-1/2 lg:px-0 px-2">
          <img
            src={toStorageUrl(teamProfileDetails.profile)}
            alt=""
            className="w-96"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/384x384?text=PIU";
            }}
          />
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
