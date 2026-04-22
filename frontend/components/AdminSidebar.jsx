import React from "react";
import { FiLayout, FiHelpCircle, FiSettings, FiUsers, FiShield, FiMessageSquare, FiFileText } from "react-icons/fi";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { name: "Executive Summary", icon: <FiLayout />, id: "overview" },
    { name: "Manage Questions", icon: <FiFileText />, id: "questions" },
    { name: "Manage Answers", icon: <FiMessageSquare />, id: "answers" },
    { name: "Lecture Materials", icon: <FiFileText />, id: "materials" },
  ];

  const bottomItems = [
    { name: "System Settings", icon: <FiSettings />, id: "settings" },
    { name: "Support Center", icon: <FiHelpCircle />, id: "help" },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 pt-24 flex flex-col gap-2 p-6 border-r border-slate-200 bg-white hidden lg:flex z-40">
      {/* Navigation Section */}
      <div className="mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
          Control Center
        </h3>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === item.id
              ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10 font-bold"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold"
              }`}
          >
            <span className={`text-lg transition-transform duration-500 ${activeTab === item.id ? "rotate-0" : "group-hover:rotate-12"}`}>
              {item.icon}
            </span>
            <span className="text-[13px] tracking-tight">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="mt-auto pt-6 border-t border-slate-100 space-y-2">
        <div className="mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            Global Config
          </h3>
        </div>
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === item.id
              ? "bg-blue-600 text-white shadow-xl shadow-blue-600/10 font-bold"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold"
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[13px] tracking-tight">{item.name}</span>
          </button>
        ))}

        {/* Brand/Version info */}
        <div className="mt-6 p-4 bg-slate-50 rounded-3xl border border-slate-100 translate-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-black text-slate-900 uppercase">Cliper v2.4</span>
          </div>
          <p className="text-[9px] text-slate-400 font-bold leading-tight">Admin Console Active</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
