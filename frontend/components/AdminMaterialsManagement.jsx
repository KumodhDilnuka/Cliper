import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  Code,
  Database,
  Network,
  Layers,
  Users,
  Clock,
  CheckCircle,
  FileText,
  Video,
  School,
  BookMarked,
  Plus,
  Edit,
  Trash2,
  X,
  PlusCircle,
  AlertCircle,
  Loader2,
  FileCode,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Search,
  LayoutGrid,
  Filter,
  Save
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
  async createCourse(data) {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create course');
    return res.json();
  },
  async deleteCourse(id) {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete course');
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
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create module');
    }
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
  }
};

const iconComponents = { Database, Code, Network, Layers, Video, FileText, FileCode };
const getIconComponent = (name) => iconComponents[name] || BookOpen;

const AdminMaterialsManagement = () => {
  const [coursesList, setCoursesList] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [modules, setModules] = useState([]);
  const [activeTab, setActiveTab] = useState("modules");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    _id: "", id: "", name: "", credits: "4", description: "", instructor: "", schedule: "", materials: []
  });
  const [errors, setErrors] = useState({});
  const [newCourseData, setNewCourseData] = useState({
    name: "", color: "#4f8ef7", description: "", icon: "Database", years: ["Year 1", "Year 2", "Year 3", "Year 4"]
  });

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => {
    if (selectedCourseId && selectedYear && selectedSemester) loadModules();
  }, [selectedCourseId, selectedYear, selectedSemester]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCourses();
      setCoursesList(data);
      if (data.length > 0) {
        if (!selectedCourseId || !data.find(c => c._id === selectedCourseId)) {
          setSelectedCourseId(data[0]._id);
          setSelectedCourse(data[0].name);
          setSelectedYear(data[0].years[0]?.year || "Year 1");
        }
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

  const handleAddCourse = async () => {
    if (!newCourseData.name || !newCourseData.description) {
      alert("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourseData)
      });

      if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || 'Failed to create course');
      }
      
      setSuccessMessage("Program created successfully!");
      setIsAddCourseModalOpen(false);
      setNewCourseData({
        name: "", color: "#4f8ef7", description: "", icon: "Database", years: ["Year 1", "Year 2", "Year 3", "Year 4"]
      });
      loadCourses();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = () => {
    const activeCourse = coursesList.find(c => c._id === selectedCourseId);
    if (!activeCourse) { alert("Select a program first!"); return; }
    const prefix = activeCourse.name.substring(0, 2).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 899);
    
    setModalMode("add");
    setFormData({
      _id: "", id: `${prefix}${randomNum}`, name: "", credits: "4", description: "", instructor: "", schedule: "", materials: []
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEditModule = (m) => {
    setModalMode("edit");
    setFormData(m);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSaveModule = async () => {
    if (!selectedCourseId) { alert("Please select a Program first."); return; }
    if (!formData.name || !formData.description || !formData.instructor || !formData.schedule) { 
        alert("All fields are required.");
        return; 
    }

    setLoading(true);
    try {
      const payload = { ...formData, courseId: selectedCourseId, year: selectedYear, semester: selectedSemester };
      if (modalMode === "add") await apiService.createModule(payload);
      else await apiService.updateModule(formData._id, payload);
      
      setSuccessMessage("Module saved successfully!");
      setIsModalOpen(false);
      loadModules();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) { 
      alert("Error: " + err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      if (itemToDelete.type === "module") await apiService.deleteModule(itemToDelete.data._id);
      else await apiService.deleteCourse(itemToDelete.data._id);
      loadCourses();
      loadModules();
      setIsDeleteConfirmOpen(false);
      setSuccessMessage("Deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const currentCourse = coursesList.find(c => c._id === selectedCourseId);
  const semesters = currentCourse?.years.find(y => y.year === selectedYear)?.semesters || [];

  return (
    <div className="space-y-10 animate-fadeInUp">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed bottom-10 right-10 z-[100] bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl animate-fadeInScale border border-white/10 font-black">
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between">
         <div className="flex p-1.5 bg-slate-100 rounded-[2rem] border border-slate-200 shadow-inner">
            <button
               onClick={() => setActiveTab("modules")}
               className={`px-8 py-3 rounded-[1.7rem] text-sm font-black transition-all flex items-center gap-2 ${activeTab === "modules" ? "bg-white text-blue-600 shadow-xl" : "text-slate-500"}`}
            >
               Catalogue
            </button>
            <button
               onClick={() => setActiveTab("courses")}
               className={`px-8 py-3 rounded-[1.7rem] text-sm font-black transition-all flex items-center gap-2 ${activeTab === "courses" ? "bg-white text-blue-600 shadow-xl" : "text-slate-500"}`}
            >
               Programs
            </button>
         </div>

         {activeTab === "modules" && (
            <div className="flex items-center gap-4">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search modules..." 
                     className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-[1.5rem] w-64 text-sm font-bold outline-none shadow-sm focus:ring-4 focus:ring-blue-100/20 transition-all"
                  />
               </div>
               <button onClick={handleAddModule} className="bg-blue-600 text-white px-6 py-3 rounded-[1.5rem] text-sm font-black shadow-xl hover:bg-blue-700 transition-all">Add Module</button>
            </div>
         )}
      </div>

      {activeTab === "modules" ? (
        <div className="space-y-8">
          {/* Programs Strip */}
          <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {coursesList.map(c => (
                  <button
                    key={c._id}
                    onClick={() => { setSelectedCourseId(c._id); setSelectedCourse(c.name); setSelectedYear(c.years[0].year); }}
                    className={`flex items-center gap-3 px-6 py-4 rounded-[1.8rem] transition-all border ${selectedCourseId === c._id ? "bg-white border-blue-100 shadow-xl scale-[1.02]" : "border-transparent text-slate-500"}`}
                  >
                     <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{backgroundColor: c.color}}>
                        {(() => {const I = getIconComponent(c.icon); return <I size={18}/>})()}
                     </div>
                     <span className="font-black text-sm tracking-tight whitespace-nowrap">{c.name}</span>
                  </button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Navigation Matrix */}
            <div className="xl:col-span-3 space-y-6">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Academic Period</h3>
                  <div className="space-y-8">
                     <div>
                        <p className="text-[10px] font-black text-slate-300 mb-4 tracking-tighter">YEAR</p>
                        <div className="grid grid-cols-4 gap-2">
                           {[1, 2, 3, 4].map(num => {
                              const yearStr = `Year ${num}`;
                              // Support both string based and object based year lookups for resilience
                              const exists = currentCourse?.years.some(y => 
                                (typeof y.year === 'string' && y.year === yearStr) || 
                                (typeof y.year === 'object' && y.year.year === yearStr)
                              );
                              return (
                                 <button key={num} onClick={() => exists && setSelectedYear(yearStr)} className={`aspect-square rounded-2xl flex items-center justify-center text-sm font-black transition-all ${selectedYear === yearStr ? "bg-slate-900 text-white shadow-xl scale-110" : exists ? "bg-white text-slate-500 border border-slate-100" : "bg-slate-50/50 text-slate-200 cursor-not-allowed"}`}>Y{num}</button>
                              );
                           })}
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-300 mb-4 tracking-tighter">SEMESTER</p>
                        <div className="space-y-2">
                           {["Semester 1", "Semester 2"].map(s => (
                              <button key={s} onClick={() => setSelectedSemester(s)} className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-black transition-all border ${selectedSemester === s ? "bg-white border-blue-200 text-blue-600 shadow-lg translate-x-1" : "border-transparent text-slate-400"}`}>{s}</button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Modules Grid */}
            <div className="xl:col-span-9 space-y-6">
               <div className="flex items-center gap-4 px-2">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                     {selectedCourse} <span className="text-slate-300 mx-1">•</span> <span className="text-blue-600">{selectedYear} / {selectedSemester}</span>
                  </h2>
               </div>

               {loading ? <Loader2 className="animate-spin mx-auto mt-20 text-blue-600" size={40} /> : modules.length === 0 ? (
                  <div className="py-32 bg-white rounded-[2.5rem] shadow-sm text-center border-2 border-dashed border-slate-200">
                     <p className="font-extrabold text-slate-400 tracking-tight">No modules indexed for this period.</p>
                     <button onClick={handleAddModule} className="mt-4 text-blue-600 font-black text-sm hover:underline">Add First Module</button>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {modules.filter(m => searchQuery === "" || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase())).map(m => (
                      <div key={m._id} className="bg-white shadow-sm group p-7 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all relative overflow-hidden">
                         <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => handleEditModule(m)} className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-slate-400 hover:text-blue-600"><Edit size={14}/></button>
                            <button onClick={() => { setItemToDelete({type:'module', data:m}); setIsDeleteConfirmOpen(true); }} className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                         </div>
                         <div className="flex items-center justify-between mb-4">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black">{m.id}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.credits} CREDITS</span>
                         </div>
                         <h4 className="text-xl font-black text-slate-900 mb-2 truncate">{m.name}</h4>
                         <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6 h-10">{m.description}</p>
                         <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                            <div className="flex flex-col"><span className="text-[8px] font-black text-slate-300">LECTURER</span><span className="text-[10px] font-bold text-slate-800 truncate">{m.instructor}</span></div>
                            <div className="flex flex-col"><span className="text-[8px] font-black text-slate-300">SCHEDULE</span><span className="text-[10px] font-bold text-slate-800 truncate">{m.schedule}</span></div>
                         </div>
                      </div>
                    ))}
                  </div>
               )}
            </div>
          </div>
        </div>
      ) : (
        /* Programs View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {coursesList.map(c => (
             <div key={c._id} className="bg-white shadow-sm p-10 rounded-[3rem] border border-slate-100 group relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl mb-8 flex items-center justify-center text-white shadow-xl" style={{backgroundColor: c.color}}>
                   {(() => {const I = getIconComponent(c.icon); return <I size={24}/>})()}
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-2">{c.name}</h4>
                <p className="text-sm text-slate-500 font-medium line-clamp-2 h-10 mb-8">{c.description}</p>
                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                   <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">{c.years.length} Academic Years</span>
                   <button onClick={() => { setItemToDelete({type:'course', data:c}); setIsDeleteConfirmOpen(true); }} className="text-red-500 w-10 h-10 hover:bg-red-50 rounded-xl flex items-center justify-center"><Trash2 size={18} /></button>
                </div>
             </div>
           ))}
           <button onClick={() => setIsAddCourseModalOpen(true)} className="border-3 border-dashed border-slate-300 rounded-[3rem] p-12 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-blue-600 transition-all">
              <PlusCircle size={40} />
              <span className="font-black">Add New Program</span>
           </button>
        </div>
      )}

      {/* Module Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/80">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-3xl flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h3 className="text-2xl font-black tracking-tighter">{modalMode === "add" ? "New Module" : "Edit Module"}</h3>
               <button onClick={() => setIsModalOpen(false)}><X size={24}/></button>
            </div>
            <div className="p-10 overflow-y-auto space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Module Name</label>
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-100 border-none font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Credits</label>
                    <input type="number" value={formData.credits} onChange={e => setFormData({...formData, credits: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-100 border-none font-bold" />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-100 border-none font-bold h-24" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Instructor</label>
                    <input value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-100 border-none font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Schedule</label>
                    <input value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-slate-100 border-none font-bold" />
                  </div>
               </div>
               <div className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase">ID: {formData.id}</div>
            </div>
            <div className="p-10 bg-slate-50 flex gap-4">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 font-black text-slate-400">Cancel</button>
               <button onClick={handleSaveModule} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl">
                 {loading ? <Loader2 className="animate-spin mx-auto" /> : "Save Module"}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/80">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-3xl">
            <div className="p-10 border-b border-slate-100 flex justify-between bg-slate-50/50 rounded-t-[3.5rem]">
               <h3 className="text-2xl font-black tracking-tighter">Create Program</h3>
               <button onClick={() => setIsAddCourseModalOpen(false)}><X size={24}/></button>
            </div>
            <div className="p-10 space-y-6">
               <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Name</label>
                  <input value={newCourseData.name} onChange={e => setNewCourseData({...newCourseData, name: e.target.value})} className="w-full px-7 py-4 rounded-[1.8rem] bg-slate-100 border-none font-bold" />
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Description</label>
                  <textarea value={newCourseData.description} onChange={e => setNewCourseData({...newCourseData, description: e.target.value})} className="w-full px-7 py-5 rounded-[1.8rem] bg-slate-100 border-none font-bold h-32" />
               </div>
               <div className="flex gap-2">
                  {['#4f8ef7', '#7c5cfc', '#ef4444', '#10b981', '#f59e0b', '#000000'].map(color => (
                    <button key={color} onClick={() => setNewCourseData({...newCourseData, color})} className={`w-8 h-8 rounded-2xl ${newCourseData.color === color ? 'ring-2 ring-slate-900 scale-110' : ''}`} style={{backgroundColor: color}} />
                  ))}
               </div>
            </div>
            <div className="p-10 bg-slate-50 rounded-b-[3.5rem] flex gap-4">
               <button onClick={() => setIsAddCourseModalOpen(false)} className="flex-1 font-black text-slate-400">Cancel</button>
               <button onClick={handleAddCourse} className="flex-1 py-5 bg-blue-600 text-white rounded-[1.8rem] font-black shadow-xl">Initiate Program</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/80">
           <div className="bg-white p-12 rounded-[4rem] max-w-sm w-full text-center border-t-8 border-red-500">
              <h3 className="text-2xl font-black mb-1 tracking-tighter">Are you sure?</h3>
              <p className="text-slate-400 text-sm font-bold mb-8">This will purge the record from the database.</p>
              <div className="flex gap-4">
                 <button onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">No</button>
                 <button onClick={confirmDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold font-black">Wipe</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminMaterialsManagement;
