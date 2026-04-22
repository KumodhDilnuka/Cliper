import React from "react";
import Sidebar_lec from "../../../components/Sidebar_lec";
import LecturerLayout from "../../../Layout/LecturerLayout";

const LecturerDashboard = () => {
  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen antialiased">
      <Sidebar_lec />
      <LecturerLayout />

      <main className="ml-64 pt-24 px-8 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top grid */}
          <div className="grid grid-cols-12 gap-6">
            <section className="col-span-12 lg:col-span-8 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0040a1] to-[#0056d2] p-8 text-white shadow-xl">
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-9xl">
                  sensors
                </span>
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide uppercase mb-6">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                    Live Session
                  </div>

                  <h2 className="text-4xl font-extrabold mb-2 tracking-tight">
                    Advanced Macroeconomics
                  </h2>

                  <p className="text-white/80 flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-sm">
                      location_on
                    </span>
                    Auditorium 402 • 10:15 AM - 12:00 PM
                  </p>
                </div>

                <div className="mt-12 flex items-center gap-4">
                  <button className="px-6 py-3 bg-white text-[#0040a1] rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined">
                      settings_remote
                    </span>
                    Manage Session
                  </button>

                  <button className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl font-bold transition-all border border-white/20">
                    View Class List
                  </button>
                </div>
              </div>
            </section>

            <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/40 shadow-[0px_10px_30px_rgba(25,28,30,0.06)] flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">
                    Active Students
                  </p>
                  <h3 className="text-3xl font-extrabold">142</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#dae2ff] flex items-center justify-center text-[#0040a1]">
                  <span className="material-symbols-outlined">groups</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/40 shadow-[0px_10px_30px_rgba(25,28,30,0.06)] flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">
                    Pending Questions
                  </p>
                  <h3 className="text-3xl font-extrabold text-[#822800]">08</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#ffdbcf] flex items-center justify-center text-[#822800]">
                  <span className="material-symbols-outlined">
                    question_answer
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/40 shadow-[0px_10px_30px_rgba(25,28,30,0.06)] flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">
                    Avg. Participation
                  </p>
                  <h3 className="text-3xl font-extrabold">88%</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#dee3e8] flex items-center justify-center text-[#5e6368]">
                  <span className="material-symbols-outlined">insights</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lower grid */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-4">
              <h4 className="font-bold text-lg px-2">Quick Actions</h4>

              <div className="flex flex-col gap-3">
                {[
                  ["play_circle", "Start New Session", "Go live immediately"],
                  ["upload_file", "Upload Resources", "PDFs, Datasets, Slides"],
                  ["bar_chart", "View Analytics", "Term performance trends"],
                ].map(([icon, title, subtitle]) => (
                  <button
                    key={title}
                    className="group p-4 bg-[#f2f4f6] hover:bg-[#0040a1] transition-all rounded-2xl flex items-center gap-4 text-left border border-transparent hover:border-[#0040a1]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0040a1] group-hover:bg-white/20 flex items-center justify-center text-white">
                      <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <div>
                      <p className="font-bold group-hover:text-white transition-colors">
                        {title}
                      </p>
                      <p className="text-xs text-slate-500 group-hover:text-white/70 transition-colors">
                        {subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-12 md:col-span-8 lg:col-span-5 bg-white rounded-3xl border border-slate-200/40 shadow-[0px_10px_30px_rgba(25,28,30,0.06)] p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-lg">Today's Schedule</h4>
                <button className="text-[#0040a1] text-sm font-bold hover:underline">
                  Full Calendar
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl hover:bg-[#f2f4f6] transition-colors">
                  <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-slate-200 pr-4">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      Done
                    </span>
                    <span
                      className="material-symbols-outlined text-green-600"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold">Economic History Seminar</h5>
                    <p className="text-sm text-slate-500">
                      08:30 AM - 10:00 AM • Room 102
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-[#0040a1]/5 ring-1 ring-[#0040a1]/20 relative overflow-hidden">
                  <div className="absolute left-0 top-0 w-1 h-full bg-[#0040a1]"></div>
                  <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-slate-200 pr-4">
                    <span className="text-xs font-bold text-[#0040a1] uppercase">
                      Now
                    </span>
                    <span className="text-lg font-black text-[#0040a1]">
                      Live
                    </span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold">Advanced Macroeconomics</h5>
                    <p className="text-sm text-slate-500">
                      10:15 AM - 12:00 PM • Auditorium 402
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl hover:bg-[#f2f4f6] transition-colors">
                  <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-slate-200 pr-4">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      Next
                    </span>
                    <span className="text-lg font-bold">14:00</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold">Faculty Research Meeting</h5>
                    <p className="text-sm text-slate-500">
                      02:00 PM - 03:30 PM • Dean's Office
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-200/40 shadow-[0px_10px_30px_rgba(25,28,30,0.06)] p-6">
              <h4 className="font-bold text-lg mb-6">Recent Activity</h4>

              <div className="space-y-6 relative before:content-[''] before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[1px] before:bg-slate-300/40">
                <div className="relative flex gap-4 pl-10">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-white bg-[#dae2ff] flex items-center justify-center z-10">
                    <span className="material-symbols-outlined text-sm text-[#0040a1]">
                      forum
                    </span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <strong>Sarah Jenkins</strong> asked a question in{" "}
                      <em>Advanced Macro</em>
                    </p>
                    <p className="text-xs text-slate-500 mt-1 italic">
                      "How does the Solow model account for endogenous technical progress?"
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">
                      2 minutes ago
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4 pl-10">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-white bg-[#ffdbcf] flex items-center justify-center z-10">
                    <span className="material-symbols-outlined text-sm text-[#822800]">
                      assignment_turned_in
                    </span>
                  </div>
                  <div>
                    <p className="text-sm">
                      Assignment <strong>'Market Dynamics'</strong> published to
                      all Year 3 students
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">
                      45 minutes ago
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4 pl-10">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-white bg-[#dee3e8] flex items-center justify-center z-10">
                    <span className="material-symbols-outlined text-sm text-[#5e6368]">
                      person_add
                    </span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <strong>Marcus Vane</strong> checked into{" "}
                      <em>Auditorium 402</em>
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">
                      1 hour ago
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-8 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-500 hover:bg-[#f2f4f6] transition-all">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LecturerDashboard;