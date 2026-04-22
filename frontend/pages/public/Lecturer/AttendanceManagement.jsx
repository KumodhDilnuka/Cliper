import React, { useState, useEffect } from "react";
import { 
  FiPlus, FiClock, FiUsers, FiDownload, FiCheckCircle, 
  FiAlertCircle, FiSearch, FiExternalLink, FiX 
} from "react-icons/fi";
import Sidebar_lec from "../../../components/Sidebar_lec";
import LecturerLayout from "../../../Layout/LecturerLayout";
import { 
  createAttendance, 
  getLecturerSessions, 
  getSessionDetails, 
  downloadAttendanceExcel,
  endAttendanceSession
} from "../../../services/api";
import toast from "react-hot-toast";

const AttendanceManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newSession, setNewSession] = useState({
    title: "",
    subject: "",
    durationMinutes: 60
  });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data } = await getLecturerSessions();
      setSessions(data);
    } catch (error) {
      toast.error("Failed to load attendance history");
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!newSession.title || !newSession.subject) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await createAttendance(newSession);
      setActiveSession(data.session);
      setQrImage(data.qrImage);
      setShowQrModal(true);
      loadSessions();
      toast.success("Attendance session activated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  const handleViewLog = async (session) => {
    try {
      setLoading(true);
      const { data } = await getSessionDetails(session._id);
      setAttendanceRecords(data);
      setActiveSession(session);
      setShowLogModal(true);
    } catch (error) {
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async (sessionId, subject) => {
    try {
      const response = await downloadAttendanceExcel(sessionId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attendance_${subject}_${new Date().toLocaleDateString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report downloaded");
    } catch (error) {
      toast.error("Download failed");
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await endAttendanceSession(sessionId);
      toast.success("Session deactivated");
      loadSessions();
      if (activeSession?._id === sessionId) setActiveSession({...activeSession, isActive: false});
    } catch (error) {
      toast.error("Failed to stop session");
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Sidebar_lec />
      <LecturerLayout />

      <main className="ml-64 pt-24 px-8 pb-12">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Cliper Attendance</p>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Management Workbench</h1>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: Create & Sessions */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* Quick Activation Card */}
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-32 translate-x-32 group-hover:scale-110 transition-transform duration-700" />
                 
                 <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl">
                        <FiCheckCircle size={24} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">Activate Attendance</h3>
                   </div>

                   <form onSubmit={handleCreateSession} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Title</label>
                        <input 
                          value={newSession.title}
                          onChange={e => setNewSession({...newSession, title: e.target.value})}
                          placeholder="e.g. Week 4 Lecture"
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100/20 transition-all outline-none font-bold text-sm text-slate-900" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                        <input 
                          value={newSession.subject}
                          onChange={e => setNewSession({...newSession, subject: e.target.value})}
                          placeholder="e.g. Macroeconomics"
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100/20 transition-all outline-none font-bold text-sm text-slate-900" 
                        />
                      </div>
                      <button 
                        disabled={loading}
                        className="h-[58px] bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                      >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiPlus size={18}/> Initialize QR</>}
                      </button>
                   </form>
                 </div>
              </div>

              {/* Attendance Log Table */}
              <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-900">Historical Records</h3>
                    <div className="relative">
                      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        placeholder="Filter sessions..." 
                        className="pl-10 pr-4 py-2 rounded-xl text-xs font-bold border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900"
                      />
                    </div>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <tr>
                             <th className="px-8 py-5">Academic Event</th>
                             <th className="px-5 py-5 text-center">Status</th>
                             <th className="px-5 py-5">Expiry</th>
                             <th className="px-8 py-5 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {sessions.map(s => (
                            <tr key={s._id} className="group hover:bg-slate-50/30 transition-colors">
                               <td className="px-8 py-6">
                                  <div className="flex flex-col">
                                     <span className="font-black text-slate-800">{s.title}</span>
                                     <span className="text-xs text-slate-400 font-bold">{s.subject}</span>
                                  </div>
                               </td>
                               <td className="px-5 py-6">
                                  <div className="flex justify-center">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${s.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                      {s.isActive ? 'Active' : 'Archived'}
                                    </span>
                                  </div>
                               </td>
                               <td className="px-5 py-6">
                                  <span className="text-[11px] font-bold text-slate-500">
                                    {new Date(s.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <div className="flex justify-end gap-2">
                                     <button onClick={() => handleViewLog(s)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"><FiExternalLink size={16}/></button>
                                     <button onClick={() => handleDownloadExcel(s._id, s.subject)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"><FiDownload size={16}/></button>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            </div>

            {/* Right Column: Active Session Info */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
               <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  
                  <h3 className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] mb-8">System Summary</h3>
                  
                  <div className="grid grid-cols-2 gap-8 mb-12">
                     <div className="space-y-1">
                        <span className="text-3xl font-black tracking-tighter">{sessions.filter(s => s.isActive).length}</span>
                        <p className="text-[10px] uppercase font-bold text-white/40">Active Probes</p>
                     </div>
                     <div className="space-y-1">
                        <span className="text-3xl font-black tracking-tighter">{sessions.length}</span>
                        <p className="text-[10px] uppercase font-bold text-white/40">Total Records</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="h-px bg-white/10" />
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><FiClock size={18} className="text-blue-400" /></div>
                           <span className="text-sm font-bold">Latency</span>
                        </div>
                        <span className="text-sm font-black text-blue-400">Normal</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm border-dashed text-center space-y-6">
                  <div className="w-20 h-20 bg-blue-50 text-blue-100 rounded-[2.5rem] flex items-center justify-center mx-auto"><FiUsers size={32} /></div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-1">Engagement Matrix</h4>
                    <p className="text-xs text-slate-400 font-medium">Real-time attendance tracking is currently online. Ensure stable network connection.</p>
                  </div>
                  <button onClick={loadSessions} className="text-xs font-black uppercase text-blue-600 tracking-widest hover:underline">Refresh Records</button>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/80 animate-fadeIn">
           <div className="bg-white w-full max-w-sm rounded-[4rem] shadow-4xl p-10 text-center relative animate-fadeInScale">
              <button 
                onClick={() => setShowQrModal(false)}
                className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 p-2"
              ><FiX size={24} /></button>
              
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                 <FiCheckCircle size={32} />
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Probe Active</h3>
              <p className="text-slate-400 text-sm font-medium mb-10">Scan this QR to mark attendance</p>
              
              <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 mb-10 shadow-inner">
                 <img src={qrImage} alt="Attendance QR" className="w-full rounded-2xl border border-white shadow-sm" />
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between mb-8">
                 <span className="text-[10px] font-black uppercase text-white/40 tracking-widest ml-2">Manual Link</span>
                 <span className="text-lg font-black tracking-widest mr-2">{activeSession?.sessionCode}</span>
              </div>

              <button 
                onClick={() => handleEndSession(activeSession._id)}
                className="w-full py-4 text-red-500 font-black text-sm hover:bg-red-50 rounded-2xl transition-all"
              >Stop Collection</button>
           </div>
        </div>
      )}

      {/* LOG MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/80 animate-fadeIn">
           <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-4xl flex flex-col max-h-[85vh] animate-fadeInScale border-8 border-white p-2">
              <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center rounded-t-[3.8rem]">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{activeSession?.subject}</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Attendance Log</h3>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => handleDownloadExcel(activeSession._id, activeSession.subject)} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 shadow-sm"><FiDownload /> Export</button>
                    <button onClick={() => setShowLogModal(false)} className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm"><FiX size={20} /></button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10">
                 {attendanceRecords.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {attendanceRecords.map(rec => (
                          <div key={rec._id} className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                   {rec.student?.firstName?.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                   <span className="font-black text-slate-900">{rec.student?.firstName} {rec.student?.lastName}</span>
                                   <span className="text-[10px] font-bold text-slate-400 uppercase">{rec.student?.email}</span>
                                </div>
                             </div>
                             <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                               {new Date(rec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="py-20 text-center space-y-4">
                       <FiUsers className="mx-auto text-slate-200" size={48} />
                       <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Waiting for check-ins...</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
