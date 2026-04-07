import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from "../../components/user/Carousel";
import Courses from "../../components/user/Courses";
import News from "../../components/user/News";
import Gallery from "../../components/user/Gallery";
import Followers from "../../components/user/Followers";
import Aos from "aos";
import "aos/dist/aos.css";

export default function Home() {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  return <div>
      {/* carosel section start  */}
      <Carousel />
    {/* carousel section end  */}

      {/* quick actions + value props */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* quick actions */}
            <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-gradient-to-br from-[#002147] to-[#0b3a77] text-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">Start your journey at PIU</h3>
              <p className="mt-2 text-sm text-white/80">
                Apply online, explore programs, or talk to our team.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <Link
                  to="/admissions/application-form"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-3 font-semibold"
                >
                  Apply now
                </Link>
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 px-4 py-3 font-semibold"
                >
                  View programs
                </Link>
                <Link
                  to="/news"
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 px-4 py-3 font-semibold"
                >
                  News & events
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 px-4 py-3 font-semibold"
                >
                  Contact us
                </Link>
              </div>

              <div className="mt-5 text-xs text-white/70">
                Tip: If you already applied, check your email for updates.
              </div>
            </div>

            {/* why PIU */}
            <div className="lg:col-span-2">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Why choose PIU</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    A student-first experience designed for real outcomes.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Quality learning",
                    desc: "Well-structured curriculum with practical focus.",
                    icon: "fa-solid fa-graduation-cap",
                  },
                  {
                    title: "Experienced faculty",
                    desc: "Guidance from skilled and supportive instructors.",
                    icon: "fa-solid fa-chalkboard-user",
                  },
                  {
                    title: "Modern environment",
                    desc: "Comfortable spaces for study and student life.",
                    icon: "fa-solid fa-building-columns",
                  },
                  {
                    title: "Career support",
                    desc: "Build skills that matter for your next step.",
                    icon: "fa-solid fa-briefcase",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                    data-aos="fade-up"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                        <i className={item.icon}></i>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.title}</div>
                        <div className="mt-1 text-sm text-gray-600">{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* stats strip */}
              <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Programs", value: "20+" },
                    { label: "Students", value: "1,000+" },
                    { label: "Graduates", value: "5,000+" },
                    { label: "Years", value: "25+" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                      <div className="mt-1 text-xs text-gray-600">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* admissions highlight (supports both admissions + news) */}
      <section className="w-full bg-secondary-background">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div data-aos="fade-right">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Admissions made simple</h3>
              <p className="mt-2 text-gray-700">
                Apply online in minutes. After submitting, you’ll receive a confirmation email and our team will review your application.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { step: "01", title: "Choose a program", desc: "Browse programs and pick your course." },
                  { step: "02", title: "Submit application", desc: "Fill the form and upload documents." },
                  { step: "03", title: "Get updates", desc: "We’ll contact you with next steps." },
                ].map((x) => (
                  <div key={x.step} className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                    <div className="text-xs font-bold text-blue-700">STEP {x.step}</div>
                    <div className="mt-2 font-semibold text-gray-900">{x.title}</div>
                    <div className="mt-1 text-sm text-gray-600">{x.desc}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/admissions/application-form"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 font-semibold"
                >
                  Apply for admission
                </Link>
                <Link
                  to="/news"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white hover:bg-gray-50 px-5 py-3 font-semibold text-gray-800"
                >
                  View announcements
                </Link>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm" data-aos="fade-left">
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Latest updates</div>
                    <div className="text-xs text-gray-600">News, events, and announcements</div>
                  </div>
                  <Link to="/news" className="text-sm font-semibold text-blue-700 hover:underline">
                    See all
                  </Link>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    { title: "Admissions open", hint: "Apply online and upload required documents." },
                    { title: "Upcoming events", hint: "Stay updated with workshops and campus activities." },
                    { title: "Program announcements", hint: "New intakes and program updates will appear here." },
                  ].map((n) => (
                    <div key={n.title} className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                      <div className="font-semibold text-gray-900">{n.title}</div>
                      <div className="mt-1 text-sm text-gray-600">{n.hint}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 bg-gray-50 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-gray-700">
                    Want to see real posts? Visit the News & Events page.
                  </div>
                  <Link
                    to="/news"
                    className="inline-flex items-center justify-center rounded-xl bg-[#002147] hover:bg-[#001a3a] text-white px-4 py-2 font-semibold"
                  >
                    Go to News
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* courses section start */}
      <Courses />
      {/* course section end */}

      {/* follower section start  */}

      <Followers />

      {/* follower section end  */}

      {/* news section start  */}
      <News />
      {/* news section end  */}

      {/* gallery section start  */}
      <Gallery variant="home" />
      {/* gallery section end  */}

      {/* gallery section start  */}
      {/* <President /> */}
      {/* gallery section end  */}
    </div>;
}
