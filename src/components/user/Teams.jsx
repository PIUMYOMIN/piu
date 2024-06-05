import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const teamFetch = async () => {
      try {
        const response = await fetch("https://dashboard.piueducation.org/api/v1/team");

        if (!response.ok) {
          throw new Error("message", "Failed to fetch team.");
        } else {
          const data = await response.json();
          setTeams(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoading(false);
      }
    };
    teamFetch();
  }, []);

  return <div>
      {loading ? <LoadingSpinner /> : <div className="my-8 lg:px-0 px-2">
            <div>
              <div>
                <div className="text-2xl">OUR FACULTY</div>
              </div>
              <div className="flex gap-1">
                <div className="w-8 border-b-2 border-slate-400" />
                <div className="w-12 border-b-2 border-slate-500" />
              </div>
            </div>
            <div className="grid lg:grid-cols-4 grid-cols-2 gap-3 my-8">
              {teams.map((team, index) =>
                <Link to={`/team/${team.slug}`} key={index}>
                  <div className="overflow-hidden">
                    <img
                      src={`https://piueducation.org/storage/${team.profile}`}
                      alt=""
                      className="lg:h-52 h-36"
                    />
                  </div>
                  <div className="my-3">
                    <div className="text-xl">
                      {team.name}
                    </div>
                    <p>
                      {team.position && team.position.name}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </div>}
    </div>;
}
