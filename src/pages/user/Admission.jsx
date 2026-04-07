import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/user/LoadingSpinner";
import { v2 } from "../../api/v2";

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
  const [profile, setProfile] = useState(null);
  const [personal_statement, setPersonalStatement] = useState(null);
  const [language_proficiency, setLanguageProficiency] = useState(null);
  const [education_certificate, setEducationCertificate] = useState(null);
  const [other_document, setOtherDocument] = useState(null);
  const [course_id, setApplyCourse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await v2.getCourses();
        setCourses(data);
      } catch (error) {
        setError({ message: "Failed to fetch courses" });
      }
    };

    fetchCourses();
  }, []);

  const validateStep = (targetStep) => {
    const newError = {};

    if (targetStep === 1) {
      if (!name) newError.name = "Name is required";
      if (!email) newError.email = "Email is required";
      if (!phone) newError.phone = "Phone is required";
      if (!gender) newError.gender = "Gender is required";
      if (!dob) newError.dob = "Date of Birth is required";
      if (!marital_sts) newError.marital_sts = "Marital Status is required";
      if (!national_id) newError.national_id = "National ID is required";
    }

    if (targetStep === 2) {
      if (!address) newError.address = "Address is required";
      if (!city) newError.city = "City is required";
      if (!country) newError.country = "Country is required";
      if (!zipcode) newError.zipcode = "Zipcode is required";
      if (!alumni_sts) newError.alumni_sts = "Alumni status is required";
    }

    if (targetStep === 3) {
      if (!course_id) newError.course_id = "Apply course is required";
      if (!(profile instanceof File)) newError.profile = "Profile picture is required";
      if (!(personal_statement instanceof File)) newError.personal_statement = "Personal statement is required";
      if (!(language_proficiency instanceof File)) newError.language_proficiency = "Language proficiency document is required";
      if (!(education_certificate instanceof File)) newError.education_certificate = "Education certificate is required";
      // other_document is optional
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const submitApplicationForm = async (e) => {
    e.preventDefault();

    // Validate all steps and jump to first invalid
    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    if (!validateStep(2)) {
      setStep(2);
      return;
    }
    if (!validateStep(3)) {
      setStep(3);
      return;
    }

    setIsLoading(true); // Start loading

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
    if (profile instanceof File) formData.append("profile", profile);
    if (personal_statement instanceof File) formData.append("personal_statement", personal_statement);
    if (language_proficiency instanceof File) formData.append("language_proficiency", language_proficiency);
    if (education_certificate instanceof File) formData.append("education_certificate", education_certificate);
    if (other_document instanceof File) formData.append("other_document", other_document);

    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }

    try {
      const responseData = await v2.submitAdmission(formData);

      // Only redirect after backend confirms email was sent to applicant (and admin).
      const applicantSent = responseData?.mail?.applicant_confirmed === true;
      const adminSent = responseData?.mail?.admin_notified === true;

      if (responseData?.success && applicantSent && adminSent) {
        navigate("/admissions/application-form/successfully-submitted");
        return;
      }

      if (responseData?.success && (!applicantSent || !adminSent)) {
        setError({
          form:
            responseData?.mail?.error ||
            "Your application was submitted, but the confirmation email could not be sent. Please contact support or try again later.",
        });
        return;
      }

      throw new Error(responseData?.message || "Unknown error occurred");

    } catch (error) {
      const status = error?.response?.status;
      if (status === 413) {
        setError({
          form:
            "Your files are too large for the server to accept (413). Please compress the documents or increase PHP upload limits (upload_max_filesize / post_max_size) in XAMPP php.ini, then try again.",
        });
      } else if (status === 422) {
        const data = error?.response?.data;
        const fieldErrors = data?.errors && typeof data.errors === "object" ? data.errors : null;

        // Convert backend errors {field: [msg]} into our error shape {field: msg}
        const next = {};
        if (fieldErrors) {
          for (const [key, val] of Object.entries(fieldErrors)) {
            next[key] = Array.isArray(val) ? val[0] : String(val || "");
          }
        }

        setError({
          ...next,
          form: data?.message || "Validation failed",
        });

        // Jump to the step that contains the first failing field so the user can fix it quickly.
        const step1Fields = new Set(["name", "email", "phone", "gender", "dob", "marital_sts", "national_id"]);
        const step2Fields = new Set(["address", "city", "country", "zipcode", "alumni_sts", "student_id"]);
        const step3Fields = new Set([
          "course_id",
          "profile",
          "personal_statement",
          "language_proficiency",
          "education_certificate",
          "other_document",
        ]);

        const keys = Object.keys(next);
        const firstKey = keys.find((k) => k && k !== "form") || "";
        if (firstKey) {
          if (step1Fields.has(firstKey)) setStep(1);
          else if (step2Fields.has(firstKey)) setStep(2);
          else if (step3Fields.has(firstKey)) setStep(3);
        }
      } else {
        setError({
          form: error?.response?.data?.message || error?.message || "An error occurred while submitting the application form.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 py-6">
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-800 p-6 text-white">
        <div className="text-2xl md:text-3xl font-bold">Admission Application</div>
        <div className="mt-1 text-sm md:text-base text-blue-100">
          Submit your application and upload the required documents. We’ll email you after a successful submission.
        </div>
        <div className="mt-3 text-sm text-blue-100">
          Help line: <span className="font-semibold text-white">+09-793200074</span>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <form
          className="w-full max-w-6xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          onSubmit={submitApplicationForm}
        >
          <div className="border-b border-gray-200 p-6">
            <div className="text-lg font-semibold text-gray-900">Applicant Information</div>
            <div className="mt-1 text-sm text-gray-500">
              Fields marked with <span className="text-red-600 font-semibold">*</span> are required.
            </div>
          </div>

          <div className="p-6">
            {error.form && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error.form}
              </div>
            )}

          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${step === 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}>1</span>
              <span className={step === 1 ? "text-gray-900" : "text-gray-600"}>Personal</span>
              <span className="text-gray-300">/</span>
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${step === 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}>2</span>
              <span className={step === 2 ? "text-gray-900" : "text-gray-600"}>Details</span>
              <span className="text-gray-300">/</span>
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${step === 3 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}>3</span>
              <span className={step === 3 ? "text-gray-900" : "text-gray-600"}>Documents</span>
            </div>

            <div className="text-sm text-gray-500">
              Step <span className="font-semibold text-gray-800">{step}</span> of{" "}
              <span className="font-semibold text-gray-800">3</span>
            </div>
          </div>

          <div className={step === 1 ? "" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Name <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.name
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-first-name"
                type="text"
                placeholder="Name"
                onChange={e => setName(e.target.value)}
              />
              {error.name &&
                <p className="text-red-500 text-xs italic">
                  {error.name}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-email"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.email
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-email"
                type="email"
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
              />
              {error.email &&
                <p className="text-red-500 text-xs italic">
                  {error.email}
                </p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-phone"
              >
                Phone <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.phone
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-phone"
                type="tel"
                placeholder="Phone Number"
                onChange={e => setPhone(e.target.value)}
              />
              {error.phone &&
                <p className="text-red-500 text-xs italic">
                  {error.phone}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-address"
              >
                Address <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.address
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-address"
                type="text"
                placeholder="Address"
                onChange={e => setAddress(e.target.value)}
              />
              {error.address &&
                <p className="text-red-500 text-xs italic">
                  {error.address}
                </p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Gender <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <select
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.gender
                    ? "border-red-500"
                    : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                  id="grid-state"
                  onChange={e => setGender(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 3a1 1 0 01.293.707v10.586l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.293V3.707A1 1 0 0110 3z" />
                  </svg>
                </div>
              </div>
              {error.gender &&
                <p className="text-red-500 text-xs italic">
                  {error.gender}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-zip"
              >
                Date of Birth <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.dob
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-zip"
                type="date"
                onChange={e => setDob(e.target.value)}
              />
              {error.dob &&
                <p className="text-red-500 text-xs italic">
                  {error.dob}
                </p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Marital Status <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <select
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.marital_sts
                    ? "border-red-500"
                    : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                  id="grid-state"
                  onChange={e => setMaritalStatus(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select marital status
                  </option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 3a1 1 0 01.293.707v10.586l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.293V3.707A1 1 0 0110 3z" />
                  </svg>
                </div>
              </div>
              {error.marital_sts &&
                <p className="text-red-500 text-xs italic">
                  {error.marital_sts}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-national-id"
              >
                National ID <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.national_id
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-national-id"
                type="text"
                placeholder="National ID"
                onChange={e => setNationalId(e.target.value)}
              />
              {error.national_id &&
                <p className="text-red-500 text-xs italic">
                  {error.national_id}
                </p>}
            </div>
          </div>
          </div>

          <div className={step === 2 ? "" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                City <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.city
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-city"
                type="text"
                placeholder="City"
                onChange={e => setCity(e.target.value)}
              />
              {error.city &&
                <p className="text-red-500 text-xs italic">
                  {error.city}
                </p>}
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-country"
              >
                Country <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.country
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-country"
                type="text"
                placeholder="Country"
                onChange={e => setCountry(e.target.value)}
              />
              {error.country &&
                <p className="text-red-500 text-xs italic">
                  {error.country}
                </p>}
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-zip"
              >
                Zipcode <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.zipcode
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-zip"
                type="text"
                placeholder="Zipcode"
                onChange={e => setZipcode(e.target.value)}
              />
              {error.zipcode &&
                <p className="text-red-500 text-xs italic">
                  {error.zipcode}
                </p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Are you Alumni of PIU? <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <select
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.alumni_sts
                    ? "border-red-500"
                    : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                  id="grid-state"
                  onChange={e => setAlumni(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Are you Alumni of PIU?
                  </option>
                  <option value="New_student">Yes</option>
                  <option value="Old_student">No</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 3a1 1 0 01.293.707v10.586l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.293V3.707A1 1 0 0110 3z" />
                  </svg>
                </div>
              </div>
              {error.alumni_sts &&
                <p className="text-red-500 text-xs italic">
                  {error.alumni_sts}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="student_id"
              >
                Student ID
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                id="student_id"
                type="text"
                placeholder="Student ID (Optional)"
                onChange={e => setStudentId(e.target.value)}
              />
            </div>
          </div>
          </div>

          <div className={step === 3 ? "" : "hidden"}>
          <div className="border-t border-gray-200 pt-6 mt-2">
            <div className="text-lg font-semibold text-gray-900">Documents</div>
            <div className="mt-1 text-sm text-gray-500">
              Upload clear and readable files. Accepted formats depend on each field.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 mt-4">
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-profile"
              >
                Profile Picture <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.profile
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-profile"
                type="file"
                onChange={e => setProfile(e.target.files[0])}
              />
              {error.profile &&
                <p className="text-red-500 text-xs italic">
                  {error.profile}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-profile"
              >
                Personal Statement <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.personal_statement
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-profile"
                type="file"
                onChange={e => setPersonalStatement(e.target.files[0])}
              />
              {error.personal_statement &&
                <p className="text-red-500 text-xs italic">
                  {error.personal_statement}
                </p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-education-certificate"
              >
                Education Certificate <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.education_certificate
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-education-certificate"
                type="file"
                onChange={e => setEducationCertificate(e.target.files[0])}
              />
              {error.education_certificate &&
                <p className="text-red-500 text-xs italic">
                  {error.education_certificate}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-profile"
              >
                Language Proficiency Document <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.language_proficiency
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-profile"
                type="file"
                onChange={e => setLanguageProficiency(e.target.files[0])}
              />
              {error.language_proficiency &&
                <p className="text-red-500 text-xs italic">
                  {error.language_proficiency}
                </p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-profile"
              >
                Other Document <span className="text-red-600">*</span>
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.other_document
                  ? "border-red-500"
                  : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                id="grid-profile"
                type="file"
                onChange={e => setOtherDocument(e.target.files[0])}
              />
              {error.other_document &&
                <p className="text-red-500 text-xs italic">
                  {error.other_document}
                </p>}
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Apply Course <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <select
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${error.course_id
                    ? "border-red-500"
                    : "border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                  id="grid-state"
                  onChange={e => setApplyCourse(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select course
                  </option>
                  {courses.map(course => {
                    if (course.application_sts === "1" || course.application_sts === 1 || course.application_sts === true) {
                      return (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      );
                    }
                    return null;
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 3a1 1 0 01.293.707v10.586l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.293V3.707A1 1 0 0110 3z" />
                  </svg>
                </div>
              </div>
              {error.course_id &&
                <p className="text-red-500 text-xs italic">
                  {error.course_id}
                </p>}
            </div>
          </div>

          <div className="flex flex-wrap text-center -mx-3 mb-2">
            <div className="w-full px-3">
              <button
                className={`text-white font-semibold py-3 px-6 rounded-lg shadow-sm ${
                  isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className="px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              >
                Continue
              </button>
            ) : (
              <div className="text-sm text-gray-500 self-center">
                reCAPTCHA is enabled silently to protect this form.
              </div>
            )}
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}
