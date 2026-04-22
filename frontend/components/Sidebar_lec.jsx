import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar_lec = ({ onCreateRoom }) => {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      icon: "dashboard",
      path: "/lecturer",
    },
    {
      name: "Rooms",
      icon: "meeting_room",
      path: "/lecturer/lec_active-rooms",
    },
    {
      name: "Resources",
      icon: "library_books",
      path: "/lecturer/resources",
    },
    {
      name: "Attendance",
      icon: "qr_code_2",
      path: "/lecturer/attendance",
    },
    {
      name: "Course Modules",
      icon: "menu_book",
      path: "/lecturer/course-management",
    },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-[#f2f4f6] border-r border-gray-200 hidden md:flex flex-col p-4 z-40">
      {/* Profile Section */}
      <div className="flex items-center gap-3 px-3 py-6 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#dbe0e5] flex items-center justify-center overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgGiiPyWONkA0OU3ic2yek8YLtGKvk0AHFLfXkCUNFVH64lPVV4zoDu95_hjFUNSea4TXr9vVrsPFGVk8498I2JxnJI9tfHvBzEea6LDXmUUhXU0DhaE3CA1iiaQVEg09T8kLNRxEJFV_4SLj0d948faOHFj1ZP6ShyKA-lDfYy7y3Rr-94bEDDetkNGeYOY2-2cDKjoOqkFexz2riSGiWRI9Cj1A2ehyltepi8NSq5gdED8CWCq2yjVooD17MYNlNf43zu4WzfBE"
            alt="Dr. Aris"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-bold text-gray-900">Dr. Aris</p>
          <p className="text-[11px] text-gray-600 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            Hall 402 • Active
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-white text-[#0056D2] font-bold shadow-sm"
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

      {/* Create Room Button */}
      <div className="mt-8 px-1">
        <button
          onClick={onCreateRoom}
          className="w-full py-3 px-4 bg-gradient-to-br from-[#0040a1] to-[#0056d2] text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Create New Room
        </button>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto pt-6 border-t border-gray-200 space-y-1">
        <Link
          to="/lecturer/help"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-[#0056D2] hover:bg-white/70 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">
            help_outline
          </span>
          <span className="text-sm font-medium">Help</span>
        </Link>

        <Link
          to="/logout"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-white/70 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">
            logout
          </span>
          <span className="text-sm font-medium">Sign Out</span>
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar_lec;