import express from "express";
import { upload } from "../utils/multerConfig.js";
import {
  uploadResource,
  addLink,
  getResources,
  deleteResource,
} from "../controller/roomResourceController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET  /api/resources/:roomId         – list resources for a room (auth required)
router.get("/:roomId", verifyToken, getResources);

// POST /api/resources/:roomId/upload  – upload a file (lecturer only)
router.post("/:roomId/upload", verifyToken, upload.single("file"), uploadResource);

// POST /api/resources/:roomId/link    – add an external link
router.post("/:roomId/link", verifyToken, addLink);

// DELETE /api/resources/:id           – delete a resource
router.delete("/:id", verifyToken, deleteResource);

export default router;
