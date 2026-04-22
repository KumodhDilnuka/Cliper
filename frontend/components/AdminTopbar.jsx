import { useNavigate } from "react-router-dom";
import { FiLogOut, FiShield, FiBell, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

const AdminTopbar = () => {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50">
      <nav className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
            <div className="bg-slate-900 rounded-2xl p-2.5 shadow-xl shadow-slate-900/10 group-hover:scale-110 transition-transform">
              <FiShield className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-0.5">CLIPER <span className="text-blue-600">HQ</span></h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security & Analytics</p>
            </div>
          </div>

          <div className="hidden md:flex relative items-center group">
            <FiSearch className="absolute left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search records, users, logs..." 
              className="bg-slate-100/50 border border-transparent focus:border-blue-600/30 focus:bg-white focus:ring-4 focus:ring-blue-600/5 rounded-2xl py-2.5 pl-11 pr-4 w-80 text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
           <button className="relative p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all group">
            <FiBell className="text-xl" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
          </button>

          <div className="w-px h-6 bg-slate-200"></div>

          {/* Admin Info */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-black text-slate-900 leading-none mb-1">{adminUser.email || "Admin Account"}</p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Super Administrator</p>
            </div>
            
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-white shadow-inner flex items-center justify-center font-black text-slate-400 text-xs overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=admin`} alt="Avatar" />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all text-xs font-black shadow-xl shadow-slate-900/10 active:scale-95"
          >
            <FiLogOut />
            <span className="hidden sm:inline">TERMINATE</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default AdminTopbar;
