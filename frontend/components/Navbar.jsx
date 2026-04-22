const ForumTopbar = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md shadow-[0px_10px_30px_rgba(25,28,30,0.06)]">
      <nav className="flex justify-between items-center px-6 py-3 max-w-full mx-auto">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-blue-800">
            Academic Atelier
          </span>

          <div className="hidden md:flex items-center bg-[#f2f4f6] rounded-full px-4 py-1.5 w-96 group transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-[#0040a1]/20">
            <span className="material-symbols-outlined text-slate-400 text-sm">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 outline-none ml-2"
              placeholder="Search discussions, resources, or peers..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200 text-slate-500">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200 text-slate-500">
            <span className="material-symbols-outlined">bookmarks</span>
          </button>

          <a
            href="/admin/login"
            className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200 text-slate-500 hidden md:block"
            title="Admin Panel"
          >
            <span className="material-symbols-outlined">admin_panel_settings</span>
          </a>

          <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-300 ml-2 cursor-pointer">
            <img
              alt="User profile avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNbptPmmWc9xrlqm_SKCK5hNaUjMFluIKVaqAxAl8DkDrzfHrQMbv0ea65gzcwUfB_2w-77hHlCCZByc0nE7sUzB5d7-3Rgut6x1l6O408KEMIpDHPBwpZYng3Z6Wy7Rehme99O2yX9SEeX2q8-otSMlYXKZOTSwpqNGhWXlALvqHDNFXfjgIiC_3npBAPjr4ATM0d3gWO3w4v48E8ZdMjFo8tMzIMR30BUkHxF9-M22SBk7-P640ihXE-OFvA2IVQsyLEyUvbCXs"
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default ForumTopbar;