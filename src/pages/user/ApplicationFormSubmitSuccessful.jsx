import React from "react";
import { Link } from "react-router-dom";

export default function ApplicationFormSubmitSuccessful() {
  return <div className="max-w-7xl mx-auto">
      <div className="max-w-xl mx-auto my-48 bg-slate-500 text-white rounded-lg overflow-hidden font-montserrat font-regular">
        <div className="text-xl text-center py-3 bg-slate-600">
          Your application form is successfully submitted.
        </div>
        <div className="p-3">
          Thank you for your interest our course. Your application is under review and we will contact you if your are aligable with the course.
          <div className="mt-3">
            <Link to="/" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>;
}
