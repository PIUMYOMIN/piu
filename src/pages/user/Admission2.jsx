import React, { useState } from 'react';
// import './App.css';

function Admission2() {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    courses: '',
    dob: '',
    nrc: '',
    studentid: '',
    materialStatus: '',
    country: '',
    city: '',
    postalCode: '',
    picture: '',
    personalStatement: '',
    recommendationLetters: '',
    academicRecords: '',
    englishTest: '',
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen((prevState) => !prevState);
  }

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleBack = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,  // Handle file inputs
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted', formData);
    // Add form submission logic here
  };

  return (
    <div className="max-w-7xl mx-auto font-robotoSlab">
        <div className="flex justify-between p-5">
            <div className="w-1/2 p-5 shadow-lg rounded-lg bg-gray-100">
                <h2 className="mb-4 text-xl font-bold">Admission Requirements</h2>
                <ul className="list-disc ml-5 mb-5">
                    <li>Completed high school or GED or IGCSE</li>
                    <li>Personal Statement Essay</li>
                    <li>Two letters of recommendation</li>
                    <li>Have at least an IELTS band score of 5.5 or an equivalent score on other standardized English Language Proficiency tests, or if not, sit the entrance exam for English language proficiency.</li>
                </ul>

                <hr className='py-3'/>

                <h2 className="mb-4 text-xl font-bold">Tution Fees</h2>
                <p className='mb-3'>The tution fees for any program is 40,000 MMK for one credit unit. The minimum credit units required to complete any of our bachelor’s degree programs are 120. The credit system may vary according to the nature of the school and the area of study.</p>

                <hr className='py-3'/>

                <h2 className="mb-4 text-xl font-bold text-orange-500">Notice!!!</h2>
                <p>Dear Students, If you have submitted your admission form and do not receive a response from the school within 7 days, please reach out directly to the admissions team at piu.edu2014@gmail.com for assistance. Thank you!</p>

            </div>
            <div className="w-1/2 p-5 shadow-lg rounded-lg bg-white">
            {open === false && (
                <div className='text-center'>
                    <h3 className='font-bold text-2xl mb-5'>Application Guide</h3>
                    <ul className='list-disc text-left ml-5 mb-5'>
                        <li>Complete the application form.</li>
                        <li>You will receive a reply via email within 7 days.</li>
                        <li>If you do not have an IELTS or equivalent certification, you will need to take an entrance exam administered by PIU.</li>
                        <li>Upon passing the exam, you will receive an acceptance email.</li>
                        <li>If you decide to attend the school, please visit the campus in person to complete your registration.</li>

                    </ul>
                    <p className='py-2'>We are open now</p>
                    <button className='bg-orange-500 hover:bg-orange-700 text-2xl text-white font-bold py-5 px-10 rounded' onClick={handleOpen}>Apply Now</button>
                </div>
            )}
            {open === true && (
                <>
                <h2 className="text-center mb-5 text-xl font-bold">University Admission Form</h2>
                <form onSubmit={handleSubmit}>
                {page === 1 && (
                    <div className="space-y-4">
                    <div className="form-group">
                        <label htmlFor="firstName" className="block mb-1">First Name:</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="middleName" className="block mb-1">Middle Name:</label>
                        <input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} placeholder='Optional' className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName" className="block mb-1">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="block mb-1">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone" className="block mb-1">Phone:</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender" className="block mb-1">Gender:</label>
                        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="courses" className="block mb-1">Courses:</label>
                        <select id="courses" name="courses" value={formData.courses} onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm">
                            <option value="">Select Courses</option>
                            <option value="ict">Bachelor of Information Technology</option>
                            <option value="edu">Bachelor of Education</option>
                            <option value="nur">Bachelor of Nursing Science</option>
                            <option value="tour">Bachelor of Tourism</option>
                        </select>
                    </div>
                    <button type="button" onClick={handleNext} className="mt-5 p-1 px-5 bg-blue-500 text-white rounded hover:bg-blue-600 float-right">Next</button>
                    </div>
                )}
                {page === 2 && (
                    <div className="space-y-4">
                        <div className="form-group">
                        <label htmlFor="dob" className="block mb-1">Date Of Birth</label>
                        <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nrc" className="block mb-1">NRC or Passport</label>
                        <input type="text" id="nrc" name="nrc" value={formData.nrc} onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="studentid" className="block mb-1">Student ID</label>
                        <input type="text" id="studentid" name="studentid" value={formData.postalCode} onChange={handleChange} className="w-full p-1 border border-gray-300 rounded text-sm" placeholder="If you are alumni" />
                    </div>

                    <div className="form-group">
                    <label htmlFor="materialStatus" className="block mb-1">Material Status</label>
                    <select id="materialStatus" name="materialStatus" value={formData.materialStatus} onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm">
                        <option value="">Select Your Status</option>
                        <option value="s">Single</option>
                        <option value="m">Married</option>
                        <option value="o">Others</option>
                    </select>
                    </div>


                    <div className="form-group">
                        <label htmlFor="country" className="block mb-1">Country</label>
                        <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city" className="block mb-1">City and Address</label>
                        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="postalCode" className="block mb-1">Postal Code</label>
                        <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>
                    
                    
                    <div className="flex justify-between mt-5">
                        <button type="button" onClick={handleBack} className="p-1 px-5 bg-gray-500 text-white rounded hover:bg-gray-600">Back</button>
                        <button type="button" onClick={handleNext} className="mt-5 p-1 px-5 bg-blue-500 text-white rounded hover:bg-blue-600">Next</button>
                    </div>
                    </div>
                )}
                {page === 3 && (
                    <div className="space-y-4">
                    <div className="form-group">
                        <label htmlFor="picture" className="block mb-1">Profile Picture</label>
                        <input type="file" id="picture" name="picture" onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="personalStatement" className="block mb-1">Personal Statement</label>
                        <input type="file" id="personalStatement" name="personalStatement" onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="recommendationLetters" className="block mb-1">Recommendation Letters:<small>(Two letters)</small></label>
                        <input type="file" id="recommendationLetters" name="recommendationLetters" onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                        <input type="file" id="recommendationLetters" name="recommendationLetters" onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="academicRecords" className="block mb-1">Academic Records: <small>(Myanmar Matriculation Exam or GED or IGCSE)</small></label>
                        <input type="file" id="academicRecords" name="academicRecords" onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="englishTest" className="block mb-1">English Level Test:</label>
                        <input type="file" id="englishTest" name="englishTest" onChange={handleChange} required className="w-full p-1 border border-gray-300 rounded text-sm" />
                    </div>
                    <div className="flex justify-between mt-5">
                        <button type="button" onClick={handleBack} className="p-1 px-5 bg-gray-500 text-white rounded hover:bg-gray-600">Back</button>
                        <button type="submit" className="p-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600">Submit</button>
                    </div>
                    </div>
                )}
                </form>
                </>
            )}
            </div>
        </div>
    </div>
  );
}

export default Admission2;
