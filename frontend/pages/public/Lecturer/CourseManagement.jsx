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
  FileText,
  Video,
  Download,
  Eye,
  ArrowLeft,
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  FolderOpen,
  Link,
  Settings,
  School,
  BookMarked,
  AlertCircle,
  Check,
  Loader2,
  PlusCircle,
  MinusCircle,
  Sparkles,
  Search,
  LayoutGrid,
  FileCode,
  ExternalLink,
  Target
} from "lucide-react";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Service
const apiService = {
  async getCourses() {
    const res = await fetch(`${API_BASE_URL}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },
  async getModulesByLocation(courseId, year, semester) {
    const res = await fetch(`${API_BASE_URL}/modules/location/${courseId}/${year}/${semester}`);
    if (!res.ok) throw new Error('Failed to fetch modules');
    return res.json();
  },
  async createModule(data) {
    const res = await fetch(`${API_BASE_URL}/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create module');
    return res.json();
  },
  async updateModule(id, data) {
    const res = await fetch(`${API_BASE_URL}/modules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update module');
    return res.json();
  },
  async deleteModule(id) {
    const res = await fetch(`${API_BASE_URL}/modules/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete module');
    return res.json();
  },
  async createMaterial(data) {
    const res = await fetch(`${API_BASE_URL}/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add material');
    return res.json();
  },
  async updateMaterial(id, data) {
    const res = await fetch(`${API_BASE_URL}/materials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update material');
    return res.json();
  },
  async deleteMaterial(id) {
    const res = await fetch(`${API_BASE_URL}/materials/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove material');
    return res.json();
  }
};

const LecturerCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Modals
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleModalMode, setModuleModalMode] = useState("add");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form States
  const [moduleForm, setModuleForm] = useState({
    _id: "", id: "", name: "", credits: "4", description: "", instructor: "", schedule: "", materials: []
  });
  const [materialForm, setMaterialForm] = useState({
    type: "pdf", title: "", url: "#", duration: "", pages: "", exercises: ""
  });
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [editingMaterialIdx, setEditingMaterialIdx] = useState(null);

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => {
    if (selectedCourseId && selectedYear && selectedSemester) loadModules();
  }, [selectedCourseId, selectedYear, selectedSemester]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCourses();
      setCourses(data);
      if (data.length > 0 && !selectedCourseId) {
        setSelectedCourseId(data[0]._id);
        setSelectedYear(data[0].years[0]?.year || "Year 1");
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadModules = async () => {
    setLoading(true);
    try {
      const data = await apiService.getModulesByLocation(selectedCourseId, selectedYear, selectedSemester);
      setModules(data);
    } catch (err) { setModules([]); }
    finally { setLoading(false); }
  };

  const handleAddModule = () => {
    const activeCourse = courses.find(c => c._id === selectedCourseId);
    if (!activeCourse) return;
    const prefix = activeCourse.name.substring(0, 2).toUpperCase();
    const rand = Math.floor(100 + Math.random() * 899);
    
    setModuleModalMode("add");
    setModuleForm({
      _id: "", id: `${prefix}${rand}`, name: "", credits: "4", description: "", instructor: "", schedule: "", materials: []
    });
    setIsModuleModalOpen(true);
  };

  const handleEditModule = (m) => {
    setModuleModalMode("edit");
    setModuleForm(m);
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = async () => {
    if (!moduleForm.name || !moduleForm.description) return alert("Fill required fields");
    setLoading(true);
    try {
      const payload = { ...moduleForm, courseId: selectedCourseId, year: selectedYear, semester: selectedSemester };
      if (moduleModalMode === "add") await apiService.createModule(payload);
      else await apiService.updateModule(moduleForm._id, payload);
      
      setSuccessMessage("Changes Committed!");
      setIsModuleModalOpen(false);
      loadModules();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleSaveMaterial = async () => {
    if (!materialForm.title) return;
    setLoading(true);
    try {
      if (moduleModalMode === "add") {
         // Local state for new module
         const updatedMats = [...moduleForm.materials];
         if (editingMaterialIdx !== null) updatedMats[editingMaterialIdx] = materialForm;
         else updatedMats.push(materialForm);
         setModuleForm({...moduleForm, materials: updatedMats});
      } else {
         // Persistent for existing module
         if (editingMaterialIdx !== null) await apiService.updateMaterial(moduleForm.materials[editingMaterialIdx]._id, materialForm);
         else await apiService.createMaterial({...materialForm, moduleId: moduleForm._id});
         
         const updatedModules = await apiService.getModulesByLocation(selectedCourseId, selectedYear, selectedSemester);
         const current = updatedModules.find(m => m._id === moduleForm._id);
         if (current) setModuleForm(current);
      }
      setIsAddingMaterial(false);
      setEditingMaterialIdx(null);
      setMaterialForm({ type: "pdf", title: "", url: "#", duration: "", pages: "", exercises: "" });
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleDeleteMaterial = async (idx) => {
    if (!window.confirm("Remove material?")) return;
    try {
      if (moduleModalMode === "edit") {
         await apiService.deleteMaterial(moduleForm.materials[idx]._id);
      }
      const updated = moduleForm.materials.filter((_, i) => i !== idx);
      setModuleForm({...moduleForm, materials: updated});
    } catch (err) { alert(err.message); }
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await apiService.deleteModule(itemToDelete._id);
      loadModules();
      setIsDeleteConfirmOpen(false);
      setSuccessMessage("Record Purged");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const currentCourse = courses.find(c => c._id === selectedCourseId);
  const getIcon = (name) => {
    const icons = { Database, Code, Network, Layers, Video, FileText, FileCode };
    const I = icons[name] || BookOpen;
    return <I size={18} />;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 animate-fadeInScale italic-none">
      {/* Messages */}
      {successMessage && (
        <div className="fixed bottom-10 right-10 z-[100] bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl animate-fadeInScale border border-white/10 font-black">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"><Check size={16}/></div>
             {successMessage}
          </div>
        </div>
      )}

      {/* Modern Dashboard Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
         <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <LayoutGrid size={24} />
               </div>
               <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">Content Studio</h1>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                     Lecturer Control Hub
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                  <button className="px-5 py-2 bg-white rounded-xl shadow-sm text-xs font-black text-blue-600">My Courses</button>
                  <button className="px-5 py-2 text-xs font-black text-slate-400">Archived</button>
               </div>
               <button onClick={handleAddModule} className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2">
                  <Plus size={16} />
                  Initiate Module
               </button>
            </div>
         </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-8 py-12">
         {/* Program Selection Strip */}
         <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 mb-10 overflow-hidden shadow-sm">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
               {courses.map(c => (
                 <button
                   key={c._id}
                   onClick={() => { setSelectedCourseId(c._id); setSelectedYear(c.years[0].year); }}
                   className={`flex items-center gap-3 px-6 py-4 rounded-[1.8rem] whitespace-nowrap transition-all border ${selectedCourseId === c._id ? "bg-white border-blue-100 shadow-xl scale-[1.03]" : "border-transparent text-slate-400 hover:bg-white/50"}`}
                 >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg" style={{backgroundColor: c.color}}>
                       {getIcon(c.icon)}
                    </div>
                    <span className="font-black text-sm tracking-tight">{c.name}</span>
                 </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Nav Matrix */}
            <div className="lg:col-span-3 space-y-6">
               <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm sticky top-32">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-8 flex items-center gap-2">
                     <Calendar size={14} /> Curriculum Point
                  </h3>
                  
                  <div className="space-y-10">
                     <div>
                        <p className="text-[9px] font-black text-slate-300 mb-5 tracking-tighter uppercase">Academic Year</p>
                        <div className="grid grid-cols-4 gap-2">
                           {[1, 2, 3, 4].map(num => {
                              const yStr = `Year ${num}`;
                              const exists = currentCourse?.years.some(y => 
                                (typeof y.year === 'string' && y.year === yStr) || 
                                (typeof y.year === 'object' && y.year.year === yStr)
                              );
                              return (
                                 <button key={num} onClick={() => exists && setSelectedYear(yStr)} className={`aspect-square rounded-2xl flex items-center justify-center text-sm font-black transition-all ${selectedYear === yStr ? "bg-slate-900 text-white shadow-xl scale-110" : exists ? "bg-white text-slate-500 border border-slate-100 hover:scale-105" : "bg-slate-50/50 text-slate-200 cursor-not-allowed"}`}>Y{num}</button>
                              );
                           })}
                        </div>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-300 mb-5 tracking-tighter uppercase">Semester</p>
                        <div className="space-y-2">
                           {["Semester 1", "Semester 2"].map(s => (
                              <button key={s} onClick={() => setSelectedSemester(s)} className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-black transition-all border ${selectedSemester === s ? "bg-white border-blue-200 text-blue-600 shadow-xl translate-x-1" : "border-transparent text-slate-400 hover:bg-white/40"}`}>{s}</button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Modules Workbench */}
            <div className="lg:col-span-9 space-y-8 animate-fadeInUp">
               <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedSemester} <span className="text-blue-600">Assets</span></h2>
                  <div className="flex items-center gap-3">
                     <Search size={20} className="text-slate-300" />
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{modules.length} modules available</span>
                  </div>
               </div>

               {loading ? (
                  <div className="py-40 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                     <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Refreshing Workbench...</p>
                  </div>
               ) : modules.length === 0 ? (
                  <div className="py-40 bg-white shadow-sm rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                     <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6"><Target size={40}/></div>
                     <h3 className="text-xl font-black text-slate-900 mb-2">Workbench Empty</h3>
                     <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">You haven't initialized any modules for this period yet.</p>
                     <button onClick={handleAddModule} className="mt-8 text-blue-600 font-black text-sm hover:underline">Add First Module</button>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                     {modules.map(m => (
                       <div key={m._id} className="bg-white shadow-sm group p-8 rounded-[3.5rem] border border-slate-100 hover:shadow-2xl hover:translate-y-[-8px] transition-all relative overflow-hidden animate-fadeInScale">
                          <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                             <button onClick={() => handleEditModule(m)} className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:scale-110 transition-all border border-slate-100"><Edit size={16} /></button>
                             <button onClick={() => { setItemToDelete(m); setIsDeleteConfirmOpen(true); }} className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 transition-all border border-slate-100"><Trash2 size={16} /></button>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-6">
                             <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black tracking-widest">{m.id}</span>
                             <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black lowercase tracking-[0.1em]">{m.credits} CR</div>
                             <div className="w-1 h-1 bg-slate-200 rounded-full mx-1" />
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.materials?.length || 0} RESOURCES</span>
                          </div>

                          <h4 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{m.name}</h4>
                          <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 line-clamp-2">{m.description}</p>
                          
                          <div className="flex items-center gap-6 pt-6 border-t border-slate-100/60">
                             <div className="flex flex-col"><span className="text-[8px] font-black text-slate-400">INSTRUCTOR</span><span className="text-[11px] font-black text-slate-900">{m.instructor}</span></div>
                             <div className="flex flex-col"><span className="text-[8px] font-black text-slate-400">SCHEDULE</span><span className="text-[11px] font-black text-slate-900">{m.schedule}</span></div>
                          </div>
                       </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </main>

      {/* Content Creation Studio Modal */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/80 animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-4xl flex flex-col max-h-[90vh] border border-slate-200 p-2">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center rounded-t-[3.8rem]">
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{moduleModalMode === "add" ? "Initiate" : "Studio"} Module</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{currentCourse?.name} • {moduleForm.id}</p>
               </div>
               <button onClick={() => setIsModuleModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-md transition-all hover:scale-105 active:scale-95"><X size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
               {/* Left: General Settings */}
               <div className="p-10 space-y-8 overflow-y-auto border-r border-slate-100 scrollbar-none">
                  <div className="grid grid-cols-3 gap-6">
                     <div className="col-span-2 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Module Title</label>
                       <input value={moduleForm.name} onChange={e => setModuleForm({...moduleForm, name: e.target.value})} className="bg-slate-100 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-100/20 transition-all w-full px-7 py-4 rounded-[1.5rem] font-bold outline-none text-slate-900" placeholder="Data Structures" />
                     </div>
                     <div className="col-span-1 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Credits</label>
                       <input type="number" value={moduleForm.credits} onChange={e => setModuleForm({...moduleForm, credits: e.target.value})} className="bg-slate-100 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-100/20 transition-all w-full px-7 py-4 rounded-[1.5rem] font-bold outline-none text-slate-900" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Objective & Overview</label>
                     <textarea value={moduleForm.description} onChange={e => setModuleForm({...moduleForm, description: e.target.value})} className="bg-slate-100 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-100/20 transition-all w-full px-7 py-5 rounded-[2rem] font-bold h-32 outline-none resize-none text-slate-900" placeholder="Provide a brief summary..." />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Assigned Instructor</label>
                       <input value={moduleForm.instructor} onChange={e => setModuleForm({...moduleForm, instructor: e.target.value})} className="bg-slate-100 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-100/20 transition-all w-full px-7 py-4 rounded-[1.5rem] font-bold outline-none text-slate-900" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Standard Schedule</label>
                       <input value={moduleForm.schedule} onChange={e => setModuleForm({...moduleForm, schedule: e.target.value})} className="bg-slate-100 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-100/20 transition-all w-full px-7 py-4 rounded-[1.5rem] font-bold outline-none text-slate-900" />
                     </div>
                  </div>
               </div>

               {/* Right: Asset Studio */}
               <div className="p-10 space-y-8 overflow-y-auto bg-slate-50/30 scrollbar-none">
                  <div className="flex items-center justify-between">
                     <h4 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <FolderOpen className="text-blue-600" size={20}/>
                        Asset Studio
                     </h4>
                     <button onClick={() => { setIsAddingMaterial(true); setEditingMaterialIdx(null); }} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                        <Plus size={14}/> NEW ASSET
                     </button>
                  </div>

                  {isAddingMaterial && (
                     <div className="p-6 bg-white rounded-3xl border-2 border-blue-100 shadow-xl space-y-5 animate-fadeInScale">
                        <div className="flex gap-2">
                           {["pdf", "video", "code"].map(t => (
                              <button key={t} onClick={() => setMaterialForm({...materialForm, type: t})} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${materialForm.type === t ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-slate-50 text-slate-400"}`}>{t}</button>
                           ))}
                        </div>
                        <input value={materialForm.title} onChange={e => setMaterialForm({...materialForm, title: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all text-slate-900" placeholder="Asset Title (e.g. Lecture 01)" />
                        <div className="grid grid-cols-2 gap-4">
                           {materialForm.type === "video" ? (
                              <input value={materialForm.duration} onChange={e => setMaterialForm({...materialForm, duration: e.target.value})} placeholder="30 Min" className="px-5 py-3 rounded-xl bg-slate-50 font-bold text-sm outline-none text-slate-900" />
                           ) : materialForm.type === "pdf" ? (
                              <input type="number" value={materialForm.pages} onChange={e => setMaterialForm({...materialForm, pages: e.target.value})} placeholder="Pages" className="px-5 py-3 rounded-xl bg-slate-50 font-bold text-sm outline-none text-slate-900" />
                           ) : (
                              <input type="number" value={materialForm.exercises} onChange={e => setMaterialForm({...materialForm, exercises: e.target.value})} placeholder="Exercises" className="px-5 py-3 rounded-xl bg-slate-50 font-bold text-sm outline-none text-slate-900" />
                           )}
                           <input value={materialForm.url} onChange={e => setMaterialForm({...materialForm, url: e.target.value})} placeholder="Resource Link" className="px-5 py-3 rounded-xl bg-slate-50 font-bold text-sm outline-none text-slate-900" />
                        </div>
                        <div className="flex gap-3 pt-2">
                           <button onClick={() => { setIsAddingMaterial(false); setEditingMaterialIdx(null); }} className="flex-1 py-3 text-xs font-black text-slate-400">Cancel</button>
                           <button onClick={handleSaveMaterial} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-black shadow-lg">Save Asset</button>
                        </div>
                     </div>
                  )}

                  <div className="space-y-3">
                     {moduleForm.materials.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                           <p className="text-slate-300 font-extrabold text-xs uppercase tracking-widest italic">Inventory Empty</p>
                        </div>
                     ) : (
                        moduleForm.materials.map((m, i) => (
                           <div key={i} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 group">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                    {m.type === "pdf" ? <FileText size={18}/> : m.type === "video" ? <Video size={18}/> : <FileCode size={18}/>}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-xs font-black text-slate-900 tracking-tight">{m.title}</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{m.type} {m.duration || m.pages || m.exercises}</span>
                                 </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => { setEditingMaterialIdx(i); setMaterialForm(m); setIsAddingMaterial(true); }} className="p-2 text-slate-300 hover:text-blue-600"><Edit size={14}/></button>
                                 <button onClick={() => handleDeleteMaterial(i)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            </div>

            <div className="p-10 bg-slate-50 flex gap-4 rounded-b-[3.8rem]">
               <button onClick={() => setIsModuleModalOpen(false)} className="flex-1 py-5 font-black text-slate-500 hover:text-slate-800 transition-colors">Discard Draft</button>
               <button onClick={handleSaveModule} className="flex-1 py-5 bg-blue-600 text-white rounded-[1.8rem] font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                     <>
                        <Save size={20} />
                        Commit Structure
                     </>
                  )}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-slate-900/80 animate-fadeIn">
           <div className="bg-white p-12 rounded-[4rem] max-w-sm w-full text-center shadow-4xl border border-slate-200">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
                 <AlertCircle size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Are you sure?</h3>
              <p className="text-slate-400 font-bold mb-10 leading-relaxed text-sm">Purging this module will permanently delete all associated assets from the curriculum database.</p>
              <div className="flex gap-4">
                 <button onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-slate-600">Keep Data</button>
                 <button onClick={confirmDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black shadow-xl shadow-red-200 hover:bg-red-600">Confirm Wipe</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LecturerCourseManagement;