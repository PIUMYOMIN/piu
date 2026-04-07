import React from "react";
import { Link } from "react-router-dom";

export default function ContactFormSubmittedSuccessful() {
  return (
    <div className="max-w-7xl mx-auto px-3 py-10">
      <div className="max-w-2xl mx-auto rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center">
              <i className="fas fa-paper-plane text-xl"></i>
            </div>
            <div>
              <div className="text-2xl font-bold">Message sent</div>
              <div className="mt-1 text-sm text-white/90">
                Thanks for contacting PIU. We’ve received your message.
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="font-semibold text-gray-900">What happens next?</div>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>- Our team will review your message and reply as soon as possible.</li>
              <li>- If your matter is urgent, please call: <span className="font-semibold">+09-793200074</span></li>
            </ul>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl bg-[#002147] hover:bg-[#001a3a] text-white px-5 py-3 font-semibold"
            >
              Back to home
            </Link>
            <Link
              to="/contact-us"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white hover:bg-gray-50 px-5 py-3 font-semibold text-gray-900"
            >
              Send another message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
