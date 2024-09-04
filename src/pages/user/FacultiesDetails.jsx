import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { facultyMembers } from "./assets/data";
import { FaArrowLeft, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function FacultiesDetails(){

    const {facultyName} = useParams();

    const selectedName = facultyMembers
    .flatMap((member) => member)
    .find((p) => p.name === facultyName);

    if(!selectedName){
        return <div><h1>Faculty Member Not Found</h1></div>
    }

    return (
        <div className="max-w-7xl mx-auto font-robotoSlab">
            <div className="flex justify-start items-start py-5 bg-gradient-to-b from-blue-200 to-white relative">
                <div className="m-5 ml-12">
                    <img src={selectedName.image} alt="" />
                </div>
                <div className="m-5">
                    <h3 className="text-4xl font-bold">{selectedName.name}</h3>
                    <h5 className="mb-3">{selectedName.position}</h5>
                    <h3 className="text-xl uppercase font-bold mb-3">Contact</h3>
                    <ul>
                        <li className="mb-3"><a href={`tel:${selectedName.phone}`}><FaPhone className="inline mx-3"/>+{selectedName.phone}</a></li>
                        <li><a href={`mailto:${selectedName.email}`}><FaEnvelope className="inline mx-3"/>{selectedName.email}</a></li>
                    </ul>
                    {selectedName.id !== 1 && selectedName.id !== 2 && (
                        <div className="mt-8">
                            <h3 className="text-xl uppercase font-bold">Department</h3>
                            <ul className="list-disc ml-5 mt-3">
                                {selectedName.depts.map((dept, index) => (
                                    <li key={index} className="ml-3">
                                        {dept}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="absolute right-2.5 bottom-2.5 rounded-full border-2 border-blue-400 p-2 bg-white hover:animate-bounce">
                    <Link to="/faculties"><FaArrowLeft className="text-blue-500"/></Link>
                </div>

            </div>

            <div className="bg-blue-50 py-5 relative">
                <h3 className="text-2xl font-bold uppercase m-5 ml-12">Biography</h3>
                <p className="m-5 ml-12">{selectedName.bio}</p>

                {selectedName.id === 1 && (
                    <div className="absolute right-2.5 bottom-2.5 rounded-full border-2 border-blue-400 p-2 bg-white">
                    <Link to={selectedName.link}>More</Link>
                </div>
                )}
            </div>
            
            
        </div>
    )
}