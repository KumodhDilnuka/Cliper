import Material from '../models/Material.js';
import Module from '../models/Module.js';

// Get all materials
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().populate('module');
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get materials by module
export const getMaterialsByModule = async (req, res) => {
  try {
    const materials = await Material.find({ module: req.params.moduleId });
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single material by ID
export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate('module');
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new material
export const createMaterial = async (req, res) => {
  try {
    const { type, title, url, duration, pages, exercises, moduleId } = req.body;
    
    // Validate module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    const material = new Material({
      type,
      title,
      url,
      duration,
      pages,
      exercises,
      module: moduleId
    });
    
    const savedMaterial = await material.save();
    
    // Add material to module
    module.materials.push(savedMaterial._id);
    await module.save();
    
    res.status(201).json(savedMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update material
export const updateMaterial = async (req, res) => {
  try {
    const { type, title, url, duration, pages, exercises } = req.body;
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    material.type = type || material.type;
    material.title = title || material.title;
    material.url = url || material.url;
    material.duration = duration || material.duration;
    material.pages = pages || material.pages;
    material.exercises = exercises || material.exercises;
    
    const updatedMaterial = await material.save();
    res.status(200).json(updatedMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete material
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Remove material from module
    const module = await Module.findById(material.module);
    const materialIndex = module.materials.indexOf(material._id);
    if (materialIndex !== -1) {
      module.materials.splice(materialIndex, 1);
      await module.save();
    }
    
    await material.deleteOne();
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};