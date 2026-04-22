import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getQuestions } from "../services/api";

const ForumSidebar = () => {
    const location = useLocation();
    const [popularCount, setPopularCount] = useState(null);

    const navItems = [
        { name: "Home Feed", icon: "home", path: "/qa" },
        { name: "Popular", icon: "trending_up", path: "/qa?sort=popular" },
        { name: "Recent Discussions", icon: "forum", path: "/qa" },
        { name: "My Communities", icon: "group", path: "/qa" },
        { name: "Academic Resources", icon: "library_books", path: "/student/resources" },
    ];

    const bottomItems = [
        { name: "Settings", icon: "settings", path: "/StudentDashboard" },
        { name: "Help Center", icon: "help_outline", path: "/StudentDashboard" },
    ];

    useEffect(() => {
        // fetch top-rated questions count (popular)
        let mounted = true;
        (async () => {
            try {
                const { data } = await getQuestions('', 'popular');
                if (!mounted) return;
                setPopularCount(Array.isArray(data) ? data.length : 0);
            } catch (e) {
                // ignore failures, show nothing
            }
        })();
        return () => { mounted = false };
    }, []);

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 pt-16 flex flex-col gap-2 p-4 border-r border-slate-100 bg-slate-50 hidden lg:flex">
            <div className="px-4 py-4">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    Communities
                </h3>
                <p className="text-[10px] text-slate-500/60 font-medium">
                    Explore Topics
                </p>
            </div>

            <nav className="space-y-1">
                {navItems.map((item) => {
                    // Determine active by pathname or by presence of sort query for popular
                    const url = new URL(item.path, window.location.origin);
                    const isActive =
                        item.name === "Popular"
                            ? location.pathname === "/qa" &&
                              new URLSearchParams(location.search).get("sort") === "popular"
                            : location.pathname === url.pathname &&
                              (item.path !== "/qa" || !new URLSearchParams(location.search).get("sort"));

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 hover:translate-x-1 ${
                                isActive
                                    ? "bg-blue-50 text-blue-700 font-bold"
                                    : "text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            <span className="material-symbols-outlined">
                                {item.icon}
                            </span>
                            <span className="text-sm font-medium flex-1">{item.name}</span>
                            {/* Show badge only for Popular */}
                            {item.name === "Popular" && (
                                <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                                    {typeof popularCount === "number" ? popularCount : "..."}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-slate-200/40 pt-4 space-y-1">
                {bottomItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:translate-x-1"
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                ))}
            </div>
        </aside>
    );
};

export default ForumSidebar;
