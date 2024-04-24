import React from "react";
import President from "../../assets/president.jpg";

export default function president() {
  return (
    <div className="bg-slate-200 md:p-5 py-1 mt-6">
      <div className="my-3 md:flex flex-row">
        <div className="md:w-full">
          <img src={President} alt="" className="object-cover" />
        </div>
        <div className="w-3/2 md:ml-20">
          <h2 className="text-3xl py-2">About</h2>
          <p>
            Ven. U Nayaka is a Buddhist monk. He was deeplyconcerned that his
            country would never be able to sustain democracybecause a large
            section of the population lacked access to basiceducation. So, in
            1993, he set up a monastic school to educate poorchildren, monks,
            and nuns regardless of race, gender, ethnicity, andreligion, thus
            breaking the tradition that monastic schools normallyserve only
            monks and male students.
          </p>
        </div>
      </div>
      <div className="my-3">
        <h2 className="text-2xl py-2">EDUCATION PHILOSOPHY AND PRACTICES</h2>
        <p>
          U Nayaka aims to reform religious education to producewell-qualified
          teachers and educated students who can become leaders.At the same
          time, he is a leading advocate for change from traditionalrote
          memorization teaching to a child-centered approach, not just
          inmonastic schools but across the entire education system. His goal
          isto provide well-trained teachers who will bring his
          approach,especially to poor rural areas and the many conflict zones of
          Myanmar. With support from international donors, he has built Phaung
          Daw OoSchool in Mandalay which has an enrolment of over 8,000
          studentsyearly as well as a network of cooperating monastic schools
          across thecountry which are serving several thousand more students.
          The schoolsare staffed with young teachers trained in modern
          child-centeredmethods that encourage active learning and critical
          thinking, and aspecial focus is put on health and hygiene. In addition
          to standardacademic and Buddhist studies, students are given the
          opportunity tolearn English and develop professional skills in
          carpentry, tailoring,IT, culinary arts, and journalism.
        </p>
      </div>
      <div className="my-3">
        <h2 className="text-2xl py-2">HONORARY TITLES AWARDED</h2>
        <p>
          U Nayaka’s work has been acknowledged by severalawards, including the
          Order of the Republic of the Union of MyanmarPresident’s State
          Excellence Award in 2013. In 2003 he was invited bythe US Department
          of State to consult on Education in Burma. In 2008he also was invited
          to consult at the United Nations in New York. Hewas also awarded the
          highest honorary name of Agga mahasaddhammajotika Dhaja by the
          government of Myanmar and also presentedCitizen of Burma.
        </p>
      </div>
      <div className="my-3">
        <h2 className="text-2xl py-2">
          FORMING AN INTERNATIONAL STANDARD UNIVERSITY
        </h2>
        <p>
          In 2013 the Founder President and his colleagues were invited from
          Australian Education Institutions, primary schools, and universities.
          There, he took the chance to affiliate with Australian Catholic
          University (ACU). 15 students from Phaung Daw Oo High School were sent
          to study in ACU for an education in Diploma. In 2014 well-wishers
          donated 450 acres of land near Mandalay to establish a university
          which is now called Phuang Daw Oo International University (PIU).
          Meanwhile, the Phaung Daw Oo School tries to link with some Western
          Universities like American University (AU), Menandar University,
          Hamsted University, Victoria University, and the University of
          Melbourne. Students were sent to these universities to study MA
          programs, BA programs, and Intensive courses. In 2017-2018 the Eastern
          Universities also came and joined the school to work on education
          matters together: Fo Guang Shan University from Taiwan and
          International Buddhist College (IBC) from Thailand. On January 25,
          2019, the PIU signed a higher academic cooperation agreement with IBC
          in Mandalay.
        </p>
      </div>
    </div>
  );
}
