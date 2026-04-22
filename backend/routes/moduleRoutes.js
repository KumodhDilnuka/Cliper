import express from 'express';
import * as moduleController from '../controller/moduleController.js';

const router = express.Router();

// Get all modules
router.get('/', moduleController.getAllModules);

// Get module by ID
router.get('/:id', moduleController.getModuleById);

// Get modules by location
router.get('/location/:courseId/:year/:semester', moduleController.getModulesByLocation);

// Create new module
router.post('/', moduleController.createModule);

// Update module
router.put('/:id', moduleController.updateModule);

// Delete module
router.delete('/:id', moduleController.deleteModule);

export default router;