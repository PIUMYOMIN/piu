import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaPhone, FaEnvelope } from 'react-icons/fa';
import LoadingSpinner from "../../components/user/LoadingSpinner";

export default function FacultiesDetails() {
    const { slug } = useParams();
    const [profileDetails, setProfileDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
                const response = await fetch(
                    `https://api.piueducation.org/api/v1/team/${slug}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch faculty details.");
                }
                const data = await response.json();
                setProfileDetails(data);
            } catch (error) {
                setError("Failed to load profile details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileDetails();
    }, [slug]);

    if (loading) {
        return <LoadingSpinner />;
      }

    return (
        <div className="max-w-7xl mx-auto font-robotoSlab">
            <div className="flex justify-start items-start py-5 bg-gradient-to-b from-blue-200 to-white relative">
                <div className="m-5 ml-12">
                    <img
                        src={`https://api.piueducation.org/storage/${profileDetails.profile}`}
                        alt={profileDetails.name}
                        className="w-full object-cover"
                    />
                </div>
                <div className="m-5">
                    <h3 className="text-4xl font-bold">{profileDetails.name}</h3>
                    <h5 className="mb-3">{profileDetails.position?.name}</h5>
                    
                    
                    {
                        profileDetails.id !== 1 && profileDetails.id !== 2 && (
                            <div className="mt-8">
                                <h3 className="text-xl uppercase font-bold">Department</h3>
                                <p>{profileDetails.department.name}</p>
                            </div>
                        )
                    }
                </div>
                <div className="absolute right-2.5 bottom-2.5 rounded-full border-2 border-blue-400 p-2 bg-white animate-bounce">
                    <Link to="/faculties"><FaArrowLeft className="text-blue-500" /></Link>
                </div>
            </div>
            <div className="bg-blue-50 py-5 relative">
                <h3 className="text-2xl font-bold uppercase m-5 ml-12">Biography</h3>
                <p className="mx-12 text-justify" dangerouslySetInnerHTML={{ __html: profileDetails.description }}></p>
            </div>
        </div>
    );
}
