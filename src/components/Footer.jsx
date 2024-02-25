import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaYoutube, FaTelegram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer>
      <div className="w-full my-10 bg-primary-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 lg:gap-5 gap-8">
            <div className="pr-3">
              <h2 className="text-2xl">About Us</h2>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alias
                repellat saepe ab nemo magnam eum ullam provident, repudiandae
                nulla eos.
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
              <div>
                <div>
                  <strong>Address</strong>
                  <br />
                  <p>
                    123 Nineth Street, Mandalay, Block 10160,
                    <br /> Myanmar
                  </p>
                </div>
                <br />
                <div>
                  <strong>Phone</strong>
                  <p>+95 123456789</p>
                </div>
                <br />
                <div>
                  <strong>Email</strong>
                  <p>abc@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t-2 flex flex-row justify-between items-center">
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
    </footer>
  );
}
