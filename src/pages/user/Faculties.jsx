import React from "react";
import { Link } from "react-router-dom";
import { facultyMembers } from "./assets/data";

export default function Faculties() {
    return (
        <div className="max-w-7xl mx-auto font-robotoSlab py-8">
            <h3 className="text-5xl font-bold text-center mb-8">Our Faculites</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {facultyMembers.map((faculty) => {
                    return (
                        <div key={faculty.name} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <img src={faculty.image} alt={faculty.name} className="w-full object-cover" />
                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-2">{faculty.name}</h3>
                                <p className="text-gray-600 mb-4">{faculty.title}</p>
                                <Link to={`/faculties/${faculty.name}`} className="text-blue-500 hover:text-blue-700 font-semibold" >View Profile</Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}