import React from "react";
import { Link } from "react-router-dom";

export default function ContactFormSubmittedSuccessful() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="max-w-xl mx-auto my-48 bg-slate-500 text-white rounded-lg overflow-hidden font-montserrat font-regular">
        <div className="text-xl text-center py-3 bg-slate-600">
          Your contact message is successfully sent.
        </div>
        <div className="p-6">
          <p>
            Thank you for contacting us. We have received your message and will
            get back to you as soon as possible. If you have any urgent
            inquiries, feel free to call us directly.
          </p>
          <div className="mt-5 text-center">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
