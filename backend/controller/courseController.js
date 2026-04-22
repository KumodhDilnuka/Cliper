import Course from '../models/Course.js';
import Module from '../models/Module.js';

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate({
      path: 'years.semesters.modules',
      model: 'Module'
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'years.semesters.modules',
      model: 'Module',
      populate: {
        path: 'materials',
        model: 'Material'
      }
    });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new course - FIXED VERSION
export const createCourse = async (req, res) => {
  try {
    const { name, color, lightColor, icon, description, years } = req.body;
    
    console.log('Received course data:', req.body); // Debug log
    
    // Check if course already exists
    const existingCourse = await Course.findOne({ name });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course already exists' });
    }
    
    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }
    
    // Create semesters for each year
    const yearsWithSemesters = years.map(year => ({
      year: year,
      semesters: [
        { name: 'Semester 1', modules: [] },
        { name: 'Semester 2', modules: [] }
      ]
    }));
    
    const course = new Course({
      name,
      color: color || '#0056D2',
      lightColor: lightColor || `${color || '#0056D2'}20`,
      icon: icon || 'Database',
      description,
      years: yearsWithSemesters
    });
    
    const savedCourse = await course.save();
    console.log('Course saved successfully:', savedCourse); // Debug log
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ message: error.message, details: error.errors });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const { name, color, lightColor, icon, description, years } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Preserve existing modules for years that remain
    const existingYearsMap = new Map();
    course.years.forEach(year => {
      existingYearsMap.set(year.year, year);
    });
    
    const updatedYears = years.map(year => {
      if (existingYearsMap.has(year)) {
        return existingYearsMap.get(year);
      } else {
        return {
          year: year,
          semesters: [
            { name: 'Semester 1', modules: [] },
            { name: 'Semester 2', modules: [] }
          ]
        };
      }
    });
    
    course.name = name || course.name;
    course.color = color || course.color;
    course.lightColor = lightColor || `${color}20`;
    course.icon = icon || course.icon;
    course.description = description || course.description;
    course.years = updatedYears;
    course.updatedAt = Date.now();
    
    const updatedCourse = await course.save();
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Delete all modules associated with this course
    await Module.deleteMany({ course: course._id });
    
    await course.deleteOne();
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course structure (years and semesters)
export const getCourseStructure = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'years.semesters.modules',
      model: 'Module',
      populate: {
        path: 'materials',
        model: 'Material'
      }
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const structure = {
      name: course.name,
      color: course.color,
      icon: course.icon,
      description: course.description,
      years: course.years.map(year => ({
        year: year.year,
        semesters: year.semesters.map(semester => ({
          name: semester.name,
          modules: semester.modules
        }))
      }))
    };
    
    res.status(200).json(structure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};