import express from "express";
import {
  createRoom,
  getActiveRooms,
  joinRoom,
  endRoom,
  getRoomById,
  getMyRooms
} from "../controller/virRoomController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createRoom);
router.get("/active", getActiveRooms);
router.post("/join", joinRoom);
router.put("/end/:roomId", verifyToken, endRoom);
router.get("/mine", verifyToken, getMyRooms);
router.get("/:roomId", verifyToken, getRoomById);   // ← NEW: fetch a specific room by roomId

export default router;