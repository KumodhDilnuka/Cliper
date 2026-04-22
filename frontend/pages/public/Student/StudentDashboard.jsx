import React, { useState, useEffect } from "react";
import StudentDashboardSidebar from "../../../components/Sidebar_student";
import StudentLayout from "../../../Layout/StudentLayout";

const courses = [
  {
    title: "Macroeconomics",
    subtitle: "Unit 4: Global Markets",
    icon: "trending_up",
    progress: 75,
    iconBg: "bg-blue-100",
    iconColor: "text-[#0040a1]",
  },
  {
    title: "Computer Science",
    subtitle: "Object Oriented Design",
    icon: "code",
    progress: 40,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-700",
  },
  {
    title: "Statistics II",
    subtitle: "Unit 2: Probability",
    icon: "functions",
    progress: 92,
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
  },
];

const recentActivities = [
  {
    text: (
      <>
        <span className="font-bold text-[#191c1e]">Prof. Jenkins</span> uploaded
        new resources to{" "}
        <span className="font-bold">Advanced Quantum Mechanics</span>.
      </>
    ),
    time: "2 hours ago",
    border: "border-[#0040a1]",
  },
  {
    text: (
      <>
        You received a reply to your question in the{" "}
        <span className="font-bold">Macro Forum</span>.
      </>
    ),
    time: "5 hours ago",
    border: "border-[#0056d2]",
  },
  {
    text: (
      <>
        Your attendance was logged for{" "}
        <span className="font-bold">Statistics II</span>.
      </>
    ),
    time: "Yesterday",
    border: "border-[#dbe0e5]",
  },
  {
    text: (
      <>
        <span className="font-bold">System:</span> Your request for academic
        support has been received.
      </>
    ),
    time: "2 days ago",
    border: "border-[#a93802]",
  },
];

const StudentDashboard = () => {
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.name) {
          setUserName(user.name);
        }
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen antialiased font-sans">
      <StudentDashboardSidebar />
      <StudentLayout />

      <main className="ml-64 pt-16 px-8 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto py-6 space-y-8">
          {/* Welcome section */}
          <section>
            <div className="space-y-2">
              <h2 className="text-4xl font-extrabold tracking-tight">
                Welcome back, {userName}!
              </h2>
            </div>
          </section>

          {/* Main grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Left/main content */}
            <div className="xl:col-span-3 space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold">My Courses</h4>
                <button className="text-[#0040a1] font-bold text-sm hover:underline">
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.title}
                    className="bg-white p-6 rounded-xl shadow-[0px_10px_30px_rgba(25,28,30,0.06)] flex flex-col h-full group hover:bg-blue-50/30 transition-colors"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg ${course.iconBg} flex items-center justify-center mb-4 ${course.iconColor} group-hover:scale-110 transition-transform`}
                    >
                      <span className="material-symbols-outlined">
                        {course.icon}
                      </span>
                    </div>

                    <h5 className="font-bold text-lg mb-1">{course.title}</h5>
                    <p className="text-xs text-[#424654] mb-6">
                      {course.subtitle}
                    </p>

                    <div className="mt-auto space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="bg-[#0040a1] h-full rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Weekly timeline */}
              <div className="bg-white rounded-xl p-8 shadow-[0px_10px_30px_rgba(25,28,30,0.06)] space-y-6">
                <h4 className="text-xl font-bold">Weekly Timeline</h4>

                <div className="relative space-y-6 pl-8">
                  <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>

                  <div className="relative flex items-start gap-6">
                    <div className="absolute -left-[1.65rem] w-4 h-4 rounded-full border-4 border-white bg-[#0040a1] z-10"></div>
                    <div className="flex-1 pb-4 border-b border-slate-100">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-[#0040a1] uppercase">
                            Tomorrow, 10:00 AM
                          </span>
                          <h6 className="font-bold">
                            Final Exam: Macroeconomics
                          </h6>
                          <p className="text-sm text-slate-500">
                            Hall B, Main Building
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-[#ffdbcf] text-[#812800] text-[10px] font-bold rounded-full whitespace-nowrap">
                          HIGH PRIORITY
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-6">
                    <div className="absolute -left-[1.65rem] w-4 h-4 rounded-full border-4 border-white bg-slate-300 z-10"></div>
                    <div className="flex-1 pb-4 border-b border-slate-100">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Wednesday, 2:30 PM
                          </span>
                          <h6 className="font-bold">Peer Review Workshop</h6>
                          <p className="text-sm text-slate-500">
                            Virtual Room Lobby
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-[#eceef0] text-[#424654] text-[10px] font-bold rounded-full whitespace-nowrap">
                          LECTURE
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-6">
                    <div className="absolute -left-[1.65rem] w-4 h-4 rounded-full border-4 border-white bg-slate-300 z-10"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Friday, 11:59 PM
                          </span>
                          <h6 className="font-bold">CS Project Submission</h6>
                          <p className="text-sm text-slate-500">
                            Online Portal
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-[#eceef0] text-[#424654] text-[10px] font-bold rounded-full whitespace-nowrap">
                          ASSIGNMENT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar widgets */}
            <div className="xl:col-span-1 space-y-6">
              <h4 className="text-xl font-bold">Recent Activity</h4>

              <div className="bg-[#f2f4f6] rounded-xl p-4 space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className={`p-3 bg-white rounded-lg shadow-sm border-l-4 ${activity.border}`}
                  >
                    <p className="text-xs font-medium text-[#424654] leading-relaxed">
                      {activity.text}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-2">
                      {activity.time}
                    </span>
                  </div>
                ))}

                <button className="w-full py-2 text-xs font-bold text-[#0040a1] hover:bg-white rounded-lg transition-colors">
                  Load More
                </button>
              </div>

              <div className="bg-[#2d3133] text-[#eff1f3] rounded-xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h5 className="font-bold text-lg mb-2">
                    Need a quiet space?
                  </h5>
                  <p className="text-xs opacity-80 mb-4">
                    Book a private study room in the Central Library.
                  </p>
                  <button className="text-xs font-bold underline hover:no-underline">
                    Book Now
                  </button>
                </div>

                <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-7xl opacity-10">
                  menu_book
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;