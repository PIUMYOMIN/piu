import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/user/LoadingSpinner";

export default function Faculties() {
    const [facultyMembers, setFacultyMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await fetch("https://dashboard.piueducation.org/api/v1/team");
                const data = await response.json();
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
        return <LoadingSpinner />;
      }

    return (
        <div className="max-w-7xl mx-auto font-robotoSlab py-8">
            <h3 className="text-5xl font-bold text-center mb-8">Our Faculties</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {facultyMembers.map((faculty) => {
                    const imageUrl = `https://dashboard.piueducation.org/storage/${faculty.profile}`;

                    return (
                        <div key={faculty.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <img 
                                src={imageUrl} 
                                alt={faculty.name} 
                                className="w-full object-cover" 
                                onError={(e) => e.target.src = 'https://via.placeholder.com/150'} 
                            />
                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-2">{faculty.name}</h3>
                                <p className="text-gray-600 mb-4">{faculty.position?.name}</p>
                                <Link to={`/faculties/${faculty.slug}`} className="text-blue-500 hover:text-blue-700 font-semibold">
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
