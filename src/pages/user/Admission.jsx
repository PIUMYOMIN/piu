import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Course from "./Courses";

export default function Admission() {
  const [error, setError] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [studentId, setStudentId] = useState("");
  const [alumni, setaAlumni] = useState("");
  const [profile, setProfile] = useState("");
  const [personalStatement, setPersonalStatement] = useState("");
  const [languageProficiency, setLanguageProficiency] = useState("");
  const [educationCertificate, setEducationCertificate] = useState("");
  const [otherDocument, setOtherDocument] = useState("");
  const [applyCourse, setApplyCourse] = useState("");

  const submitApplicationForm = async e => {
    e.preventDefault();

    const formData = {
      name,
      email,
      phone,
      address,
      city,
      country,
      zipcode,
      dob,
      alumni,
      studentId,
      maritalStatus,
      gender,
      nationalId,
      applyCourse,
      profile,
      personalStatement,
      languageProficiency,
      educationCertificate,
      otherDocument
    };

    console.log(formData);

    try {
      const response = await fetch(
        "https://piueducation.org/api/v1/admissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      console.log(response);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error) {
      setError("An error occurred while registering.");
    }
  };
  return <div className="max-w-7xl mx-auto">
      <div className="flex justify-center items-center">
        <form className="max-w-6xl my-6" onSubmit={submitApplicationForm}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                Name
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Name" onChange={e => setName(e.target.value)} />
              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-email">
                Email
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-email" type="text" placeholder="Email" onChange={e => setEmail(e.target.value)} />
              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-phone">
                Phone
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="grid-first-phone" type="text" placeholder="Phone Number" onChange={e => setPhone(e.target.value)} />
              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                Address
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Address" onChange={e => setAddress(e.target.value)} />
              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                Gender
              </label>
              <div className="relative">
                <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" onChange={e => setGender(e.target.value)}>
                  <option disabled>Gender</option>
                  <option value={"Male"}>Male</option>
                  <option value={"Female"}>Female</option>
                  <option value={"Other"}>Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
                {error && <p className="text-red-500 text-xs italic">
                    {error}
                  </p>}
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                Date of Birth
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="date" onChange={e => setDob(e.target.value)} />
              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                Marital Status
              </label>
              <div className="relative">
                <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" onChange={e => setMaritalStatus(e.target.value)}>
                  <option disabled>Marital Status</option>
                  <option value={"Single"}>Single</option>
                  <option value={"Married"}>Married</option>
                  <option value={"Other"}>Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
                {error && <p className="text-red-500 text-xs italic">
                    {error}
                  </p>}
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                National ID
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="National ID" onChange={e => setNationalId(e.target.value)} />
              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <div className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Are you an alumni?
              </div>
              <div className="flex flex-wrap py-2">
                <div className="flex items-center me-4">
                  <input id="Yes" type="radio" value={"New Student"} name="colored-radio" className="w-4 h-4 border-gray-300" onChange={e => setaAlumni(e.target.value)} />
                  <label htmlFor="Yes" className="ms-2 text-sm font-medium text-gray-900">
                    Yes
                  </label>
                </div>
                <div className="flex items-center me-4">
                  <input id="No" type="radio" value={"Old Student"} name="colored-radio" className="w-4 h-4 border-gray-300" onChange={e => setaAlumni(e.target.value)} />
                  <label htmlFor="No" className="ms-2 text-sm font-medium text-gray-900">
                    No
                  </label>
                </div>
              </div>
              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                Student Id
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Student Id" onChange={e => setStudentId(e.target.value)} />
              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                Country
              </label>
              <div className="relative">
                <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" onChange={e => setCountry(e.target.value)}>
                  <option disabled>Country</option>
                  <option value={"Myanmar"}>Myanmar</option>
                  <option value={"Thailand"}>Thailand</option>
                  <option value={"Philippines"}>Philippines</option>
                </select>
                {error && <p className="text-red-500 text-xs italic">
                    {error}
                  </p>}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                City
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="city" onChange={e => setCity(e.target.value)} />
              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
                Zip code
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder="00000" onChange={e => setZipcode(e.target.value)} />
              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                Apply Course
              </label>
              <div className="relative">
                <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" onChange={e => setApplyCourse(e.target.value)}>
                  <option disabled>Choose program</option>
                  <option value={"1"}>
                    Bachelor of Arts in Social Science
                  </option>
                  <option value={"2"}>
                    Master of Arts in Social Entrepreneurship
                  </option>
                  <option value={"4"}>
                    Bachelor Of Arts in Information Technology
                  </option>
                </select>
                {error && <p className="text-red-500 text-xs italic">
                    {error}
                  </p>}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="profile">
                Upload Your Profile Picture
              </label>
              <input className="block w-full py-3 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="profile" type="file" onChange={e => setProfile(e.target.value)} />

              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="personal_statement">
                Upload Personal Statement
              </label>
              <input className="block w-full py-3 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="personal_statement" type="file" onChange={e => setPersonalStatement(e.target.value)} />

              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="language_proficiency">
                Upload Language Proficiency Test
              </label>
              <input className="block w-full py-3 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="language_proficiency" type="file" onChange={e => setLanguageProficiency(e.target.value)} />

              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="education_certificate">
                Upload Education Certificate
              </label>
              <input className="block w-full py-3 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="education_certificate" type="file" onChange={e => setEducationCertificate(e.target.value)} />
              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="multiple_files">
                Upload Other Document
              </label>
              <input className="block w-full py-3 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="multiple_files" type="file" onChange={e => setOtherDocument(e.target.value)} />
              {error && <p className="text-red-500 text-xs italic">
                  {error}
                </p>}
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button className="shadow bg-blue-500 hover:bg-blue-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>;
}
