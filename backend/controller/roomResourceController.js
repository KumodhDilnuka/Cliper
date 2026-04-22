import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import RoomResource from "../models/RoomResource.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* helper – derive a human-friendly type from MIME */
const mimeToType = (mime = "") => {
  if (mime.includes("pdf"))        return "pdf";
  if (mime.includes("image"))      return "image";
  if (mime.includes("word") || mime.includes("document")) return "doc";
  if (mime.includes("presentation") || mime.includes("powerpoint")) return "ppt";
  if (mime.includes("spreadsheet") || mime.includes("excel")) return "sheet";
  return "other";
};

/* =========================
   UPLOAD FILE RESOURCE
========================= */
export const uploadResource = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const { roomId } = req.params;

    const resource = new RoomResource({
      roomId,
      fileName:     req.file.filename,
      originalName: req.file.originalname,
      fileType:     mimeToType(req.file.mimetype),
      filePath:     req.file.path,
      fileSize:     req.file.size,
      uploadedBy:   req.user._id,
    });

    await resource.save();

    res.status(201).json({ success: true, resource });
  } catch (error) {
    console.error("Upload resource error:", error);
    res.status(500).json({ success: false, message: "Failed to upload resource" });
  }
};

/* =========================
   ADD LINK RESOURCE
========================= */
export const addLink = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { originalName, fileUrl } = req.body;

    if (!originalName || !fileUrl) {
      return res.status(400).json({ success: false, message: "Name and URL are required" });
    }

    const resource = new RoomResource({
      roomId,
      fileName:     "link",
      originalName,
      fileType:     "link",
      fileUrl,
      uploadedBy:   req.user._id,
    });

    await resource.save();

    res.status(201).json({ success: true, resource });
  } catch (error) {
    console.error("Add link error:", error);
    res.status(500).json({ success: false, message: "Failed to add link" });
  }
};

/* =========================
   GET RESOURCES FOR A ROOM
========================= */
export const getResources = async (req, res) => {
  try {
    const { roomId } = req.params;
    const resources = await RoomResource.find({ roomId })
      .populate("uploadedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, resources });
  } catch (error) {
    console.error("Get resources error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch resources" });
  }
};

/* =========================
   DELETE RESOURCE
========================= */
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await RoomResource.findById(id);

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    // Remove physical file if it exists
    if (resource.filePath && fs.existsSync(resource.filePath)) {
      fs.unlinkSync(resource.filePath);
    }

    await resource.deleteOne();

    res.status(200).json({ success: true, message: "Resource deleted" });
  } catch (error) {
    console.error("Delete resource error:", error);
    res.status(500).json({ success: false, message: "Failed to delete resource" });
  }
};
