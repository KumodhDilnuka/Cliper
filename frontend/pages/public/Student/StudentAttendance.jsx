import React from "react";
import SidebarStudent from "../../../components/Sidebar_student";
import TopBar from "../../../components/TopBar";

const attendanceItems = [
  { module: "Advanced Macroeconomics", rate: "92%", status: "On Track" },
  { module: "Economic History", rate: "88%", status: "Good Standing" },
  { module: "Research Methods", rate: "95%", status: "Excellent" },
];

const StudentAttendance = () => {
  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] flex min-h-screen">
      <SidebarStudent />

      <main className="flex-1 md:ml-64 overflow-y-auto">
        <TopBar mode="student" title="Academic Atelier" />

        <div className="p-6 lg:p-8 mt-16">
          <div className="max-w-6xl mx-auto space-y-8">
            <section className="rounded-3xl bg-gradient-to-br from-[#0040a1] to-[#0056d2] p-8 text-white shadow-[0px_18px_40px_rgba(0,64,161,0.25)]">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                <span className="material-symbols-outlined text-sm">
                  qr_code_scanner
                </span>
                Attendance
              </span>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight">
                Keep track of your lecture participation
              </h1>
              <p className="mt-3 max-w-2xl text-white/80 leading-relaxed">
                Review your attendance performance and stay aligned with course
                participation requirements.
              </p>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
              {attendanceItems.map((item) => (
                <article
                  key={item.module}
                  className="rounded-3xl bg-white border border-slate-200/50 p-6 shadow-[0px_10px_30px_rgba(25,28,30,0.06)]"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                    Module
                  </p>
                  <h2 className="mt-3 text-xl font-bold">{item.module}</h2>
                  <p className="mt-6 text-4xl font-extrabold text-[#0040a1]">
                    {item.rate}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {item.status}
                  </p>
                </article>
              ))}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentAttendance;
