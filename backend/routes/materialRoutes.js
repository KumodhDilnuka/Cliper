import express from 'express';
import * as materialController from '../controller/materialController.js';

const router = express.Router();

// Get all materials
router.get('/', materialController.getAllMaterials);

// Get materials by module
router.get('/module/:moduleId', materialController.getMaterialsByModule);

// Get material by ID
router.get('/:id', materialController.getMaterialById);

// Create new material
router.post('/', materialController.createMaterial);

// Update material
router.put('/:id', materialController.updateMaterial);

// Delete material
router.delete('/:id', materialController.deleteMaterial);

export default router;