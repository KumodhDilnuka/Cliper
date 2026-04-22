import React, { useState, useEffect } from "react";
import {
  BookOpen,
  ChevronRight,
  Calendar,
  Code,
  Database,
  Network,
  Layers,
  Award,
  Users,
  Clock,
  CheckCircle,
  Eye,
  Download,
  ArrowLeft,
  GraduationCap,
  Target,
  FileText,
  Video,
  FileCode,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Search,
  LayoutGrid,
  Bookmark,
  ExternalLink
} from "lucide-react";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StudentMaterialsHub = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [view, setView] = useState("discovery"); // discovery, catalogue, module
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchCourses(); }, []);
  useEffect(() => {
    if (selectedCourse && selectedYear && selectedSemester) fetchModules();
  }, [selectedCourse, selectedYear, selectedSemester]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/modules/location/${selectedCourse._id}/${selectedYear}/${selectedSemester}`
      );
      if (!response.ok) throw new Error('Failed to fetch modules');
      const data = await response.json();
      setModules(data);
    } catch (err) { setModules([]); }
    finally { setLoading(false); }
  };

  const loadModuleDetails = async (m) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/modules/${m._id}`);
      const data = await res.json();
      setSelectedModule(data);
      setView("module");
    } catch (err) { alert("Failed to load module details"); }
    finally { setLoading(false); }
  };

  const handleProgramSelect = (course) => {
    setSelectedCourse(course);
    setSelectedYear(course.years[0]?.year || "Year 1");
    setSelectedSemester("Semester 1");
    setView("catalogue");
  };

  const getIconComponent = (name) => {
    const icons = { Database, Code, Network, Layers, Video, FileText, FileCode };
    return icons[name] || BookOpen;
  };

  const getMaterialIcon = (type) => {
    switch(type) {
      case 'video': return <Video size={20} className="text-blue-500" />;
      case 'pdf': return <FileText size={20} className="text-red-500" />;
      case 'code': return <FileCode size={20} className="text-emerald-500" />;
      default: return <FileText size={20} className="text-slate-400" />;
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <Loader2 size={48} className="animate-spin text-blue-600 mb-6" />
        <p className="text-slate-400 font-extrabold tracking-widest text-xs uppercase animate-pulse">Syncing Portal...</p>
      </div>
    );
  }

  // --- Discovery View (The Grid of Programs) ---
  if (view === "discovery") {
    return (
      <div className="min-h-screen bg-slate-50 selection:bg-blue-100">
         {/* Top Navbar */}
         <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                     <GraduationCap size={22} className="text-white" />
                  </div>
                  <div>
                     <h1 className="text-lg font-black text-slate-900 tracking-tight">Nexus Academic</h1>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Materials</p>
                  </div>
               </div>
               <div className="hidden md:flex bg-slate-100/50 p-1 rounded-2xl border border-slate-100">
                  <button className="px-5 py-2 bg-white text-blue-600 rounded-xl text-xs font-black shadow-sm">My Catalog</button>
                  <button className="px-5 py-2 text-slate-400 text-xs font-black">History</button>
               </div>
            </div>
         </div>

         {/* Hero Discovery */}
         <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="mb-16 max-w-2xl">
               <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-4">
                  <div className="w-10 h-1 bg-blue-600 rounded-full" />
                  Program Explorer
               </div>
               <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
                  Access Your <span className="text-blue-600">Curriculum</span> & <br/>Learning Resources
               </h2>
               <p className="text-slate-500 font-medium text-lg leading-relaxed">
                  Explore academic programs, drill down into your current semester, and access professional-grade learning materials.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {courses.map(c => (
                 <div key={c._id} className="bg-white p-10 rounded-[3rem] border border-slate-100 group relative overflow-hidden hover:shadow-3xl transition-all cursor-pointer animate-fadeInScale" onClick={() => handleProgramSelect(c)}>
                    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:scale-150 transition-all duration-1000" style={{backgroundColor: c.color}} />
                    
                    <div className="w-16 h-16 rounded-[1.8rem] mb-10 flex items-center justify-center text-white shadow-2xl relative z-10 transition-transform group-hover:scale-110" style={{backgroundColor: c.color}}>
                       {(() => {const I = getIconComponent(c.icon); return <I size={28}/>})()}
                    </div>
                    
                    <h4 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{c.name}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3 mb-10">{c.description}</p>
                    
                    <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-auto">
                       <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                             {[1,2,3,4].map(i => <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">Y{i}</div>)}
                          </div>
                          <span className="text-[10px] font-black text-slate-400 ml-3 uppercase tracking-tighter">FULL CATALOGUE</span>
                       </div>
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ArrowRight size={20} />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    );
  }

  // --- Catalogue View (Navigation Matrix) ---
  if (view === "catalogue") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
         {/* Context Bar */}
         <div className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <button onClick={() => setView("discovery")} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all group">
                     <ArrowLeft size={18} />
                  </button>
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg" style={{backgroundColor: selectedCourse?.color}}>
                        {(() => {const I = getIconComponent(selectedCourse?.icon); return <I size={16}/>})()}
                     </div>
                     <div className="flex items-center gap-2 text-sm font-black text-slate-900 tracking-tight">
                        {selectedCourse?.name}
                        <span className="text-slate-300 text-xs mx-1">/</span>
                        <span className="text-blue-600 uppercase tracking-widest text-[10px]">{selectedYear}</span>
                        <span className="text-slate-300 text-xs mx-1">/</span>
                        <span className="text-blue-600 uppercase tracking-widest text-[10px]">{selectedSemester}</span>
                     </div>
                  </div>
               </div>
               <Search className="text-slate-300" size={20} />
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full grid grid-cols-1 xl:grid-cols-12 gap-10">
            {/* Matrix Selector */}
            <div className="xl:col-span-3 space-y-6">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 sticky top-28 shadow-sm">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-8 flex items-center gap-2">
                     <Calendar size={14} /> Academic Focus
                  </h3>
                  
                  <div className="space-y-10">
                     <div>
                        <p className="text-[10px] font-black text-slate-300 mb-5 tracking-tighter">SELECT YEAR</p>
                        <div className="grid grid-cols-4 gap-2">
                           {[1, 2, 3, 4].map(num => {
                              const yearStr = `Year ${num}`;
                              // Resilience check for legacy/new year formats
                              const exists = selectedCourse?.years.some(y => 
                                (typeof y.year === 'string' && y.year === yearStr) || 
                                (typeof y.year === 'object' && y.year.year === yearStr)
                              );
                              return (
                                 <button key={num} onClick={() => exists && setSelectedYear(yearStr)} className={`aspect-square rounded-2xl flex items-center justify-center text-sm font-black transition-all ${selectedYear === yearStr ? "bg-slate-900 text-white shadow-xl scale-110" : exists ? "bg-white text-slate-500 border border-slate-100 hover:scale-105" : "bg-slate-50/50 text-slate-200 cursor-not-allowed"}`}>Y{num}</button>
                              );
                           })}
                        </div>
                     </div>

                     <div>
                        <p className="text-[10px] font-black text-slate-300 mb-5 tracking-tighter">SELECT SEMESTER</p>
                        <div className="space-y-2">
                           {["Semester 1", "Semester 2"].map(s => (
                              <button key={s} onClick={() => setSelectedSemester(s)} className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-black transition-all border ${selectedSemester === s ? "bg-white border-blue-200 text-blue-600 shadow-xl translate-x-1" : "border-transparent text-slate-400 hover:bg-white/40"}`}>
                                 <div className="flex items-center justify-between">
                                    {s}
                                    {selectedSemester === s && <ChevronRight size={16} />}
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Modules Loop */}
            <div className="xl:col-span-9 space-y-8 animate-fadeInUp">
               <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                     <LayoutGrid className="text-blue-600" size={28}/>
                     Core Curriculum
                  </h2>
                  <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest">{modules.length} Modules Found</div>
               </div>

               {loading ? (
                  <div className="flex flex-col items-center justify-center py-40 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                     <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                     <p className="text-slate-400 font-extrabold text-[10px] uppercase">Mapping modules...</p>
                  </div>
               ) : modules.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-40 bg-white border border-slate-100 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                     <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2.5rem] flex items-center justify-center mb-6"><BookOpen size={40}/></div>
                     <h3 className="text-xl font-black text-slate-900 mb-2">Curriculum Not Provided</h3>
                     <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">No modules have been indexed for this period by the lecturers yet.</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                     {modules.map(m => (
                       <div key={m._id} className="bg-white group p-8 rounded-[3rem] border border-slate-100 hover:shadow-3xl hover:translate-y-[-8px] transition-all cursor-pointer relative overflow-hidden animate-fadeInScale" onClick={() => loadModuleDetails(m)}>
                          <div className="absolute top-0 right-0 p-8 flex opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                             <div className="w-10 h-10 bg-blue-600 text-white rounded-xl shadow-xl flex items-center justify-center"><ArrowRight size={20}/></div>
                          </div>

                          <div className="flex items-center gap-2 mb-6">
                             <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{m.id}</span>
                             <div className="w-1 h-1 bg-slate-200 rounded-full" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.credits} CREDITS</span>
                          </div>

                          <h4 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{m.name}</h4>
                          <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 line-clamp-2">{m.description}</p>
                          
                          <div className="flex items-center gap-6 pt-6 border-t border-slate-100/60">
                             <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><Users size={12}/></div>
                                <span className="text-[10px] font-black text-slate-900 truncate max-w-[100px]">{m.instructor}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><Clock size={12}/></div>
                                <span className="text-[10px] font-black text-slate-900 truncate max-w-[80px]">{m.schedule}</span>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
    );
  }

  // --- Module Learning Mode View ---
  if (view === "module" && selectedModule) {
    return (
      <div className="min-h-screen bg-white">
         <div className="fixed inset-0 bg-slate-50/50 -z-10" />
         
         {/* Navigation Nav */}
         <div className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <button onClick={() => setView("catalogue")} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all group">
                     <ArrowLeft size={18} />
                  </button>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={10} /> Active Learning Mode
                     </span>
                     <h2 className="text-sm font-black text-slate-900 tracking-tight">{selectedModule.name}</h2>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black border border-green-100 tracking-widest flex items-center gap-2">
                     <div className="w-1 h-1 bg-green-600 rounded-full animate-pulse" />
                     {selectedModule.id}
                  </div>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
               {/* Left Context */}
               <div className="lg:col-span-1 space-y-8 animate-fadeIn">
                  <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-xl">
                     <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">{selectedModule.name}</h3>
                     <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10">{selectedModule.description}</p>
                     
                     <div className="space-y-6">
                        <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600"><Users size={20}/></div>
                              <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400">LECTURER</span><span className="text-xs font-black text-slate-900">{selectedModule.instructor}</span></div>
                           </div>
                           <ChevronRight size={14} className="text-slate-200" />
                        </div>
                        <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600"><Clock size={20}/></div>
                              <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400">SCHEDULE</span><span className="text-xs font-black text-slate-900">{selectedModule.schedule}</span></div>
                           </div>
                           <ChevronRight size={14} className="text-slate-200" />
                        </div>
                        <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600"><Award size={20}/></div>
                              <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400">CREDITS</span><span className="text-xs font-black text-slate-900">{selectedModule.credits} Credits</span></div>
                           </div>
                           <ChevronRight size={14} className="text-slate-200" />
                        </div>
                     </div>

                     <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[1.8rem] text-sm font-black shadow-2xl shadow-slate-200 hover:translate-y-[-4px] transition-all flex items-center justify-center gap-3">
                        <Bookmark size={18}/>
                        Bookmark Module
                     </button>
                  </div>
               </div>

               {/* Right Materials List */}
               <div className="lg:col-span-2 space-y-10 animate-fadeInUp">
                  <div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-2">
                        <FileText className="text-blue-600" size={24}/>
                        Lecture Materials
                     </h2>
                     <p className="text-slate-400 text-sm font-bold uppercase tracking-widest pl-2">Access PDFs, Videos, and Code Labs</p>
                  </div>

                  <div className="space-y-4">
                     {selectedModule.materials && selectedModule.materials.length > 0 ? (
                        selectedModule.materials.map((mat, idx) => (
                           <div key={idx} className="bg-white group p-6 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all cursor-pointer flex items-center justify-between animate-fadeInScale">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    {getMaterialIcon(mat.type)}
                                 </div>
                                 <div className="flex flex-col">
                                    <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{mat.title}</h4>
                                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                       <span>{mat.type}</span>
                                       {mat.duration && <><span className="w-1 h-1 bg-slate-200 rounded-full" /> <span>{mat.duration}</span></>}
                                       {mat.pages && <><span className="w-1 h-1 bg-slate-200 rounded-full" /> <span>{mat.pages} Pages</span></>}
                                       {mat.exercises && <><span className="w-1 h-1 bg-slate-200 rounded-full" /> <span>{mat.exercises} Exercises</span></>}
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => mat.url !== "#" && window.open(mat.url, "_blank")} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                    <Download size={20} />
                                 </button>
                                 <button onClick={() => mat.url !== "#" && window.open(mat.url, "_blank")} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                                    <ExternalLink size={20} />
                                 </button>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="py-32 bg-white rounded-[3rem] text-center border-2 border-dashed border-slate-200">
                           <FileCode size={40} className="mx-auto text-slate-300 mb-6" />
                           <h4 className="text-xl font-black text-slate-900 mb-2">No Resources Yet</h4>
                           <p className="text-slate-400 text-sm font-medium">Lecturers haven't uploaded materials for this module yet.</p>
                        </div>
                     )}
                  </div>

                  {/* Syllabus / Outcomes Section */}
                  <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-3xl shadow-slate-200 relative overflow-hidden group mt-10">
                     <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                     <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                           <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400"><Target size={24}/></div>
                           <div>
                              <h3 className="text-2xl font-black tracking-tight">Academic Integrity</h3>
                              <p className="text-blue-100/60 text-xs font-bold uppercase tracking-widest">Policy Agreement</p>
                           </div>
                        </div>
                        <p className="text-sm font-medium text-blue-50/70 leading-relaxed max-w-xl mb-10">
                           All materials provided here are the intellectual property of Nexus Academic. Redeclaration, redistribution, or unauthorized sharing of these resources is strictly prohibited under the Nexus Integrity Charter.
                        </p>
                        <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl text-xs font-black shadow-2xl hover:scale-105 transition-all">READ FULL POLICY</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  }

  return null;
};

export default StudentMaterialsHub;