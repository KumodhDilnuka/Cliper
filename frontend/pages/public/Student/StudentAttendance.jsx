import React, { useState } from "react";
import { 
  FiCamera, FiEdit3, FiCheckCircle, FiShield, 
  FiClock, FiChevronRight, FiMapPin 
} from "react-icons/fi";
import Sidebar_student from "../../../components/Sidebar_student";
import { markAttendance } from "../../../services/api";
import { Scanner } from "@yudiel/react-qr-scanner";
import toast from "react-hot-toast";

const StudentAttendance = () => {
  const [sessionCode, setSessionCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("scan"); // "scan" | "manual"
  const [recentCheckedIn, setRecentCheckedIn] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleMarkAttendance = async (code) => {
    if (!code) return;
    
    // Ensure code is uppercase for matching
    const upperCode = code.toUpperCase().trim();
    
    try {
      setLoading(true);
      const { data } = await markAttendance({ sessionCode: upperCode });
      toast.success("Attendance marked successfully!", { icon: "✅" });
      setRecentCheckedIn(prev => [
        { code: upperCode, time: new Date().toLocaleTimeString(), id: Date.now() },
        ...prev.slice(0, 4)
      ]);
      setSessionCode("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    handleMarkAttendance(sessionCode);
  };

  const handleScan = (result) => {
    if (result && result.length > 0) {
      try {
        const data = JSON.parse(result[0].rawValue);
        if (data.sessionCode) {
          handleMarkAttendance(data.sessionCode);
        }
      } catch (e) {
        // If not JSON, maybe it's just the code string
        handleMarkAttendance(result[0].rawValue);
      }
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <Sidebar_student />

      <main className="ml-64 pt-24 px-8 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
           {/* Header Section */}
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                 <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em] mb-1">Student Portal</p>
                 <h1 className="text-4xl font-black text-slate-900 tracking-tight">Lecture Verification</h1>
                 <p className="text-slate-400 font-medium text-sm mt-2">Mark your presence for today's academic sessions.</p>
              </div>
              
              <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">
                    {user.firstName?.charAt(0)}
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-black text-slate-900 leading-none">{user.firstName} {user.lastName}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Student Hub</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-12 gap-8">
              {/* Interaction Center */}
              <div className="col-span-12 lg:col-span-7 space-y-8">
                 <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden p-2">
                    <div className="flex p-2 bg-slate-50 rounded-[3rem] mb-2">
                       <button 
                         onClick={() => setActiveTab("scan")}
                         className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[2.5rem] text-sm font-black transition-all ${activeTab === 'scan' ? 'bg-white text-blue-600 shadow-xl translate-y-[-2px]' : 'text-slate-400'}`}
                       >
                          <FiCamera /> Scan QR
                       </button>
                       <button 
                         onClick={() => setActiveTab("manual")}
                         className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[2.5rem] text-sm font-black transition-all ${activeTab === 'manual' ? 'bg-white text-blue-600 shadow-xl translate-y-[-2px]' : 'text-slate-400'}`}
                       >
                          <FiEdit3 /> Manual Code
                       </button>
                    </div>

                    <div className="p-8 pb-12">
                       {activeTab === 'scan' ? (
                          <div className="space-y-8 animate-fadeIn">
                             <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 aspect-square max-w-sm mx-auto shadow-2xl border-8 border-white/10 group">
                                <Scanner 
                                  onScan={handleScan}
                                  styles={{ container: { width: '100%', height: '100%' } }}
                                  allowMultiple={false}
                                />
                                <div className="absolute inset-0 border-[2px] border-blue-500/30 pointer-events-none group-hover:border-blue-500 transition-all duration-500" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/20 rounded-[2rem] animate-pulse pointer-events-none" />
                             </div>
                             <p className="text-center text-xs font-black text-slate-400 uppercase tracking-widest">Position the lecturer's QR code within the frame</p>
                          </div>
                       ) : (
                          <div className="space-y-8 py-10 animate-fadeIn">
                             <div className="max-w-sm mx-auto text-center space-y-6">
                                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                                   <FiShield size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Enter Session Code</h3>
                                <form onSubmit={handleManualSubmit} className="space-y-4">
                                   <input 
                                     value={sessionCode}
                                     onChange={e => setSessionCode(e.target.value)}
                                     placeholder="8-CHARACTER CODE"
                                     className="w-full bg-slate-50 border border-slate-100 px-8 py-5 rounded-3xl text-center font-black tracking-[0.4em] text-xl outline-none focus:ring-4 focus:ring-blue-100 transition-all uppercase text-slate-900 placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-300"
                                   />
                                   <button 
                                     disabled={loading || !sessionCode}
                                     className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                   >
                                      {loading ? "Verifying..." : "Authorize Check-in"}
                                   </button>
                                </form>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>

              {/* Status Section */}
              <div className="col-span-12 lg:col-span-5 space-y-8">
                 <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-20"><FiMapPin size={64} /></div>
                    <h3 className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-10">Verification Status</h3>
                    
                    <div className="space-y-6">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400 shadow-inner"><FiCheckCircle size={28} /></div>
                          <div>
                             <p className="text-lg font-black tracking-tighter leading-none">Identity Secured</p>
                             <p className="text-[10px] uppercase font-bold text-white/40 mt-1">Authenticated Session</p>
                          </div>
                       </div>
                       
                       <div className="h-px bg-white/10" />

                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Recent Activity</p>
                          {recentCheckedIn.length > 0 ? (
                             <div className="space-y-3">
                                {recentCheckedIn.map(item => (
                                   <div key={item.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                                      <div className="flex items-center gap-3">
                                         <div className="w-2 h-2 rounded-full bg-green-400" />
                                         <span className="text-xs font-black tracking-widest">{item.code}</span>
                                      </div>
                                      <span className="text-[10px] font-bold text-white/40">{item.time}</span>
                                   </div>
                                ))}
                             </div>
                          ) : (
                             <div className="py-6 text-center border-2 border-dashed border-white/10 rounded-3xl">
                                <p className="text-[10px] font-black uppercase text-white/20 tracking-tighter">No recent records</p>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6"><FiClock size={24} /></div>
                    <h4 className="text-lg font-black text-slate-900 mb-1">Session Availability</h4>
                    <p className="text-xs text-slate-400 font-medium">QR codes remain active for 10-60 mins depending on lecturer settings. Ensure you scan before expiry.</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default StudentAttendance;
