import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? "" : "Name is required.";
    tempErrors.email = formData.email ? "" : "Email is required.";
    tempErrors.subject = formData.subject ? "" : "Subject is required.";
    tempErrors.message = formData.message ? "" : "Message is required.";
    setErrors({ ...tempErrors });
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      // Here, you would normally handle the form submission, e.g., send the data to a server
      console.log('Form data:', formData);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      {submitted ? (
        <div className="text-green-500">Thank you for your message! We will get back to you soon.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
          </div>
          <div>
            <label className="block mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
          </div>
          <div>
            <label className="block mb-1" htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.subject && <div className="text-red-500 text-sm">{errors.subject}</div>}
          </div>
          <div>
            <label className="block mb-1" htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded`}
              rows="5"
            />
            {errors.message && <div className="text-red-500 text-sm">{errors.message}</div>}
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Send Message</button>
        </form>
      )}
    </div>
  );
}
