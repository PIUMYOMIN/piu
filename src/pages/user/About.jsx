import React from "react";
import { Link } from "react-router-dom";
import Principal from "../../assets/president.jpg";
import { FaFacebook, FaYoutube, FaTelegram, FaUsers } from "react-icons/fa";
import CountUp from "react-countup";

export default function About() {
  return <div className="max-w-7xl mx-auto font-robotoSlab">
      <div>
        <div className="flex justify-center items-center h-40 bg-green-300">
          <div className="text-3xl font-oswald font-medium border-b border-black">
            About Us
          </div>
        </div>
        <div className="lg:flex flex-row justify-between gap-5 my-5">
          <div className="lg:w-8/12 lg:px-0 px-2">
            <div>
              <div>
                <div className="text-2xl">
                  Phaung Daw Oo International University
                </div>
                <p>Introduction</p>
              </div>
              <div className="flex gap-1">
                <div className="w-10 border-b-2 border-slate-400" />
                <div className="w-14 border-b-2 border-slate-500" />
              </div>
            </div>
            <div className="mb-10">
              <p className="lg:text-justify">
                25th years ago Phaung Daw Oo monastic education school was
                established by the two brothers, Ven Nayaka and Ven Jotika.
                During eight years times the school has been developed from
                primary to high school level: In 1993 Primary, In 1998
                Secondary, In 2000 High School. In 2011 the principal and his
                colleagues attended an annual conference of International
                Network of Engage Buddhist (INEB). The conference gave him a
                chance to study about Santiniketan University founded by
                Rabindra Nath Tagore which has the education programs start
                from Kindergarten to PhD level. It inspired him to establish a
                University. When he came back he steps forward to upgrade his
                school to university. In 2013 the principal and his colleagues
                were invited from Australian Education Institutions, primary
                schools and universities. There, he took chance to affiliate
                with Australian Catholic University (ACU). 15 students from
                Phaung Daw Oo High School were sent to study in ACU for
                education in Diploma. In 2014 A well-wishers donated 450 acres
                land near Mandalay to establish a university. Meanwhile the
                Phaung Daw Oo School tries to link with some Western
                Universities like American University (AU), Menandar
                University, Hamsted University, Victoria University, and
                University of Melbourne. Students were sent to theses
                universities to study MA program, BA program and Intensive
                courses. In 2017_2018 the Eastern Universities also came and
                joined the school to work education matter together: Foguang
                Shan University from Taiwan and International Buddhist College
                (IBC) from Thailand. On January 25, 2019, the PIU signed a
                higher academic cooperation agreement with IBC in Mandalay.
              </p>
            </div>
            <div>
              <div>
                <div className="text-2xl">HISTORY OF UNIVERSITY</div>
                <p>History</p>
              </div>
              <div className="flex gap-1">
                <div className="w-8 border-b-2 border-slate-400" />
                <div className="w-10 border-b-2 border-slate-500" />
              </div>
            </div>
            <div className="my-3">
              <p className="lg:text-justify">
                As the education in Myanmar is lasting behind so do every
                aspect of Myanmar. Therefore, it is desperately needed to lift
                the status of education in Myanmar. We can see that the
                countries which have internationally high ranking universities
                become well developed ones in the world. To establish quality
                assurance university qualify teachers and eligible students
                are needed. As Myanmar has been deteriorating for many years
                qualify teachers are very difficult to have. So, no eligible
                students become. I have been facing this broken process of
                education system for over a decade. Good quality university
                students have to become from good quality basic education
                level students i.e primary, secondary, and tertiary. Taking
                the help from international education aid organization I have
                provided numbers of teacher trainings, from which quality
                teachers were produced. I hope those quality teachers will
                reproduce eligible students. In fact, this education reform
                process is just for basic education level. Now it is time for
                university level. I believe Phaung Daw Oo International
                University will become the international standard one.
              </p>
            </div>
          </div>
          <div className="lg:w-4/12 font-robotoSlab text-center text-slate-500">
            <Link to="/team/vennayaka">
              <img src={Principal} alt="" className="object-cover" />
              <p className="text-xl">Ven.Nayaka</p>
              <p>President of PIU</p>
            </Link>
          </div>
        </div>
        <div className="w-full">
          <div className="max-w-7xl mx-auto py-10">
            <div className="grid lg:grid-cols-4 grid-cols-2 lg:gap-10 gap-6 lg:px-0 px-2 font-roboto font-medium">
              <div className="flex flex-col justify-center items-center gap-3 font-robotoSlab">
                <div className="text-4xl">
                  <FaFacebook />
                </div>
                <div className="text-center">
                  <CountUp end={1202} duration={10} className="text-3xl" />
                  <div>FOLLOWERS</div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center gap-3 font-robotoSlab">
                <div className="text-4xl">
                  <FaYoutube />
                </div>
                <div className="text-center">
                  <CountUp end={3251} duration={10} className="text-3xl" />
                  <div>SUBSCRIBERS</div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center gap-3 font-robotoSlab">
                <div className="text-4xl">
                  <FaTelegram />
                </div>
                <div className="text-center">
                  <CountUp end={8512} duration={9} className="text-3xl" />
                  <div>TELEGRAM</div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center gap-3 font-robotoSlab">
                <div className="text-4xl">
                  <FaUsers />
                </div>
                <div className="text-center">
                  <CountUp end={1200} duration={10} className="text-3xl" />
                  <div>ENROLLED STUDENTS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:flex flex-row">
          <div className="lg:w-2/3 bg-green-300 px-5 lg:py-10 py-5">
            <div className="text-2xl font-robotoSlab">Our Principle</div>
            <div className="flex gap-1">
              <div className="w-8 border-b-2 border-slate-500" />
              <div className="w-12 border-b-2 border-slate-700" />
            </div>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam
              impedit inventore iusto eos architecto excepturi, nulla
              repellat! Possimus neque sint voluptatum voluptatibus ea ullam.
              Laborum nulla odit explicabo temporibus nobis facilis nam qui
              illum totam, ex molestias itaque sit maiores tenetur
              reprehenderit labore. Et obcaecati distinctio reprehenderit
              totam dignissimos recusandae consequatur.
            </p>
          </div>
          <div className="lg:w-4/12 bg-green-200 px-5 lg:py-10 py-5">
            <div className="text-2xl font-robotoSlab">Our Mission</div>
            <div className="flex gap-1">
              <div className="w-8 border-b-2 border-slate-500" />
              <div className="w-12 border-b-2 border-slate-700" />
            </div>
            <p>
              To be a globally recognized center of excellence in education,
              research, and innovation, empowering individuals to contribute
              to the sustainable socio-economic development of Myanmar and the
              world.
            </p>
          </div>
          <div className="lg:w-4/12 bg-green-100 px-5 lg:py-10 py-5">
            <div className="text-2xl font-robotoSlab">Our Vision</div>
            <div className="flex gap-1">
              <div className="w-8 border-b-2 border-slate-500" />
              <div className="w-12 border-b-2 border-slate-700" />
            </div>
            {/* <p> */}
            <ul className="list-decimal list-outside">
              <li>Provide quality education</li>
              <li>Cultivate global perspectives</li>
              <li>Foster research and innovation</li>
              <li>Collaboration and partnerships</li>
              <li>Promote community engagement</li>
              <li>Embrace technology advancements</li>
              <li>Uphold ethical and professional standards</li>
            </ul>
            {/* </p> */}
          </div>
        </div>
      </div>
    </div>;
}
