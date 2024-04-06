import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaTelegram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEvernote,
  FaEnvelope
} from "react-icons/fa";

export default function Footer() {
  return <footer>
      <div className="w-full bg-dark-purple text-white font-montserrat px-2 lg:pt-20 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 lg:gap-5 gap-8">
            <div className="pr-3">
              <h2 className="text-2xl">About Us</h2>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Alias repellat saepe ab nemo magnam eum ullam provident,
                repudiandae nulla eos.
              </p>
              <div className="flex flex-row gap-5 text-2xl mt-5">
                <Link to="#!">
                  <FaFacebook />
                </Link>
                <Link to="#!">
                  <FaTwitter />
                </Link>
                <Link to="#!">
                  <FaYoutube />
                </Link>
                <Link to="#!">
                  <FaTelegram />
                </Link>
              </div>
            </div>
            <div>
              <h2 className="text-2xl">Useful Links</h2>
              <ul>
                <li className="list-item">
                  <Link to="#!">Home</Link>
                </li>
                <li className="list-item">
                  <Link to="#!">About Us</Link>
                </li>
                <li className="list-item">
                  <Link to="#!">Courses</Link>
                </li>
                <li className="list-item">
                  <Link to="#!">Campus</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl">Popular Courses</h2>
              <ul>
                <li className="list-item">
                  <Link to="#!">Social Entrepreneurship</Link>
                </li>
                <li className="list-item">
                  <Link to="#!">Business Administration</Link>
                </li>
                <li className="list-item">
                  <Link to="#!">Information Technology</Link>
                </li>
                <li className="list-item">
                  <Link to="#!">Social Science</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl">Contact Info</h2>
              <div className="grid grid-rows gap-1">
                <div className="flex flex-row items">
                  <div>
                    <FaMapMarkerAlt className="text-4xl text-white bg-orange-400 rounded-full p-2" />
                  </div>
                  <div className="px-3 w-full font-regular">
                    <strong>Address</strong>
                    <br />
                    <p>
                      Dawnabwar Block, Nanshae Aungmyaetharzan Tsp, Mandalay,
                      Myanmar
                    </p>
                  </div>
                </div>
                <div className="flex flex-row items">
                  <div>
                    <FaPhoneAlt className="text-4xl text-white bg-orange-400 rounded-full p-2" />
                  </div>
                  <div className="flex flex-col px-3 w-full font-regular">
                    <strong>Phone</strong>
                    <Link to="tel:+95 0912345678">+95 0912345678</Link>
                  </div>
                </div>
                <div className="flex flex-row items">
                  <div>
                    <FaEnvelope className="text-4xl text-white bg-orange-400 rounded-full p-2" />
                  </div>
                  <div className="flex flex-col px-3 w-full font-regular">
                    <strong>Email</strong>
                    <Link to="mail:piumail.@gmail.com">
                      piumail@gmail.com
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-gray-400 flex flex-row justify-between items-center text-sm">
            <div>
              <p>
                Copyright &copy; {new Date().getFullYear()}
              </p>
            </div>
            <div>
              <Link to="#!">Powered by PIU-Webdeveloper Team</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}
