import React from "react";
import Navbar from "../../components/cjNavbar";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] selection:bg-[#dae2ff]">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#dae2ff] text-[#0040a1] text-sm font-bold mb-6">
                Learn Without Fear. Ask Without Limits.
              </span>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-[#191c1e] mb-6 leading-tight">
                Cliper
              </h1>

              <p className="text-lg text-[#424654] leading-relaxed max-w-xl mb-10">
                A safe, inclusive, and judgment-free digital environment where
                every student can participate, ask questions anonymously, and
                access academic resources — all in one place.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <button className="bg-gradient-to-br from-[#0040a1] to-[#0056d2] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-900/20">
                  Get Started
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>

                <button className="bg-[#e0e3e5] text-[#191c1e] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e6e8ea] transition-all">
                  Explore Features
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <div className="text-[#0040a1] font-bold text-2xl">100%</div>
                  <div className="text-[#424654] text-xs font-medium uppercase tracking-widest">
                    Anonymous Protection
                  </div>
                </div>
                <div>
                  <div className="text-[#0040a1] font-bold text-2xl">4 Core</div>
                  <div className="text-[#424654] text-xs font-medium uppercase tracking-widest">
                    Academic Modules
                  </div>
                </div>
                <div>
                  <div className="text-[#0040a1] font-bold text-2xl">24/7</div>
                  <div className="text-[#424654] text-xs font-medium uppercase tracking-widest">
                    Resource Access
                  </div>
                </div>
                <div>
                  <div className="text-[#0040a1] font-bold text-2xl">0</div>
                  <div className="text-[#424654] text-xs font-medium uppercase tracking-widest">
                    Judgment Zone
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#dae2ff]/30 blur-[100px] rounded-full"></div>

              <div className="relative grid gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c3c6d6]/10 flex items-start gap-4 transform hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-full bg-[#dae2ff] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0040a1]">
                      visibility_off
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#191c1e]">
                      Anonymous Q&amp;A
                    </h3>
                    <p className="text-[#424654] text-sm">
                      Ask freely, learn boldly without identity fear.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c3c6d6]/10 flex items-start gap-4 ml-8 transform hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-full bg-[#dae2ff] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0040a1]">
                      qr_code_2
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#191c1e]">
                      QR Attendance
                    </h3>
                    <p className="text-[#424654] text-sm">
                      Marked in 3 seconds. Seamless and fast.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c3c6d6]/10 flex items-start gap-4 transform hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-full bg-[#dae2ff] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0040a1]">
                      verified_user
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#191c1e]">
                      Secure &amp; Private
                    </h3>
                    <p className="text-[#424654] text-sm">
                      Your identity is protected at every step.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-24 bg-[#f2f4f6] px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <span className="text-[#822800] font-bold tracking-tighter text-sm uppercase flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-lg">
                  warning
                </span>
                The Problem
              </span>

              <h2 className="text-4xl font-extrabold text-[#191c1e] mb-4">
                The Silent Struggle in Every Classroom
              </h2>

              <p className="text-[#424654] max-w-2xl text-lg">
                Millions of students hold back questions every day. We built
                UASS to change that and foster an environment of radical
                curiosity.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-white hover:bg-white transition-colors">
                <span className="material-symbols-outlined text-[#822800] text-4xl mb-6">
                  psychology_alt
                </span>
                <h3 className="text-xl font-bold text-[#191c1e] mb-4">
                  Fear of Judgment
                </h3>
                <p className="text-[#424654] leading-relaxed">
                  Students hesitate to ask questions in class due to social
                  anxiety or fear of embarrassment in front of peers and
                  lecturers.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white hover:bg-white transition-colors">
                <span className="material-symbols-outlined text-[#822800] text-4xl mb-6">
                  trending_down
                </span>
                <h3 className="text-xl font-bold text-[#191c1e] mb-4">
                  Poor Academic Outcomes
                </h3>
                <p className="text-[#424654] leading-relaxed">
                  Unresolved doubts lead to reduced confidence, lower grades,
                  and a gradual disengagement from the learning journey.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white hover:bg-white transition-colors">
                <span className="material-symbols-outlined text-[#822800] text-4xl mb-6">
                  layers_clear
                </span>
                <h3 className="text-xl font-bold text-[#191c1e] mb-4">
                  No Structured Support
                </h3>
                <p className="text-[#424654] leading-relaxed">
                  Existing systems lack anonymous, organized tools designed
                  specifically for shy or introverted students to thrive and
                  participate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Modules Section */}
        <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#0040a1] font-bold tracking-tighter text-sm uppercase mb-4 block">
              ✨ Core Modules
            </span>
            <h2 className="text-4xl font-extrabold text-[#191c1e] mb-4">
              Everything You Need to Thrive Academically
            </h2>
            <p className="text-[#424654] max-w-2xl mx-auto">
              Four powerful modules designed to solve real problems faced by
              students and lecturers.
            </p>
          </div>

          <div className="grid md:grid-cols-12 grid-rows-2 gap-6 h-auto md:h-[600px]">
            <div className="md:col-span-8 bg-[#dae2ff] p-8 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <span className="material-symbols-outlined text-[#0040a1] text-4xl mb-4">
                    chat_bubble
                  </span>
                  <h3 className="text-2xl font-bold text-[#001847] mb-2">
                    Anonymous Lecture Q&amp;A (Live)
                  </h3>
                  <p className="text-[#0040a1] max-w-md">
                    Ask questions during live lectures without revealing your
                    identity. No judgment, just pure learning from the source.
                  </p>
                </div>

                <button className="w-fit text-[#0040a1] font-bold flex items-center gap-1 hover:gap-2 transition-all">
                  Launch Live Session
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </button>
              </div>

              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#0040a1]/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
            </div>

            <Link
              to="/qa"
              className="md:col-span-4 bg-[#e6e8ea] p-8 rounded-3xl flex flex-col justify-between hover:bg-[#e0e3e5] transition-colors hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#0040a1]/30"
            >
              <div>
                <span className="material-symbols-outlined text-[#191c1e] text-4xl mb-4">
                  forum
                </span>
                <h3 className="text-xl font-bold text-[#191c1e] mb-2">
                  Public Q&amp;A Forum
                </h3>
                <p className="text-[#424654] text-sm">
                  Post questions to the whole community — anonymously or with
                  identity. Get verified answers fast.
                </p>
              </div>
            </Link>

            <div className="md:col-span-4 bg-[#dbe0e5] p-8 rounded-3xl flex flex-col justify-between hover:bg-[#e0e3e5] transition-colors">
              <div>
                <span className="material-symbols-outlined text-[#191c1e] text-4xl mb-4">
                  library_books
                </span>
                <h3 className="text-xl font-bold text-[#191c1e] mb-2">
                  Document Library
                </h3>
                <p className="text-[#424654] text-sm">
                  Organized by subject and week. Access lecture notes and study
                  guides 24/7 at your own pace.
                </p>
              </div>
            </div>

            <div className="md:col-span-8 bg-[#2d3133] p-8 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="text-white">
                  <span className="material-symbols-outlined text-[#dae2ff] text-4xl mb-4">
                    qr_code_scanner
                  </span>
                  <h3 className="text-2xl font-bold mb-2">
                    Smart QR Attendance
                  </h3>
                  <p className="text-[#eff1f3] max-w-md">
                    Scan a QR code to mark attendance in seconds. No
                    disruptions. Real-time digital records for lecturers.
                  </p>
                </div>
              </div>

              <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 bg-gradient-to-l from-[#dae2ff] to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-24 px-8 bg-white border-y border-[#c3c6d6]/10 overflow-hidden relative">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="material-symbols-outlined text-[#0040a1]/20 text-8xl absolute -top-12 -left-12 opacity-50">
              format_quote
            </span>
            <p className="text-3xl md:text-4xl font-bold text-[#191c1e] leading-tight mb-8">
              "Every student deserves a safe space to learn, grow, and ask
              questions without fear. UASS is that space — built for you."
            </p>
            <p className="text-[#0040a1] font-bold tracking-widest uppercase text-sm">
              — UASS Design Principle
            </p>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-8">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#0040a1] to-[#0056d2] rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="relative z-10">
              <span className="text-[#ccd8ff] font-bold text-sm tracking-widest uppercase mb-6 block">
                🚀 Ready to Join?
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Start Your Journey Today
              </h2>
              <p className="text-[#ccd8ff] text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Sign in with your SLIIT university ID and join a smarter, more
                inclusive learning community built for academic excellence.
              </p>

              <button className="bg-white text-[#0040a1] px-10 py-5 rounded-2xl font-extrabold text-xl hover:bg-[#dae2ff] transition-all shadow-xl hover:scale-105 active:scale-95 inline-flex items-center gap-2">
                Sign In with Student ID
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200/20 py-12 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div>
            <span className="font-bold text-lg text-blue-900 mb-4 block">
              SLIIT Academic Atelier
            </span>
            <p className="text-slate-500 text-xs max-w-sm leading-relaxed mb-6">
              Empowering students through anonymous collaboration and seamless
              resource management within the SLIIT ecosystem.
            </p>
            <p className="text-slate-500 text-xs">
              © 2024 SLIIT Academic Atelier. All rights reserved.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <a
                className="text-slate-500 hover:underline decoration-blue-500/30 text-xs leading-relaxed"
                href="#"
              >
                Anonymous Q&amp;A
              </a>
              <a
                className="text-slate-500 hover:underline decoration-blue-500/30 text-xs leading-relaxed"
                href="#"
              >
                Public Forum
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <a
                className="text-slate-500 hover:underline decoration-blue-500/30 text-xs leading-relaxed"
                href="#"
              >
                Document Library
              </a>
              <a
                className="text-slate-500 hover:underline decoration-blue-500/30 text-xs leading-relaxed"
                href="#"
              >
                QR Attendance
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
