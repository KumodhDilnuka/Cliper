import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiShield, FiArrowRight } from "react-icons/fi";
import { adminLogin } from "../../services/api";
import toast from "react-hot-toast";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await adminLogin({ email, password });
      localStorage.setItem("adminToken", data.token);
      toast.success("Welcome back, Administrator", { icon: "🔐" });
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="w-full max-w-md relative z-10 animate-fadeInUp">
        <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 mb-6 group hover:rotate-12 transition-transform duration-500">
              <FiShield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Admin Portal</h1>
            <p className="text-slate-500 font-medium">Access system management & moderation</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all font-medium"
                  placeholder="admin@cliper.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Secret Key</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-900/5 active:scale-[0.98] disabled:opacity-50 group mt-4"
            >
              {loading ? "Authenticating..." : "Authorize Access"}
              {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center mt-10 text-slate-400 text-sm font-medium">
            Protected management zone. All actions are logged.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
