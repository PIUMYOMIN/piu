import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Admission() {
  const [error, setError] = useState({});
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [marital_sts, setMaritalStatus] = useState("");
  const [national_id, setNationalId] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [student_id, setStudentId] = useState("");
  const [alumni_sts, setAlumni] = useState("");
  const [profile, setProfile] = useState("");
  const [personal_statement, setPersonalStatement] = useState("");
  const [language_proficiency, setLanguageProficiency] = useState("");
  const [education_certificate, setEducationCertificate] = useState("");
  const [other_document, setOtherDocument] = useState("");
  const [course_id, setApplyCourse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://dashboard.piueducation.org/api/v1/courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        setError({ message: "Failed to fetch courses" });
      }
    };

    fetchCourses();
  }, []);

  const submitApplicationForm = async e => {
    e.preventDefault();

    // Form validation
    const newError = {};
    if (!name) newError.name = "Name is required";
    if (!email) newError.email = "Email is required";
    if (!phone) newError.phone = "Phone is required";
    if (!address) newError.address = "Address is required";
    if (!gender) newError.gender = "Gender is required";
    if (!dob) newError.dob = "Date of Birth is required";
    if (!marital_sts) newError.marital_sts = "Marital Status is required";
    if (!national_id) newError.national_id = "National ID is required";
    if (!city) newError.city = "City is required";
    if (!country) newError.country = "Country is required";
    if (!zipcode) newError.zipcode = "Zipcode is required";
    if (!alumni_sts) newError.alumni_sts = "Alumni status is required";
    if (!profile) newError.profile = "Profile picture is required";
    if (!personal_statement) newError.personal_statement = "Personal statement is required";
    if (!language_proficiency) newError.language_proficiency = "Language proficiency test is required";
    if (!education_certificate) newError.education_certificate = "Education certificate is required";
    if (!other_document) newError.other_document = "Other document is required";
    if (!course_id) newError.course_id = "Apply course is required";

    setError(newError);

    if (Object.keys(newError).length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("country", country);
    formData.append("zipcode", zipcode);
    formData.append("dob", dob);
    formData.append("alumni_sts", alumni_sts);
    formData.append("student_id", student_id);
    formData.append("marital_sts", marital_sts);
    formData.append("gender", gender);
    formData.append("national_id", national_id);
    formData.append("course_id", course_id);
    formData.append("profile", profile);
    formData.append("personal_statement", personal_statement);
    formData.append("language_proficiency", language_proficiency);
    formData.append("education_certificate", education_certificate);
    formData.append("other_document", other_document);

    try {
      const response = await fetch(
        "https://dashboard.piueducation.org/api/v1/application-form/submit",
        {
          method: "POST",
          body: formData
        }
      );

      console.log(response);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      navigate("/admissions/application-form-submitted-successfully");
    } catch (error) {
      setError({
        form: "An error occurred while submitting the application form."
      });
    }
  };

  return <div className="max-w-7xl mx-auto">
      <div className="flex justify-center items-center lg:my-8 my-5 px-2">
        <form className="max-w-6xl my-5 overflow-hidden" onSubmit={submitApplicationForm}>
          <div className="hidden lg:block mt-8 mb-14 py-2 text-center border-b border-black">
            <div className="text-xl">Applicant Information Form</div>
            <div className="flex flex-row justify-between mt-3">
              <div>Phaung Daw Oo International University</div>
              <div>Help line: +09-793200074</div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                Name
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.name ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-first-name" type="text" placeholder="Name" onChange={e => setName(e.target.value)} />
              {error.name && <p className="text-red-500 text-xs italic">
                  {error.name}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-email">
                Email
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.email ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-email" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
              {error.email && <p className="text-red-500 text-xs italic">
                  {error.email}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-phone">
                Phone
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.phone ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-phone" type="number" placeholder="Phone Number" onChange={e => setPhone(e.target.value)} />
              {error.phone && <p className="text-red-500 text-xs italic">
                  {error.phone}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-address">
                Address
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.address ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-address" type="text" placeholder="Address" onChange={e => setAddress(e.target.value)} />
              {error.address && <p className="text-red-500 text-xs italic">
                  {error.address}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                Sex
              </label>
              <div className="relative">
                <select className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.gender ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-state" onChange={e => setGender(e.target.value)}>
                  <option disabled>Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M10 3a1 1 0 01.293.707v10.586l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.293V3.707A1 1 0 0110 3z" />
                  </svg>
                </div>
              </div>
              {error.gender && <p className="text-red-500 text-xs italic">
                  {error.gender}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
                Date of Birth
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.dob ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-zip" type="date" onChange={e => setDob(e.target.value)} />
              {error.dob && <p className="text-red-500 text-xs italic">
                  {error.dob}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                Marital Status
              </label>
              <div className="relative">
                <select className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.marital_sts ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-state" onChange={e => setMaritalStatus(e.target.value)}>
                  <option disabled>Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M10 3a1 1 0 01.293.707v10.586l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.293V3.707A1 1 0 0110 3z" />
                  </svg>
                </div>
              </div>
              {error.marital_sts && <p className="text-red-500 text-xs italic">
                  {error.marital_sts}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-national-id">
                National ID
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.national_id ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-national-id" type="text" placeholder="National ID" onChange={e => setNationalId(e.target.value)} />
              {error.national_id && <p className="text-red-500 text-xs italic">
                  {error.national_id}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
                City
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.city ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-city" type="text" placeholder="City" onChange={e => setCity(e.target.value)} />
              {error.city && <p className="text-red-500 text-xs italic">
                  {error.city}
                </p>}
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-country">
                Country
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.country ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-country" type="text" placeholder="Country" onChange={e => setCountry(e.target.value)} />
              {error.country && <p className="text-red-500 text-xs italic">
                  {error.country}
                </p>}
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
                Zipcode
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.zipcode ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-zip" type="text" placeholder="Zipcode" onChange={e => setZipcode(e.target.value)} />
              {error.zipcode && <p className="text-red-500 text-xs italic">
                  {error.zipcode}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                Are you Alumni of PIU?
              </label>
              <div className="relative">
                <select className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.alumni_sts ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-state" onChange={e => setAlumni(e.target.value)} defaultValue="">
                  <option value="" disabled>
                    Are you Alumni of PIU?
                  </option>
                  <option value="New_student">Yes</option>
                  <option value="Old_student">No</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M10 3a1 1 0 01.293.707v10.586l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.293V3.707A1 1 0 0110 3z" />
                  </svg>
                </div>
              </div>
              {error.alumni_sts && <p className="text-red-500 text-xs italic">
                  {error.alumni_sts}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="student_id">
                Student ID
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="student_id" type="text" placeholder="Student ID (Optional)" onChange={e => setStudentId(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-profile">
                Profile Picture
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.profile ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-profile" type="file" onChange={e => setProfile(e.target.files[0])} />
              {error.profile && <p className="text-red-500 text-xs italic">
                  {error.profile}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-profile">
                Personal Statement
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.personal_statement ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-profile" type="file" onChange={e => setPersonalStatement(e.target.files[0])} />
              {error.personal_statement && <p className="text-red-500 text-xs italic">
                  {error.personal_statement}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-education-certificate">
                Education Certificate
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.education_certificate ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-education-certificate" type="file" onChange={e => setEducationCertificate(e.target.files[0])} />
              {error.education_certificate && <p className="text-red-500 text-xs italic">
                  {error.education_certificate}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-profile">
                Language Proficiency Document
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.language_proficiency ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-profile" type="file" onChange={e => setLanguageProficiency(e.target.files[0])} />
              {error.language_proficiency && <p className="text-red-500 text-xs italic">
                  {error.language_proficiency}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-profile">
                Other Document
              </label>
              <input className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.other_document ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-profile" type="file" onChange={e => setOtherDocument(e.target.files[0])} />
              {error.otherDocument && <p className="text-red-500 text-xs italic">
                  {error.other_document}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                Apply Course
              </label>
              <div className="relative">
                <select className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.course_id ? "border-red-500" : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`} id="grid-state" onChange={e => setApplyCourse(e.target.value)}>
                  <option disabled>Apply Course</option>
                  {courses.map(course => {
                    if (course.application_sts === "1") {
                      return <option key={course.id} value={course.id}>
                          {course.title}
                        </option>;
                    }
                    return null;
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M10 3a1 1 0 01.293.707v10.586l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.293V3.707A1 1 0 0110 3z" />
                  </svg>
                </div>
              </div>
              {error.course_id && <p className="text-red-500 text-xs italic">
                  {error.course_id}
                </p>}
            </div>
          </div>
          <div className="flex flex-wrap text-center -mx-3 mb-6">
            <div className="w-full px-3">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                Submit Application
              </button>
            </div>
            {error.form && <p className="text-red-500 text-xs italic mt-4 w-full text-center">
                {error.form}
              </p>}
          </div>
        </form>
      </div>
    </div>;
}
