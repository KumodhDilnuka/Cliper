import express from 'express';
import * as courseController from '../controller/courseController.js';

const router = express.Router();

// Get all courses
router.get('/', courseController.getAllCourses);

// Get single course by ID
router.get('/:id', courseController.getCourseById);

// Get course structure (years and semesters)
router.get('/:id/structure', courseController.getCourseStructure);

// Create new course
router.post('/', courseController.createCourse);

// Update course
router.put('/:id', courseController.updateCourse);

// Delete course
router.delete('/:id', courseController.deleteCourse);

export default router;