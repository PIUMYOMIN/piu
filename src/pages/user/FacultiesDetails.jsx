import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from "../../components/user/LoadingSpinner";
import { v1 } from "../../api/v1";
import { toStorageUrl } from "../../api/axios";

export default function FacultiesDetails() {
    const { slug } = useParams();
    const [profileDetails, setProfileDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
                const data = await v1.getTeamMember(slug);
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
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex items-center justify-center py-16">
                    <LoadingSpinner />
                </div>
            </div>
        );
      }
    if (error) {
        return (
            <div className="max-w-7xl mx-auto font-robotoSlab px-4 py-12">
                <p className="text-center text-red-600">{error}</p>
                <div className="flex justify-center mt-4">
                    <Link to="/faculties" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                        <FaArrowLeft className="mr-2" /> Back to Faculties
                    </Link>
                </div>
            </div>
        );
    }
    if (!profileDetails) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto font-robotoSlab px-4 py-10">
            <div className="mb-6">
                <Link to="/faculties" className="inline-flex items-center text-indigo-700 hover:text-indigo-900 font-semibold">
                    <FaArrowLeft className="mr-2" /> Back to Faculties
                </Link>
            </div>

            <div className="rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                <div className="relative bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 px-6 py-10 md:px-10">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
                    <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                        <div className="h-28 w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden bg-white/15 ring-4 ring-white/20 shadow">
                            <img
                                src={toStorageUrl(profileDetails.profile) || "https://via.placeholder.com/320x320?text=PIU"}
                                alt={profileDetails.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/320x320?text=PIU";
                                }}
                            />
                        </div>

                        <div className="text-white">
                            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">{profileDetails.name}</h1>
                            <div className="mt-1 text-white/90 font-semibold">
                                {profileDetails.position?.name || "Faculty"}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {profileDetails.department?.name && (
                                    <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white">
                                        {profileDetails.department.name}
                                    </span>
                                )}
                                {profileDetails.country && (
                                    <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white">
                                        {profileDetails.country}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-8 md:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Biography</h2>
                            <div className="mt-4 prose prose-slate max-w-none">
                                {profileDetails.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: profileDetails.description }} />
                                ) : (
                                    <p className="text-gray-600">No biography available.</p>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6">
                            <div className="text-sm font-bold text-gray-800 uppercase tracking-wide">Profile</div>
                            <div className="mt-4 space-y-3 text-sm text-gray-700">
                                <div>
                                    <div className="text-gray-500">Name</div>
                                    <div className="font-semibold">{profileDetails.name}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Position</div>
                                    <div className="font-semibold">{profileDetails.position?.name || "Faculty"}</div>
                                </div>
                                {profileDetails.department?.name && (
                                    <div>
                                        <div className="text-gray-500">Department</div>
                                        <div className="font-semibold">{profileDetails.department.name}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
