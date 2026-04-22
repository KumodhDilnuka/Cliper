import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const TopBar = ({
  mode = "simple",
  title = "Academic Atelier",
  subtitle,
  profileName,
  profileRole,
  profileImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAOUQpkVvngosje8ACeCA_xxKi6IT6gzN-fv_7DizckLmAla2FKRbOdxf-IK6H0VkSSfvTzkLNf7rot0Ebzq4UV0PnTVshNKKcVC1RWxWEg1T_6VddZUtfreOBUYbodjefJD9VH3dCNgxPHzGJEz0jY_7LGeNQnEQNi-0SvgYBxk4EfSg0aR273h9CSDk5wOEuanddRHrcWMffR5nTLhT8DEovfFFuRPxHH4ffuIDEQcoHVm2cUo2kavvingSogrn04sCLvsYpEDLM"
}) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isLecturer = mode === "lecturer";
  const isStudent  = mode === "student";
  const isAdmin    = mode === "admin";
  const isForum    = mode === "forum";

  // Read user info from localStorage
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const displayName = profileName || user?.name || user?.email || "User";
  const displayRole = profileRole || user?.type || mode;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const studentNavItems = [
    { label: "Lecture Q&A", path: "/live-sessionStudent" },
    { label: "Forum", path: "/qa" },
    { label: "Lecture Resources", path: "/student/resources" },
    { label: "Attendance", path: "/student/attendance" },
  ];

  const headerClass =
    isLecturer || isStudent || isAdmin || isForum
      ? "fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-white shadow-[0px_10px_30px_rgba(25,28,30,0.06)]"
      : "fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-16 z-40 bg-white border-b border-slate-200 shadow-sm";

  return (
    <header className={headerClass}>
      <div className="flex justify-between items-center px-8 h-full w-full">
        <div className="flex items-center min-w-0 flex-1 gap-8">
          {/* Left: title or search */}
          {isForum ? (
            <>
              <div className="flex items-center gap-3 min-w-0 shrink-0">
                <h2 className="text-base md:text-lg font-bold text-blue-800 truncate">
                  {title}
                </h2>
              </div>

              <div className="relative hidden md:block w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-slate-100/70 border-none rounded-full text-sm focus:ring-2 focus:ring-[#0040a1]/20 outline-none"
                  placeholder="Search discussions, resources, or peers..."
                  type="text"
                />
              </div>
            </>
          ) : title ? (
            <div className="flex items-center gap-3 min-w-0">
              <h2 className="text-base md:text-lg font-bold text-blue-800 truncate">
                {title}
              </h2>
              {subtitle && (
                <>
                  <span className="hidden xl:block h-4 w-px bg-slate-300" />
                  <span className="hidden xl:block text-sm text-gray-600 truncate">
                    {subtitle}
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="relative w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-slate-100/60 border-none rounded-full text-sm focus:ring-2 focus:ring-[#0040a1]/20 outline-none"
                placeholder="Search lectures, students, or documents..."
                type="text"
              />
            </div>
          )}

          {isStudent && (
            <nav className="hidden xl:flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/90 px-2 py-1.5 shadow-sm">
              {studentNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#0040a1] text-white shadow-sm"
                        : "text-slate-600 hover:bg-white hover:text-[#0040a1]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* Right: notifications + profile dropdown */}
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-[#0040a1] transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          {/* Profile dropdown wrapper */}
          <div className="relative" ref={dropdownRef}>

            {/* Avatar / trigger */}
            {isLecturer ? (
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold leading-none">{displayName}</p>
                  <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-1">
                    {displayRole}
                  </p>
                </div>
                <img
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0040a1]/20 cursor-pointer"
                  src={profileImage}
                />
              </button>
            ) : (
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="focus:outline-none"
                aria-label="Open profile menu"
              >
                <img
                  alt="User Avatar"
                  src={profileImage}
                  className="w-9 h-9 rounded-full object-cover cursor-pointer ring-2 ring-transparent hover:ring-[#0040a1]/30 transition-all"
                />
              </button>
            )}

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in">

                {/* User info header */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-sm font-bold text-[#191c1e] truncate">{displayName}</p>
                  <p className="text-xs text-slate-500 capitalize">{displayRole}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button
                    onClick={() => { setDropdownOpen(false); navigate(isLecturer ? "/lecturer" : "/StudentDashboard"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-500">dashboard</span>
                    Dashboard
                  </button>

                  <button
                    onClick={() => { setDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-500">manage_accounts</span>
                    My Profile
                  </button>

                  <button
                    onClick={() => { setDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-500">settings</span>
                    Settings
                  </button>
                </div>

                {/* Divider + Logout */}
                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
