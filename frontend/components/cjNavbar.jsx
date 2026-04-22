import React from "react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const studentNavItems = [
  { label: "Lecture Q&A", path: "/live-sessionStudent" },
  { label: "Forum", path: "/qa" },
  { label: "Lecture Resources", path: "/student/resources" },
  { label: "Attendance", path: "/student/attendance" },
];

const cjNavbar = ({
  mode = "public",
  withSidebar = false,
  title = "Academic Atelier",
  searchPlaceholder = "Search sessions, topics, or lecturers...",
  profileImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAOUQpkVvngosje8ACeCA_xxKi6IT6gzN-fv_7DizckLmAla2FKRbOdxf-IK6H0VkSSfvTzkLNf7rot0Ebzq4UV0PnTVshNKKcVC1RWxWEg1T_6VddZUtfreOBUYbodjefJD9VH3dCNgxPHzGJEz0jY_7LGeNQnEQNi-0SvgYBxk4EfSg0aR273h9CSDk5wOEuanddRHrcWMffR5nTLhT8DEovfFFuRPxHH4ffuIDEQcoHVm2cUo2kavvingSogrn04sCLvsYpEDLM",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isStudentMode = mode === "student";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login");
  };

  const headerClass = withSidebar
    ? "fixed top-0 right-0 z-50 h-16 w-full md:w-[calc(100%-16rem)] bg-white/85 backdrop-blur-md shadow-[0px_10px_30px_rgba(25,28,30,0.06)]"
    : "fixed top-0 left-0 z-50 h-16 w-full bg-white/85 backdrop-blur-md shadow-[0px_10px_30px_rgba(25,28,30,0.06)]";

  return (
    <nav className={headerClass}>
      <div className="flex h-full items-center justify-between px-6 md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <button
            type="button"
            className="flex items-center"
            onClick={() => navigate(isStudentMode ? "/StudentDashboard" : "/")}
          >
            <span className="text-xl font-bold tracking-tighter text-blue-900">
              {title}
            </span>
          </button>

          {isStudentMode ? (
            <div className="relative hidden md:block w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                className="w-full rounded-full bg-slate-100/70 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#0040a1]/20"
                placeholder={searchPlaceholder}
                type="text"
              />
            </div>
          ) : null}
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-3 text-sm font-semibold tracking-tight">
          {isStudentMode ? (
            studentNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`rounded-full px-4 py-2 transition-colors ${
                  location.pathname === item.path
                    ? "bg-[#dae2ff] text-[#0040a1]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-800"
                }`}
              >
                {item.label}
              </NavLink>
            ))
          ) : (
            <>
              <span className="text-slate-600 transition-colors hover:text-blue-800">
                Lecture Q&A
              </span>
              <span className="text-slate-600 transition-colors hover:text-blue-800">
                Forum
              </span>
              <span className="text-slate-600 transition-colors hover:text-blue-800">
                Lecture Resources
              </span>
              <span className="text-slate-600 transition-colors hover:text-blue-800">
                Attendance
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {isStudentMode ? (
            <>
              <button className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#0040a1]">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#0040a1]">
                <span className="material-symbols-outlined">bookmark</span>
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="rounded-full transition-opacity hover:opacity-90"
                  aria-label="Open user menu"
                >
                  <img
                    alt="Student profile"
                    src={profileImage}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#0040a1]/10"
                  />
                </button>

                {menuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-44 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/StudentDashboard");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <span className="material-symbols-outlined text-[18px] text-slate-500">
                        dashboard
                      </span>
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        logout
                      </span>
                      Log Out
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <button
                className="border-2 border-[#0056D2] text-[#0056D2] px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#dae2ff] transition-all scale-95 active:scale-90"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="bg-[#0040a1] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#0056d2] transition-all scale-95 active:scale-90"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default cjNavbar;
