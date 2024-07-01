import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import {
  FaEnvelope,
  FaGlobeAsia,
  FaMapMarkerAlt,
  FaPhoneAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState("");
  const [reCapt, setReCapt] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name field is required.";
    if (!email) newErrors.email = "Email field is required.";
    if (!phone) newErrors.phone = "Phone field is required.";
    if (!country) newErrors.country = "Country field is required.";
    if (!message) newErrors.message = "Message field is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitContactForm = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formValidationErrors = validateForm();
    if (Object.keys(formValidationErrors).length > 0) {
      setErrors(formValidationErrors);
      return;
    }

    setErrors({});

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("country", country);
    formData.append("message", message);
    // const formData = { name, email, phone, country, message, reCapt };

    try {
      const response = await fetch(
        "https://dashboard.piueducation.org/api/v1/contact-form-submit",
        {
          method: "POST",
          body: formData
        }
      );
      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        throw new Error(data.error || "Something went wrong");
      }
      navigate("/contact/thank-you-for-contacting-us");
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };
  return <div className="w-full">
      <div className="max-w-7xl mx-auto bg-secondary-background">
        <div className="flex justify-center items-center h-64 bg-green-300">
          <div className="text-3xl font-oswald font-medium border-b border-black">
            Contact us
          </div>
        </div>
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-2 lg:py-5">
          <div className="flex flex-col lg:justify-center items-center p-2 text-center font-mono">
            <div className="bg-dark-purple p-5 text-white rounded-full lg:text-xl">
              <FaMapMarkerAlt />
            </div>
            Address
            <span>19st, Bet 59-60, &nbsp; Aungmyaetharsan Tsp, Mandalay</span>
          </div>
          <div className="flex flex-col lg:justify-center items-center p-2 text-center font-mono">
            <div className="bg-dark-purple p-5 text-white rounded-full lg:text-xl">
              <FaEnvelope />
            </div>
            Email
            <span>
              <Link to="mailto:piu.edu2014@gmail.com">
                piu.edu2014@gmail.com
              </Link>
            </span>
          </div>
          <div className="flex flex-col lg:justify-center items-center p-2 text-center font-mono">
            <div className="bg-dark-purple p-5 text-white rounded-full lg:text-xl">
              <FaPhoneAlt />
            </div>
            Phone
            <span>
              <Link to="tel:+09-793200074">+09-793200074</Link>
              <br />
              <Link to="tel:+09-799183631">+09-799183631</Link>
            </span>
          </div>
          <div className="flex flex-col lg:justify-center items-center p-2 text-center font-mono">
            <div className="bg-dark-purple p-5 text-white rounded-full lg:text-xl">
              <FaGlobeAsia />
            </div>
            Country
            <span>Myanmar(Burma)</span>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 my-10 bg-primary-background">
          <div className="py-5">
            <div className="text-center text-xl font-merriweather">
              We love to hear from you.
            </div>
            <form className="w-full px-5 lg:mt-8 mx-auto" onSubmit={submitContactForm}>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                    Your name
                  </label>
                  <input type="text" id="name" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="Name" onChange={e => setName(e.target.value)} />
                  {errors.name && <p className="text-red-400 italic">
                      {errors.name}
                    </p>}
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                    Your email
                  </label>
                  <input type="email" id="email" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="name@mail.com" onChange={e => setEmail(e.target.value)} />
                  {errors.email && <p className="text-red-400 italic">
                      {errors.email}
                    </p>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                    Your phone
                  </label>
                  <input type="tel" id="phone" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="+00 012 345 6547" onChange={e => setPhone(e.target.value)} />
                  {errors.phone && <p className="text-red-400 italic">
                      {errors.phone}
                    </p>}
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-700">
                    Your Country
                  </label>
                  <input type="text" id="country" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="Country" onChange={e => setCountry(e.target.value)} />
                  {errors.country && <p className="text-red-400 italic">
                      {errors.country}
                    </p>}
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                  Your message
                </label>
                <textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="message..." onChange={e => setMessage(e.target.value)} />
                {errors.message && <p className="text-red-400 italic">
                    {errors.message}
                  </p>}
              </div>
              <div className="my-3">
                <ReCAPTCHA sitekey="6LcwADUpAAAAAH3ACDhfHCqVixn1fbB2Bjrro9tY" onChange={val => setReCapt(val)} />
              </div>
              <button type="submit" className="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disabled={!reCapt}>
                Submit
              </button>
              {errors.submit && <p className="text-red-400 italic">
                  {errors.submit}
                </p>}
            </form>
          </div>
          <div className="h-auto">
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d29575.835549774383!2d96.278025!3d22.088602!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30cb6f89b745f459%3A0x55a960cb1a2c6872!2sPhaung%20Daw%20Oo%20International%20University%20(PIU)!5e0!3m2!1sen!2smm!4v1719730784142!5m2!1sen!2smm" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </div>;
}
