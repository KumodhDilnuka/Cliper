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
  ExternalLink,
  Zap,
  Sparkles,
  Home,
  Menu,
  X,
  FileText,
  Video,
  Download,
  Eye,
  ArrowLeft,
  Grid3x3,
  List,
  GraduationCap,
  Target,
  Globe,
  Cpu,
  BarChart,
  FileCode,
  Shield,
  Smartphone,
  Plus,
  Edit,
  Trash2,
  Save,
  XCircle,
  Upload,
  FolderOpen,
  Link,
  Settings,
  UserCog,
  School,
  BookMarked,
  FolderTree,
  AlertCircle,
  Check,
  Loader2,
  PlusCircle,
  MinusCircle,
} from "lucide-react";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Service with better error handling
const apiService = {
  // Courses
  async getCourses() {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch courses');
      }
      return response.json();
    } catch (error) {
      console.error('API Error - getCourses:', error);
      throw error;
    }
  },

  async getCourseStructure(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/structure`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch course structure');
      }
      return response.json();
    } catch (error) {
      console.error('API Error - getCourseStructure:', error);
      throw error;
    }
  },

  async createCourse(courseData) {
    try {
      console.log('Sending course data to backend:', courseData); // Debug log
      
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(courseData)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Server response:', responseData); // Debug log
        throw new Error(responseData.message || 'Failed to create course');
      }
      
      console.log('Course created successfully:', responseData); // Debug log
      return responseData;
    } catch (error) {
      console.error('API Error - createCourse:', error);
      throw error;
    }
  },

  async updateCourse(courseId, courseData) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update course');
      }
      return response.json();
    } catch (error) {
      console.error('API Error - updateCourse:', error);
      throw error;
    }
  },

  async deleteCourse(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete course');
      }
      return response.json();
    } catch (error) {
      console.error('API Error - deleteCourse:', error);
      throw error;
    }
  },

  // Modules
  async getModulesByLocation(courseId, year, semester) {
    try {
      const response = await fetch(`${API_BASE_URL}/modules/location/${courseId}/${year}/${semester}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch modules');
      }
      return response.json();
    } catch (error) {
      console.error('API Error - getModulesByLocation:', error);
      return []; // Return empty array on error
    }
  },

  async createModule(moduleData) {
    try {
      const response = await fetch(`${API_BASE_URL}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create module');
      }
      return response.json();
    } catch (error) {
      console.error('API Error - createModule:', error);
      throw error;
    }
  },

  async updateModule(moduleId, moduleData) {
    try {
      const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update module');
      }
      return response.json();
    } catch (error) {
      console.error('API Error - updateModule:', error);
      throw error;
    }
  },

  async deleteModule(moduleId) {
    try {
      const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete module');
      }
      return response.json();
    } catch (error) {
      console.error('API Error - deleteModule:', error);
      throw error;
    }
  },

  // Materials
  async getMaterialsByModule(moduleId) {
    try {
      const response = await fetch(`${API_BASE_URL}/materials/module/${moduleId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch materials');
      }
      return response.json();
    } catch (error) {
      console.error('API Error - getMaterialsByModule:', error);
      return [];
    }
  },

  async createMaterial(materialData) {
    try {
      const response = await fetch(`${API_BASE_URL}/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create material');
      }
      return response.json();
    } catch (error) {
      console.error('API Error - createMaterial:', error);
      throw error;
    }
  },

  async updateMaterial(materialId, materialData) {
    try {
      const response = await fetch(`${API_BASE_URL}/materials/${materialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update material');
      }
      return response.json();
    } catch (error) {
      console.error('API Error - updateMaterial:', error);
      throw error;
    }
  },

  async deleteMaterial(materialId) {
    try {
      const response = await fetch(`${API_BASE_URL}/materials/${materialId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete material');
      }
      return response.json();
    } catch (error) {
      console.error('API Error - deleteMaterial:', error);
      throw error;
    }
  }
};
// Icon mapping
const iconComponents = {
  Database: Database,
  Code: Code,
  Network: Network,
  Layers: Layers,
  Video: Video,
  FileText: FileText,
  FileCode: FileCode,
};

const getIconComponent = (iconName) => {
  return iconComponents[iconName] || BookOpen;
};

// Validation Helper Functions
const validateModuleForm = (formData) => {
  const errors = {};
  
  if (!formData.name.trim()) {
    errors.name = "Module name is required";
  }
  
  if (!formData.credits || formData.credits < 1 || formData.credits > 10) {
    errors.credits = "Credits must be between 1 and 10";
  }
  
  if (!formData.description.trim()) {
    errors.description = "Description is required";
  }
  
  if (!formData.instructor.trim()) {
    errors.instructor = "Instructor name is required";
  } else if (/\d/.test(formData.instructor)) {
    errors.instructor = "Instructor name cannot contain numbers";
  }
  
  if (!formData.schedule.trim()) {
    errors.schedule = "Schedule is required";
  }
  
  return errors;
};

const validateMaterial = (material) => {
  const errors = {};
  
  if (!material.title.trim()) {
    errors.title = "Material title is required";
  }
  
  if (material.type === "video") {
    if (!material.duration) {
      errors.duration = "Duration is required";
    } else {
      const durationMatch = material.duration.match(/\d+/);
      const durationValue = durationMatch ? parseInt(durationMatch[0]) : 0;
      if (durationValue < 1 || durationValue > 300) {
        errors.duration = "Duration must be between 1-300 minutes";
      }
    }
  }
  
  if (material.type === "pdf") {
    if (!material.pages) {
      errors.pages = "Number of pages is required";
    } else if (parseInt(material.pages) < 1 || parseInt(material.pages) > 1000) {
      errors.pages = "Pages must be between 1 and 1000";
    }
  }
  
  if (material.type === "code") {
    if (!material.exercises) {
      errors.exercises = "Number of exercises is required";
    } else if (parseInt(material.exercises) < 1 || parseInt(material.exercises) > 100) {
      errors.exercises = "Exercises must be between 1 and 100";
    }
  }
  
  return errors;
};

const validateCourseForm = (courseData, existingCourses, isEditMode) => {
  const errors = {};
  
  if (!courseData.name.trim()) {
    errors.name = "Course name is required";
  } else if (!isEditMode && existingCourses[courseData.name]) {
    errors.name = "Course already exists";
  }
  
  if (!courseData.description.trim()) {
    errors.description = "Description is required";
  }
  
  if (courseData.years && courseData.years.length === 0) {
    errors.years = "At least one year is required";
  }
  
  return errors;
};

const AdminPanel = () => {
  const [universityData, setUniversityData] = useState({});
  const [coursesList, setCoursesList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [modules, setModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formData, setFormData] = useState({
    _id: "",
    id: "",
    name: "",
    credits: "",
    description: "",
    instructor: "",
    schedule: "",
    materials: [],
  });
  const [newMaterial, setNewMaterial] = useState({
    type: "video",
    title: "",
    duration: "",
    pages: "",
    exercises: "",
    url: "#",
  });
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [editingMaterialIndex, setEditingMaterialIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [materialErrors, setMaterialErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("modules");
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    name: "",
    color: "#0056D2",
    description: "",
    icon: "Database",
    years: ["Year 1", "Year 2"],
  });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courseStructure, setCourseStructure] = useState(null);

  // Load initial data
  useEffect(() => {
    loadCourses();
  }, []);

  // Load modules when course/year/semester changes
  useEffect(() => {
    if (selectedCourseId && selectedYear && selectedSemester) {
      loadModules();
    }
  }, [selectedCourseId, selectedYear, selectedSemester]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const courses = await apiService.getCourses();
      setCoursesList(courses);
      
      // Transform courses data for display
      const coursesMap = {};
      courses.forEach(course => {
        coursesMap[course.name] = {
          _id: course._id,
          color: course.color,
          lightColor: course.lightColor,
          icon: course.icon,
          description: course.description,
          years: course.years.reduce((acc, year) => {
            acc[year.year] = {
              semesters: year.semesters.reduce((semAcc, semester) => {
                semAcc[semester.name] = {
                  modules: semester.modules || []
                };
                return semAcc;
              }, {})
            };
            return acc;
          }, {})
        };
      });
      setUniversityData(coursesMap);
      
      if (courses.length > 0 && !selectedCourseId) {
        setSelectedCourseId(courses[0]._id);
        setSelectedCourse(courses[0].name);
        const firstYear = courses[0].years[0]?.year || "Year 1";
        setSelectedYear(firstYear);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setSuccessMessage("Error loading courses: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadModules = async () => {
    setLoading(true);
    try {
      const modulesData = await apiService.getModulesByLocation(selectedCourseId, selectedYear, selectedSemester);
      setModules(modulesData);
    } catch (error) {
      console.error('Error loading modules:', error);
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseStructure = async (courseId) => {
    try {
      const structure = await apiService.getCourseStructure(courseId);
      setCourseStructure(structure);
    } catch (error) {
      console.error('Error loading course structure:', error);
    }
  };

  const handleAddYear = () => {
    const currentYears = [...newCourseData.years];
    const nextYearNumber = currentYears.length + 1;
    if (nextYearNumber <= 4) {
      setNewCourseData({
        ...newCourseData,
        years: [...currentYears, `Year ${nextYearNumber}`],
      });
    }
  };

  const handleRemoveYear = (yearToRemove) => {
    if (newCourseData.years.length > 1) {
      setNewCourseData({
        ...newCourseData,
        years: newCourseData.years.filter(year => year !== yearToRemove),
      });
    }
  };

  const handleAddModule = () => {
    setModalMode("add");
    setFormData({
      _id: "",
      id: `${selectedCourse?.substring(0,2).toLowerCase()}${Math.floor(Math.random() * 900) + 100}`,
      name: "",
      credits: "",
      description: "",
      instructor: "",
      schedule: "",
      materials: [],
    });
    setErrors({});
    setMaterialErrors({});
    setIsModalOpen(true);
  };

  const handleEditModule = async (module) => {
    setModalMode("edit");
    setFormData({
      _id: module._id,
      id: module.id,
      name: module.name,
      credits: module.credits,
      description: module.description,
      instructor: module.instructor,
      schedule: module.schedule,
      materials: module.materials || [],
    });
    setErrors({});
    setMaterialErrors({});
    setIsModalOpen(true);
  };

  const handleSaveModule = async () => {
    const validationErrors = validateModuleForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const moduleData = {
        id: formData.id,
        name: formData.name,
        credits: parseInt(formData.credits),
        description: formData.description,
        instructor: formData.instructor,
        schedule: formData.schedule,
        courseId: selectedCourseId,
        year: selectedYear,
        semester: selectedSemester,
        materials: formData.materials
      };

      if (modalMode === "add") {
        await apiService.createModule(moduleData);
        setSuccessMessage(`Module "${formData.name}" added successfully!`);
      } else {
        await apiService.updateModule(formData._id, moduleData);
        setSuccessMessage(`Module "${formData.name}" updated successfully!`);
      }

      await loadModules();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving module:', error);
      setSuccessMessage("Error saving module: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = (module) => {
    setItemToDelete({ type: "module", data: module });
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      if (itemToDelete.type === "module") {
        await apiService.deleteModule(itemToDelete.data._id);
        await loadModules();
        setSuccessMessage(`Module "${itemToDelete.data.name}" deleted successfully!`);
      } else if (itemToDelete.type === "course") {
        await apiService.deleteCourse(itemToDelete.data._id);
        await loadCourses();
        setSuccessMessage(`Course "${itemToDelete.data.name}" deleted successfully!`);
        if (coursesList.length > 1) {
          const remainingCourse = coursesList.find(c => c._id !== itemToDelete.data._id);
          if (remainingCourse) {
            setSelectedCourseId(remainingCourse._id);
            setSelectedCourse(remainingCourse.name);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting:', error);
      setSuccessMessage("Error deleting: " + error.message);
    } finally {
      setLoading(false);
      setIsDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleAddMaterial = async () => {
    const materialValidationErrors = validateMaterial(newMaterial);
    if (Object.keys(materialValidationErrors).length > 0) {
      setMaterialErrors(materialValidationErrors);
      return;
    }
    
    const material = {
      type: newMaterial.type,
      title: newMaterial.title,
      url: newMaterial.url || "#",
    };

    if (newMaterial.type === "video") {
      material.duration = newMaterial.duration;
    } else if (newMaterial.type === "pdf") {
      material.pages = parseInt(newMaterial.pages);
    } else if (newMaterial.type === "code") {
      material.exercises = parseInt(newMaterial.exercises);
    }

    if (modalMode === "add") {
      // For new module, just add to local state
      if (editingMaterialIndex !== null) {
        const updatedMaterials = [...formData.materials];
        updatedMaterials[editingMaterialIndex] = material;
        setFormData({ ...formData, materials: updatedMaterials });
        setEditingMaterialIndex(null);
      } else {
        setFormData({
          ...formData,
          materials: [...formData.materials, material],
        });
      }
    } else {
      // For existing module, save to backend
      setLoading(true);
      try {
        if (editingMaterialIndex !== null) {
          const materialToUpdate = formData.materials[editingMaterialIndex];
          await apiService.updateMaterial(materialToUpdate._id, material);
          setSuccessMessage("Material updated successfully!");
        } else {
          const newMaterialData = { ...material, moduleId: formData._id };
          await apiService.createMaterial(newMaterialData);
          setSuccessMessage("Material added successfully!");
        }
        // Reload module data
        const updatedModules = await apiService.getModulesByLocation(selectedCourseId, selectedYear, selectedSemester);
        const updatedModule = updatedModules.find(m => m._id === formData._id);
        if (updatedModule) {
          setFormData({ ...formData, materials: updatedModule.materials || [] });
        }
        setEditingMaterialIndex(null);
      } catch (error) {
        console.error('Error saving material:', error);
        setSuccessMessage("Error saving material: " + error.message);
      } finally {
        setLoading(false);
      }
    }

    setNewMaterial({ type: "video", title: "", duration: "", pages: "", exercises: "", url: "#" });
    setShowMaterialForm(false);
    setMaterialErrors({});
  };

  const handleEditMaterial = (index) => {
    const material = formData.materials[index];
    setNewMaterial({
      type: material.type,
      title: material.title,
      duration: material.duration || "",
      pages: material.pages || "",
      exercises: material.exercises || "",
      url: material.url || "#",
    });
    setEditingMaterialIndex(index);
    setMaterialErrors({});
    setShowMaterialForm(true);
  };

  const handleDeleteMaterial = async (index) => {
    const material = formData.materials[index];
    
    if (modalMode === "edit" && material._id) {
      setLoading(true);
      try {
        await apiService.deleteMaterial(material._id);
        const updatedMaterials = formData.materials.filter((_, i) => i !== index);
        setFormData({ ...formData, materials: updatedMaterials });
        setSuccessMessage("Material deleted successfully!");
      } catch (error) {
        console.error('Error deleting material:', error);
        setSuccessMessage("Error deleting material: " + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      const updatedMaterials = formData.materials.filter((_, i) => i !== index);
      setFormData({ ...formData, materials: updatedMaterials });
    }
    
    if (editingMaterialIndex === index) {
      setEditingMaterialIndex(null);
      setShowMaterialForm(false);
      setNewMaterial({ type: "video", title: "", duration: "", pages: "", exercises: "", url: "#" });
      setMaterialErrors({});
    }
  };

  const handleAddCourse = async () => {
  const validationErrors = validateCourseForm(newCourseData, universityData, false);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setLoading(true);
  try {
    // Ensure the data structure matches what backend expects
    const courseToCreate = {
      name: newCourseData.name.trim(),
      color: newCourseData.color,
      lightColor: `${newCourseData.color}20`,
      icon: newCourseData.icon,
      description: newCourseData.description.trim(),
      years: newCourseData.years // This should be an array like ["Year 1", "Year 2"]
    };
    
    console.log('Sending to backend:', courseToCreate); // Debug log
    
    const result = await apiService.createCourse(courseToCreate);
    console.log('Backend response:', result); // Debug log
    
    await loadCourses(); // Reload the courses list
    
    setSuccessMessage(`Course "${newCourseData.name}" created successfully!`);
    setIsAddCourseModalOpen(false);
    setNewCourseData({ 
      name: "", 
      color: "#0056D2", 
      description: "", 
      icon: "Database", 
      years: ["Year 1", "Year 2"] 
    });
    setErrors({});
  } catch (error) {
    console.error('Error creating course:', error);
    setSuccessMessage(`Error creating course: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  const handleDeleteCourse = (course) => {
    setItemToDelete({ type: "course", data: course });
    setIsDeleteConfirmOpen(true);
  };

  const handleEditCourse = (course) => {
    const courseYears = course.years.map(y => y.year);
    setNewCourseData({
      name: course.name,
      color: course.color,
      description: course.description,
      icon: course.icon,
      years: courseYears,
    });
    setModalMode("edit");
    setErrors({});
    setIsAddCourseModalOpen(true);
  };

  const handleUpdateCourse = async () => {
    const validationErrors = validateCourseForm(newCourseData, universityData, true);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await apiService.updateCourse(selectedCourseId, {
        name: newCourseData.name,
        color: newCourseData.color,
        description: newCourseData.description,
        icon: newCourseData.icon,
        years: newCourseData.years
      });
      
      await loadCourses();
      setSuccessMessage(`Course updated successfully!`);
      setIsAddCourseModalOpen(false);
      setNewCourseData({ name: "", color: "#0056D2", description: "", icon: "Database", years: ["Year 1", "Year 2"] });
      setErrors({});
    } catch (error) {
      console.error('Error updating course:', error);
      setSuccessMessage("Error updating course: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentCourse = selectedCourseId ? coursesList.find(c => c._id === selectedCourseId) : null;
  const yearsData = currentCourse?.years || [];
  const currentYearData = yearsData.find(y => y.year === selectedYear);
  const semesters = currentYearData?.semesters || [];
  const currentSemester = semesters.find(s => s.name === selectedSemester);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                <UserCog size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Course Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                Administrator
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
              onClick={() => setActiveTab("modules")}
              className={`py-3 px-1 font-medium transition relative ${
                activeTab === "modules"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <BookMarked size={18} className="inline mr-2" />
              Module Management
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`py-3 px-1 font-medium transition relative ${
                activeTab === "courses"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <School size={18} className="inline mr-2" />
              Course Management
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg ${
            successMessage.includes("Error") ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
          } border`}>
            <CheckCircle size={18} className={successMessage.includes("Error") ? "text-red-500" : "text-green-500"} />
            <span className={successMessage.includes("Error") ? "text-red-700" : "text-green-700"}>{successMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "modules" ? (
          <>
            {/* Course Selection Cards */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Select Program</h2>
                <button
                  onClick={() => setActiveTab("courses")}
                  className="text-sm text-primary hover:underline"
                >
                  Manage Courses →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {coursesList.map((course) => {
                  const isActive = selectedCourseId === course._id;
                  return (
                    <button
                      key={course._id}
                      onClick={() => {
                        setSelectedCourseId(course._id);
                        setSelectedCourse(course.name);
                        setSelectedYear(course.years[0]?.year || "Year 1");
                        setSelectedSemester("Semester 1");
                      }}
                      className={`group text-left p-4 rounded-xl transition-all ${
                        isActive
                          ? "bg-white shadow-lg border-2 border-primary ring-2 ring-primary/20"
                          : "bg-white border border-gray-200 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${course.color}15` }}
                        >
                          {(() => {
                            const IconComp = getIconComponent(course.icon);
                            return <IconComp size={20} style={{ color: course.color }} />;
                          })()}
                        </div>
                        <h3 className={`font-semibold ${isActive ? "text-primary" : "text-gray-900"}`}>
                          {course.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{course.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Year & Semester Navigation */}
            {currentCourse && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Panel */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
                    <div
                      className="p-5"
                      style={{ backgroundColor: `${currentCourse.color}10`, borderBottom: `2px solid ${currentCourse.color}` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const IconComp = getIconComponent(currentCourse.icon);
                            return <IconComp size={24} style={{ color: currentCourse.color }} />;
                          })()}
                          <div>
                            <h2 className="font-bold text-gray-900">{currentCourse.name}</h2>
                            <p className="text-xs text-gray-500">Manage modules</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteCourse(currentCourse)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition rounded-lg"
                          title="Delete Course"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-6">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                          Academic Year
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {yearsData.map((year) => (
                            <button
                              key={year.year}
                              onClick={() => {
                                setSelectedYear(year.year);
                                setSelectedSemester("Semester 1");
                              }}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
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

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Semesters
                          </label>
                        </div>
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
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedSemester} Modules
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {currentCourse.name} • {selectedYear}
                      </p>
                    </div>
                    <button
                      onClick={handleAddModule}
                      className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition shadow-sm"
                    >
                      <Plus size={18} />
                      Add Module
                    </button>
                  </div>

                  {modules.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                      <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 mb-4">No modules in this semester</p>
                      <button
                        onClick={handleAddModule}
                        className="text-primary hover:underline flex items-center gap-1 mx-auto"
                      >
                        <Plus size={16} /> Add your first module
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {modules.map((module, idx) => (
                        <div
                          key={module._id}
                          className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <h3 className="font-semibold text-gray-900">{module.name}</h3>
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                  {module.credits} credits
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Users size={12} /> {module.instructor}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={12} /> {module.schedule}
                                </span>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {(module.materials || []).slice(0, 3).map((material, i) => (
                                  <span
                                    key={i}
                                    className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1"
                                  >
                                    {material.type === "video" && <Video size={10} />}
                                    {material.type === "pdf" && <FileText size={10} />}
                                    {material.type === "code" && <FileCode size={10} />}
                                    {material.title?.length > 20 ? material.title.substring(0, 20) + "..." : material.title}
                                  </span>
                                ))}
                                {(module.materials || []).length > 3 && (
                                  <span className="text-xs text-gray-400">+{(module.materials || []).length - 3} more</span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleEditModule(module)}
                                className="p-2 text-gray-400 hover:text-primary transition rounded-lg"
                                title="Edit Module"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteModule(module)}
                                className="p-2 text-gray-400 hover:text-red-500 transition rounded-lg"
                                title="Delete Module"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          // Course Management Tab
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Course Management</h2>
                <p className="text-gray-600 text-sm">Create, edit, or remove courses (up to Year 4)</p>
              </div>
              <button
                onClick={() => {
                  setModalMode("add");
                  setNewCourseData({ name: "", color: "#0056D2", description: "", icon: "Database", years: ["Year 1", "Year 2"] });
                  setErrors({});
                  setIsAddCourseModalOpen(true);
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition"
              >
                <Plus size={18} />
                Add New Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesList.map((course) => {
                const IconComp = getIconComponent(course.icon);
                const totalModules = course.years.reduce(
                  (acc, year) =>
                    acc +
                    year.semesters.reduce(
                      (semAcc, sem) => semAcc + (sem.modules?.length || 0),
                      0
                    ),
                  0
                );
                return (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div
                      className="h-2"
                      style={{ backgroundColor: course.color }}
                    ></div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${course.color}15` }}
                          >
                            <IconComp size={24} style={{ color: course.color }} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{course.name}</h3>
                            <p className="text-xs text-gray-500">{totalModules} total modules</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="p-1.5 text-gray-400 hover:text-primary transition rounded"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {course.years.length} Years
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {course.years.reduce((acc, year) => acc + year.semesters.length, 0)} Semesters
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Module Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === "add" ? "Add New Module" : "Edit Module"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Module Basic Info - same as before */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Advanced Machine Learning"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credits <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.credits ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="1-10"
                    min="1"
                    max="10"
                  />
                  {errors.credits && <p className="text-red-500 text-xs mt-1">{errors.credits}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    rows="2"
                    placeholder="Module description and learning outcomes"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.instructor ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Dr. John Smith"
                  />
                  {errors.instructor && <p className="text-red-500 text-xs mt-1">{errors.instructor}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.schedule ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Mon/Wed 10:30 AM"
                  />
                  {errors.schedule && <p className="text-red-500 text-xs mt-1">{errors.schedule}</p>}
                </div>
              </div>

              {/* Materials Section - same as before but with API integration */}
              <div className="border-t pt-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Lecture Materials</h3>
                    <p className="text-xs text-gray-500">Add videos, PDFs, code files, and more</p>
                  </div>
                  {!showMaterialForm && (
                    <button
                      onClick={() => {
                        setShowMaterialForm(true);
                        setMaterialErrors({});
                      }}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Material
                    </button>
                  )}
                </div>

                {showMaterialForm && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Material Type</label>
                        <select
                          value={newMaterial.type}
                          onChange={(e) => {
                            setNewMaterial({ ...newMaterial, type: e.target.value });
                            setMaterialErrors({});
                          }}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="video">Video Lecture</option>
                          <option value="pdf">PDF Document</option>
                          <option value="code">Code File / Exercise</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newMaterial.title}
                          onChange={(e) => {
                            setNewMaterial({ ...newMaterial, title: e.target.value });
                            if (materialErrors.title) setMaterialErrors({ ...materialErrors, title: null });
                          }}
                          className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            materialErrors.title ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Material title"
                        />
                        {materialErrors.title && <p className="text-red-500 text-xs mt-1">{materialErrors.title}</p>}
                      </div>
                      {newMaterial.type === "video" && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Duration <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newMaterial.duration}
                            onChange={(e) => {
                              setNewMaterial({ ...newMaterial, duration: e.target.value });
                              if (materialErrors.duration) setMaterialErrors({ ...materialErrors, duration: null });
                            }}
                            className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                              materialErrors.duration ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="e.g., 45 mins"
                          />
                          {materialErrors.duration && <p className="text-red-500 text-xs mt-1">{materialErrors.duration}</p>}
                        </div>
                      )}
                      {newMaterial.type === "pdf" && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Pages <span className="text-red-500">* (1-1000)</span>
                          </label>
                          <input
                            type="number"
                            value={newMaterial.pages}
                            onChange={(e) => {
                              setNewMaterial({ ...newMaterial, pages: e.target.value });
                              if (materialErrors.pages) setMaterialErrors({ ...materialErrors, pages: null });
                            }}
                            className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                              materialErrors.pages ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="1-1000"
                            min="1"
                            max="1000"
                          />
                          {materialErrors.pages && <p className="text-red-500 text-xs mt-1">{materialErrors.pages}</p>}
                        </div>
                      )}
                      {newMaterial.type === "code" && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Exercises <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={newMaterial.exercises}
                            onChange={(e) => {
                              setNewMaterial({ ...newMaterial, exercises: e.target.value });
                              if (materialErrors.exercises) setMaterialErrors({ ...materialErrors, exercises: null });
                            }}
                            className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                              materialErrors.exercises ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="1-100"
                            min="1"
                            max="100"
                          />
                          {materialErrors.exercises && <p className="text-red-500 text-xs mt-1">{materialErrors.exercises}</p>}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setShowMaterialForm(false);
                          setEditingMaterialIndex(null);
                          setNewMaterial({ type: "video", title: "", duration: "", pages: "", exercises: "", url: "#" });
                          setMaterialErrors({});
                        }}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddMaterial}
                        className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                      >
                        {editingMaterialIndex !== null ? "Update" : "Add"} Material
                      </button>
                    </div>
                  </div>
                )}

                {/* Materials List */}
                {formData.materials.length > 0 && (
                  <div className="space-y-2">
                    {formData.materials.map((material, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition"
                      >
                        <div className="flex items-center gap-3">
                          {material.type === "video" && <Video size={18} className="text-blue-500" />}
                          {material.type === "pdf" && <FileText size={18} className="text-red-500" />}
                          {material.type === "code" && <FileCode size={18} className="text-green-500" />}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{material.title}</p>
                            <p className="text-xs text-gray-500">
                              {material.duration && `${material.duration}`}
                              {material.pages && `${material.pages} pages`}
                              {material.exercises && `${material.exercises} exercises`}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditMaterial(idx)}
                            className="p-1 text-gray-400 hover:text-primary transition"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteMaterial(idx)}
                            className="p-1 text-gray-400 hover:text-red-500 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-5 flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModule}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
              >
                <Save size={18} />
                {modalMode === "add" ? "Create Module" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Course Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === "add" ? "Add New Course" : "Edit Course"}
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCourseData.name}
                  onChange={(e) => setNewCourseData({ ...newCourseData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Artificial Intelligence"
                  disabled={modalMode === "edit"}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Color</label>
                <input
                  type="color"
                  value={newCourseData.color}
                  onChange={(e) => setNewCourseData({ ...newCourseData, color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={newCourseData.icon}
                  onChange={(e) => setNewCourseData({ ...newCourseData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Database">Database (Data Science)</option>
                  <option value="Code">Code (Computer Science)</option>
                  <option value="Network">Network (Networking)</option>
                  <option value="Layers">Layers (Software Engineering)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newCourseData.description}
                  onChange={(e) => setNewCourseData({ ...newCourseData, description: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  rows="3"
                  placeholder="Course description"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              
              {/* Dynamic Years Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Years <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">Select which years this course will have (up to Year 4)</p>
                
                <div className="space-y-2">
                  {newCourseData.years.map((year) => (
                    <div key={year} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-sm font-medium text-gray-700">{year}</span>
                      {newCourseData.years.length > 1 && (
                        <button
                          onClick={() => handleRemoveYear(year)}
                          className="p-1 text-gray-400 hover:text-red-500 transition rounded"
                          title="Remove year"
                        >
                          <MinusCircle size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {newCourseData.years.length < 4 && (
                  <button
                    onClick={handleAddYear}
                    className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-primary hover:text-primary transition flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={16} />
                    Add Year {newCourseData.years.length + 1}
                  </button>
                )}
                
                {errors.years && <p className="text-red-500 text-xs mt-1">{errors.years}</p>}
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> Each year will have Semester 1 and Semester 2 by default. You can add modules to each semester later.
                </p>
              </div>
            </div>
            <div className="p-5 border-t flex gap-3 justify-end sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setIsAddCourseModalOpen(false);
                  setErrors({});
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={modalMode === "add" ? handleAddCourse : handleUpdateCourse}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                {modalMode === "add" ? "Create Course" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-5 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {itemToDelete?.type === "module" ? itemToDelete?.data?.name : itemToDelete?.data?.name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;