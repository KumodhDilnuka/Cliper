import express from "express";
import {
  sendMessage,
  getRoomMessages,
  deleteMessage,
  clearRoomMessages
} from "../controller/lectureMessageController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Send a message to a room (any authenticated user)
router.post("/", verifyToken, sendMessage);

// Get all messages for a room
router.get("/:roomId", verifyToken, getRoomMessages);

// Delete a single message by ID
router.delete("/:messageId", verifyToken, deleteMessage);

// Clear all messages in a room (lecturer/admin only)
router.delete("/clear/:roomId", verifyToken, clearRoomMessages);

export default router;
