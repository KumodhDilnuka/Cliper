import Module from '../models/Module.js';
import Course from '../models/Course.js';
import Material from '../models/Material.js';

// Get all modules
export const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find().populate('materials');
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get module by ID
export const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate('materials');
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get modules by course, year, semester
export const getModulesByLocation = async (req, res) => {
  try {
    const { courseId, year, semester } = req.params;
    const modules = await Module.find({ 
      course: courseId, 
      year: year, 
      semester: semester 
    }).populate('materials');
    
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new module
export const createModule = async (req, res) => {
  try {
    const { id, name, credits, description, instructor, schedule, courseId, year, semester, materials } = req.body;
    
    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if module ID already exists
    const existingModule = await Module.findOne({ id });
    if (existingModule) {
      return res.status(400).json({ message: 'Module ID already exists' });
    }
    
    const module = new Module({
      id,
      name,
      credits,
      description,
      instructor,
      schedule,
      course: courseId,
      year,
      semester
    });
    
    const savedModule = await module.save();
    
    // Add module to course structure
    const yearIndex = course.years.findIndex(y => y.year === year);
    if (yearIndex !== -1) {
      const semesterIndex = course.years[yearIndex].semesters.findIndex(s => s.name === semester);
      if (semesterIndex !== -1) {
        course.years[yearIndex].semesters[semesterIndex].modules.push(savedModule._id);
        await course.save();
      }
    }
    
    res.status(201).json(savedModule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update module
export const updateModule = async (req, res) => {
  try {
    const { name, credits, description, instructor, schedule, year, semester } = req.body;
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // If year or semester changed, update course structure
    if (year && year !== module.year || semester && semester !== module.semester) {
      // Remove from old location
      const oldCourse = await Course.findById(module.course);
      const oldYearIndex = oldCourse.years.findIndex(y => y.year === module.year);
      if (oldYearIndex !== -1) {
        const oldSemesterIndex = oldCourse.years[oldYearIndex].semesters.findIndex(s => s.name === module.semester);
        if (oldSemesterIndex !== -1) {
          const moduleIndex = oldCourse.years[oldYearIndex].semesters[oldSemesterIndex].modules.indexOf(module._id);
          if (moduleIndex !== -1) {
            oldCourse.years[oldYearIndex].semesters[oldSemesterIndex].modules.splice(moduleIndex, 1);
            await oldCourse.save();
          }
        }
      }
      
      // Add to new location
      const newCourse = await Course.findById(module.course);
      const newYearIndex = newCourse.years.findIndex(y => y.year === year);
      if (newYearIndex !== -1) {
        const newSemesterIndex = newCourse.years[newYearIndex].semesters.findIndex(s => s.name === semester);
        if (newSemesterIndex !== -1) {
          newCourse.years[newYearIndex].semesters[newSemesterIndex].modules.push(module._id);
          await newCourse.save();
        }
      }
    }
    
    module.name = name || module.name;
    module.credits = credits || module.credits;
    module.description = description || module.description;
    module.instructor = instructor || module.instructor;
    module.schedule = schedule || module.schedule;
    module.year = year || module.year;
    module.semester = semester || module.semester;
    module.updatedAt = Date.now();
    
    const updatedModule = await module.save();
    res.status(200).json(updatedModule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete module
export const deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Remove module from course structure
    const course = await Course.findById(module.course);
    const yearIndex = course.years.findIndex(y => y.year === module.year);
    if (yearIndex !== -1) {
      const semesterIndex = course.years[yearIndex].semesters.findIndex(s => s.name === module.semester);
      if (semesterIndex !== -1) {
        const moduleIndex = course.years[yearIndex].semesters[semesterIndex].modules.indexOf(module._id);
        if (moduleIndex !== -1) {
          course.years[yearIndex].semesters[semesterIndex].modules.splice(moduleIndex, 1);
          await course.save();
        }
      }
    }
    
    // Delete all materials associated with this module
    await Material.deleteMany({ module: module._id });
    
    await module.deleteOne();
    res.status(200).json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};