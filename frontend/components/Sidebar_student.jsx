import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar_student = () => {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      icon: "forum",
      path: "/StudentDashboard",
    },
    {
      name: "Lecture Q&A",
      icon: "forum",
      path: "/live-sessionStudent",
    },
    {
      name: "Forum",
      icon: "chat",
      path: "/qa",
    },
    {
      name: "Resources",
      icon: "library_books",
      path: "/student/resources",
    },
    {
      name: "Attendance",
      icon: "qr_code_scanner",
      path: "/student/attendance",
    },
    {
      name: "Materials",
      icon: "menu_book",
      path: "/student/materials",
    },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-[#f8f9fb] border-r border-gray-200 hidden md:flex flex-col p-4 z-40">
      {/* Profile Section */}
      <div className="px-4 py-4 mb-4 bg-white rounded-xl mt-16 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            alt="Student"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHmwY-28s47qhAEhH4TCyxKUGPjPlKlXuYqH1fG1wC1pC9SEFsj6guthdvg4DfgCmrEDShxXSZO9kX9f-GiGRbtAJpU0HwogHziAbXsk45feCu6yxvHmhDvvy_1CN0mZaO8V_D3sNdrUox7JJkl33xs39Pc91doRPjHAQE262ByBn7z522Ijdxwu7clApFf89GFlhwNf6NL7fkmcQ89IxWJJeoYK-NZj9X4D2tgXnWBnEALnFHPEhQTUWieoTpaNzRqe9RjOUSDzc"
            className="w-10 h-10 rounded-full object-cover bg-[#dbe0e5]"
          />
          <div>
            <p className="text-sm font-bold text-gray-900">Student View</p>
            <p className="text-[11px] text-gray-600">Hall 402 • Active</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-white text-[#0056D2] font-bold shadow-sm translate-x-1"
                  : "text-gray-700 hover:text-[#0056D2] hover:bg-white/70"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="pt-4 border-t border-gray-200 space-y-1">
        <Link
          to="/student/help"
          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-[#0056D2] transition-all"
        >
          <span className="material-symbols-outlined text-sm">
            help_outline
          </span>
          <span className="text-sm font-medium">Help</span>
        </Link>

        <Link
          to="/logout"
          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-red-600 transition-all"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span className="text-sm font-medium">Sign Out</span>
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar_student;