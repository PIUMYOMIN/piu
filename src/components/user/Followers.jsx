import React from "react";
import { FaFacebook, FaYoutube, FaTelegram, FaUsers } from "react-icons/fa";
import CountUp from "react-countup";

export default function Followers() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="w-full bg-dark-purple text-white">
        <div className="max-w-7xl mx-auto py-10">
          <div className="grid lg:grid-cols-4 grid-cols-2 lg:gap-10 gap-6 font-roboto font-medium">
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="text-3xl">
                <FaFacebook />
              </div>
              <div className="flex flex-col justify-center items-center">
                <small>Facebook</small>
                <CountUp end={1202} duration={10} className="text-3xl" />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="text-3xl">
                <FaYoutube />
              </div>
              <div className="flex flex-col justify-center items-center">
                <small>Youtute</small>
                <CountUp end={3251} duration={10} className="text-3xl" />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="text-3xl">
                <FaTelegram />
              </div>
              <div className="flex flex-col justify-center items-center">
                <small>Telegram</small>
                <CountUp end={8512} duration={9} className="text-3xl" />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="text-3xl">
                <FaUsers />
              </div>
              <div className="flex flex-col justify-center items-center">
                <small>Students</small>
                <CountUp end={1200} duration={10} className="text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
