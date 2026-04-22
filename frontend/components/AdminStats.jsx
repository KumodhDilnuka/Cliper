import React from "react";

const AdminStats = ({ stats }) => {
  const statCards = [
    {
      label: "Total Questions",
      value: stats?.totalQuestions || 0,
      icon: "quiz",
      color: "blue",
      description: "Community inquiries",
    },
    {
      label: "Total Answers",
      value: stats?.totalAnswers || 0,
      icon: "chat_bubble",
      color: "indigo",
      description: "Knowledge sharing",
    },
    {
      label: "Active Users",
      value: stats?.activeUsers || 0,
      icon: "group",
      color: "violet",
      description: "Platform growth",
    },
    {
      label: "Flagged Content",
      value: stats?.flaggedContent || 0,
      icon: "security",
      color: "rose",
      description: "Pending moderation",
    },
  ];

  const themeClasses = {
    blue: "bg-blue-600/5 text-blue-600 border-blue-100 shadow-blue-900/5",
    indigo: "bg-indigo-600/5 text-indigo-600 border-indigo-100 shadow-indigo-900/5",
    violet: "bg-violet-600/5 text-violet-600 border-violet-100 shadow-violet-900/5",
    rose: "bg-rose-600/5 text-rose-600 border-rose-100 shadow-rose-900/5",
  };

  const iconBgClasses = {
    blue: "bg-blue-600 text-white shadow-lg shadow-blue-600/30",
    indigo: "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30",
    violet: "bg-violet-600 text-white shadow-lg shadow-violet-600/30",
    rose: "bg-rose-600 text-white shadow-lg shadow-rose-600/30",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, idx) => (
        <div
          key={idx}
          className={`relative overflow-hidden group bg-white rounded-[2.5rem] border border-slate-100 p-8 transition-all hover:shadow-xl hover:-translate-y-1 ${themeClasses[card.color]}`}
        >
          {/* Subtle Background Glow */}
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-20 -translate-y-12 translate-x-12 ${iconBgClasses[card.color].split(' ')[0]}`}></div>
          
          <div className="relative z-10 flex flex-col h-full">

            
            <div className="mt-auto">

              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-4xl font-black text-slate-900 tracking-tight">{card.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
