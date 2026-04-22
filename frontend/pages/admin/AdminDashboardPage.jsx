import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AdminTopbar from "../../components/AdminTopbar";
import AdminSidebar from "../../components/AdminSidebar";
import AdminStats from "../../components/AdminStats";
import AdminQuestionsList from "../../components/AdminQuestionsList";
import AdminAnswersList from "../../components/AdminAnswersList";
import AdminMaterialsManagement from "../../components/AdminMaterialsManagement";
import toast from "react-hot-toast";
import { getAdminStats, getAdminQuestions } from "../../services/api";

function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("adminToken"));
  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, questionsRes] = await Promise.all([
        getAdminStats(),
        getAdminQuestions(),
      ]);
      setStats(statsRes.data);
      setQuestions(questionsRes.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#0f172a] font-sans selection:bg-blue-100 italic-none">
      <AdminTopbar />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 lg:ml-64 px-6 pt-24 pb-16 min-h-screen">
          <div className="max-w-[1400px] mx-auto animate-fadeIn">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                  <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
                  System Administration
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} <span className="text-blue-600">Hub</span>
                </h1>
                <p className="text-slate-500 font-medium">
                  {activeTab === "overview" && "Platform metrics and activity at a glance"}
                  {activeTab === "questions" && "Approve, reject or moderate platform questions"}
                  {activeTab === "answers" && "Drill down and manage detailed contributions"}
                  {activeTab === "materials" && "Manage courses, modules and lecture materials"}
                  {activeTab === "settings" && "Configure global platform parameters"}
                </p>
              </div>
              
              <button 
                onClick={fetchDashboardData}
                className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
                Sync Data
              </button>
            </div>

            {/* Content Rendering */}
            <div className="relative">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                  <div className="spinner mb-4"></div>
                  <p className="text-slate-500 font-bold animate-pulse uppercase tracking-wider text-xs">Fetching records...</p>
                </div>
              ) : (
                <div className="animate-fadeInUp">
                  {activeTab === "overview" && stats && (
                    <div className="space-y-10">
                      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8 px-2">
                          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                              <span className="material-symbols-outlined">history</span>
                            </span>
                            Live Content Feed
                          </h2>
                          <button onClick={() => setActiveTab("questions")} className="text-blue-600 font-bold text-sm hover:underline">View All Records</button>
                        </div>
                        <AdminQuestionsList questions={questions.slice(0, 8)} />
                      </div>
                    </div>
                  )}

                  {activeTab === "questions" && (
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                      <AdminQuestionsList questions={questions} />
                    </div>
                  )}

                  {activeTab === "answers" && (
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                      <div className="mb-8 px-2">
                        <h2 className="text-2xl font-black text-slate-800">Review Answers</h2>
                        <p className="text-slate-500 text-sm font-medium">Moderate specific contributions across all active questions.</p>
                      </div>
                      <AdminAnswersList questions={questions} />
                    </div>
                  )}

                  {activeTab === "materials" && (
                    <div className="animate-fadeIn">
                       <AdminMaterialsManagement />
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div className="max-w-2xl">
                       <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-10 border border-white shadow-xl shadow-slate-200/50">
                        <h2 className="text-2xl font-black text-slate-800 mb-8">System Configuration</h2>
                        <div className="space-y-6">
                          <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl group hover:bg-blue-100/50 transition-all">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-lg text-blue-900 group-hover:text-blue-700 transition-colors">
                                AI Content Moderation
                              </h3>
                              <div className="w-12 h-6 bg-blue-600 rounded-full relative shadow-inner">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                              </div>
                            </div>
                            <p className="text-blue-700/70 text-sm font-medium leading-relaxed">
                              Enforce strict academic guidelines using Gemini 1.5 Ultra for all incoming undergraduate queries.
                            </p>
                          </div>
                          <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:bg-slate-100/50 transition-all opacity-50 cursor-not-allowed">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-lg text-slate-900">
                                SMS Notifications (Beta)
                              </h3>
                              <div className="w-12 h-6 bg-slate-300 rounded-full relative">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                              </div>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">
                              Alert lecturers via SMS when urgent unanswered questions exceed 24-hour threshold.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
