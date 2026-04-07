import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/user/LoadingSpinner";
import { v1 } from "../../api/v1";
import { toStorageUrl } from "../../api/axios";

export default function Faculties() {
    const [facultyMembers, setFacultyMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const data = await v1.getTeam();
                setFacultyMembers(data);
            } catch (error) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchFaculties();
    }, []);

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
                <h3 className="text-3xl md:text-4xl font-extrabold text-center mb-3 text-gray-900">Our Faculties</h3>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-6">
                    Meet our faculty members and learn more about their background and departments.
                </p>
                <p className="text-center text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto font-robotoSlab px-4 py-12">
            <div className="text-center mb-10">
                <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900">Our Faculties</h3>
                <p className="text-gray-600 mt-3 max-w-3xl mx-auto">
                    Discover our teaching team. Click a card to view the full profile and biography.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {facultyMembers.map((faculty) => {
                    const imageUrl = toStorageUrl(faculty.profile) || `https://via.placeholder.com/150`;

                    return (
                        <Link
                            key={faculty.id}
                            to={`/faculties/${faculty.slug}`}
                            className="group block rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all overflow-hidden focus:outline-none focus:ring-4 focus:ring-indigo-100 sm:hover:-translate-y-0.5"
                        >
                            <div className="sm:block flex gap-4 p-4 sm:p-0">
                              <div className="relative aspect-square sm:aspect-[4/3] w-24 sm:w-auto flex-shrink-0 rounded-xl sm:rounded-none overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                                <img
                                    src={imageUrl}
                                    alt={faculty.name}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/300x225?text=PIU";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                                    <div className="text-white font-semibold truncate">{faculty.name}</div>
                                    <div className="text-white/80 text-sm truncate">{faculty.position?.name || "Faculty"}</div>
                                </div>
                            </div>

                            <div className="p-0 sm:p-5 flex-1">
                                <div className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
                                    {faculty.name}
                                </div>
                                <div className="mt-1 text-sm text-gray-600 truncate">
                                    {faculty.position?.name || "Faculty"}
                                </div>
                                <div className="mt-2 text-sm text-gray-500 truncate">
                                    {faculty.department?.name || "—"}
                                </div>

                                <div className="mt-4 inline-flex items-center text-indigo-600 font-semibold text-sm">
                                    View Profile
                                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                                </div>
                            </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {facultyMembers.length === 0 && (
                <div className="mt-10 text-center text-gray-600">
                    No faculty members available right now.
                </div>
            )}
        </div>
    );
}
