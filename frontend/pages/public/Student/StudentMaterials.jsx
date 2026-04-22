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
  AlertCircle
} from "lucide-react";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CourseModules = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [view, setView] = useState("courses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch modules when course, year, or semester changes
  useEffect(() => {
    if (selectedCourse && selectedYear && selectedSemester) {
      fetchModules();
    }
  }, [selectedCourse, selectedYear, selectedSemester]);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
      
      // Select first course by default
      if (data.length > 0) {
        const firstCourse = data[0];
        setSelectedCourse(firstCourse);
        if (firstCourse.years && firstCourse.years.length > 0) {
          setSelectedYear(firstCourse.years[0].year);
          if (firstCourse.years[0].semesters && firstCourse.years[0].semesters.length > 0) {
            setSelectedSemester(firstCourse.years[0].semesters[0].name);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/modules/location/${selectedCourse._id}/${selectedYear}/${selectedSemester}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch modules');
      }
      const data = await response.json();
      setModules(data);
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError(err.message);
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchModuleDetails = async (moduleId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch module details');
      }
      const data = await response.json();
      setSelectedModule(data);
      setView("module");
    } catch (err) {
      console.error('Error fetching module details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (module) => {
    fetchModuleDetails(module._id);
  };

  const handleBack = () => {
    setView("courses");
    setSelectedModule(null);
  };

  const getIconComponent = (iconName) => {
    const icons = {
      Database: Database,
      Code: Code,
      Network: Network,
      Layers: Layers
    };
    return icons[iconName] || BookOpen;
  };

  const getMaterialIcon = (type) => {
    switch(type) {
      case 'video': return <Video size={20} className="text-blue-500" />;
      case 'pdf': return <FileText size={20} className="text-red-500" />;
      case 'code': return <FileCode size={20} className="text-green-500" />;
      default: return <FileText size={20} />;
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Failed to load courses</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={fetchCourses}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Module Detail View
  if (view === "module" && selectedModule) {
    return (
      <ModuleDetailPage
        module={selectedModule}
        courseName={selectedCourse?.name}
        onBack={handleBack}
        getMaterialIcon={getMaterialIcon}
      />
    );
  }

  // Main Course View
  const currentCourse = selectedCourse;
  const CourseIcon = currentCourse ? getIconComponent(currentCourse.icon) : BookOpen;
  const yearsData = currentCourse?.years || [];
  const currentYearData = yearsData.find(y => y.year === selectedYear);
  const semesters = currentYearData?.semesters || [];
  const currentModules = modules || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nexus University</h1>
                <p className="text-xs text-gray-500">Course Explorer</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full">
                Student Portal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back, Student!</h1>
              <p className="text-white/90 text-lg max-w-2xl">
                Select your program, explore modules, and access lecture materials
              </p>
            </div>
            <div className="flex gap-2">
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2 text-sm">
                <span className="font-semibold">2024-2025</span>
                <span className="mx-2">•</span>
                <span>Academic Year</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Course Cards */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Programs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course) => {
              const isActive = selectedCourse?._id === course._id;
              const IconComp = getIconComponent(course.icon);
              return (
                <button
                  key={course._id}
                  onClick={() => {
                    setSelectedCourse(course);
                    if (course.years && course.years.length > 0) {
                      setSelectedYear(course.years[0].year);
                      if (course.years[0].semesters && course.years[0].semesters.length > 0) {
                        setSelectedSemester(course.years[0].semesters[0].name);
                      }
                    }
                  }}
                  className={`group text-left p-4 rounded-xl transition-all ${
                    isActive
                      ? "bg-white shadow-lg border-2 border-primary ring-2 ring-primary/20"
                      : "bg-white border border-gray-200 hover:shadow-md hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${course.color}15` }}
                    >
                      <IconComp size={20} style={{ color: course.color }} />
                    </div>
                    <h3 className={`font-semibold ${isActive ? "text-primary" : "text-gray-900"}`}>
                      {course.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{course.description}</p>
                  {isActive && (
                    <div className="mt-2 text-xs text-primary font-medium">Currently selected</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        {currentCourse && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Year & Semester */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
                <div
                  className="p-5"
                  style={{ backgroundColor: `${currentCourse.color}10`, borderBottom: `2px solid ${currentCourse.color}` }}
                >
                  <div className="flex items-center gap-3">
                    <CourseIcon size={24} style={{ color: currentCourse.color }} />
                    <div>
                      <h2 className="font-bold text-gray-900">{currentCourse.name}</h2>
                      <p className="text-xs text-gray-500">Program Details</p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {/* Year Selection */}
                  <div className="mb-6">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                      Academic Year
                    </label>
                    <div className="flex gap-2">
                      {yearsData.map((year) => (
                        <button
                          key={year.year}
                          onClick={() => {
                            setSelectedYear(year.year);
                            if (year.semesters && year.semesters.length > 0) {
                              setSelectedSemester(year.semesters[0].name);
                            }
                          }}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                            selectedYear === year.year
                              ? "bg-primary text-white shadow-sm"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {year.year.replace("Year ", "Y")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Semester Selection */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                      Semester
                    </label>
                    <div className="space-y-2">
                      {semesters.map((sem) => (
                        <button
                          key={sem.name}
                          onClick={() => setSelectedSemester(sem.name)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center justify-between ${
                            selectedSemester === sem.name
                              ? "bg-primary/10 text-primary font-medium border-l-4 border-primary"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Calendar size={16} />
                            {sem.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {sem.modules?.length || 0} modules
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Modules List */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedSemester} Modules
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      <span className="font-semibold text-primary">{currentModules.length}</span> modules
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {currentCourse.name} • {selectedYear} • Core curriculum
                </p>
              </div>

              {loading ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                  <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
                  <p className="text-gray-500">Loading modules...</p>
                </div>
              ) : currentModules.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                  <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No modules available for this selection</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentModules.map((module, idx) => (
                    <div
                      key={module._id}
                      onClick={() => handleModuleClick(module)}
                      className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition">
                              {module.name}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Award size={12} /> {module.credits} credits
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} /> {module.instructor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {module.schedule}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition">
                            <ChevronRight size={18} className="text-gray-400 group-hover:text-primary" />
                          </div>
                        </div>
                      </div>
                      {/* Materials Preview */}
                      {module.materials && module.materials.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
                          {module.materials.slice(0, 3).map((material, i) => (
                            <div key={i} className="flex items-center gap-1 text-xs text-gray-400">
                              {getMaterialIcon(material.type)}
                              <span>{material.type}</span>
                            </div>
                          ))}
                          {module.materials.length > 3 && (
                            <span className="text-xs text-gray-400">+{module.materials.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Module Detail Page Component
const ModuleDetailPage = ({ module, courseName, onBack, getMaterialIcon }) => {
  const [activeTab, setActiveTab] = useState("materials");

  const handleDownload = (material) => {
    if (material.url && material.url !== '#') {
      window.open(material.url, '_blank');
    } else {
      alert('Download link not available yet');
    }
  };

  const handlePreview = (material) => {
    if (material.url && material.url !== '#') {
      window.open(material.url, '_blank');
    } else {
      alert('Preview not available yet');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to {courseName}</span>
          </button>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{module.name}</h1>
              <p className="text-gray-600 mt-1">{module.description}</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {module.credits} Credits
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-mono">
                {module.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("materials")}
              className={`py-3 px-1 font-medium transition relative ${
                activeTab === "materials"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Lecture Materials
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`py-3 px-1 font-medium transition relative ${
                activeTab === "info"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Course Info
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "materials" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Learning Materials</h2>
              <p className="text-gray-600">Access all lectures, readings, and resources for this module</p>
            </div>
            <div className="grid gap-4">
              {module.materials && module.materials.length > 0 ? (
                module.materials.map((material, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary/10 transition">
                        {getMaterialIcon(material.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition">
                          {material.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          {material.duration && (
                            <span className="flex items-center gap-1">
                              <Clock size={14} /> {material.duration}
                            </span>
                          )}
                          {material.pages && (
                            <span className="flex items-center gap-1">
                              <FileText size={14} /> {material.pages} pages
                            </span>
                          )}
                          {material.exercises && (
                            <span className="flex items-center gap-1">
                              <FileCode size={14} /> {material.exercises} exercises
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreview(material)}
                          className="p-2 text-gray-400 hover:text-primary transition"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(material)}
                          className="p-2 text-gray-400 hover:text-primary transition"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                  <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No materials available for this module yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "info" && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Instructor</label>
                  <p className="text-gray-900 mt-1 flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    {module.instructor}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Schedule</label>
                  <p className="text-gray-900 mt-1 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    {module.schedule}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Credits</label>
                  <p className="text-gray-900 mt-1 flex items-center gap-2">
                    <Award size={16} className="text-gray-400" />
                    {module.credits} credits
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Module Code</label>
                  <p className="text-gray-900 mt-1 font-mono text-sm">{module.id}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-700 mt-1 leading-relaxed">{module.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseModules;