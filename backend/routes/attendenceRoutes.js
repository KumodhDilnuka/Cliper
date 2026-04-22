import express from "express";
import {
  createAttendanceSession,
  markAttendance,
  getSessionAttendance,
  downloadAttendanceExcel,
  getMySessions,
  endAttendanceSession,
} from "../controller/attendenceController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// 🟢 Create session (Lecturer/Admin)
router.post(
  "/create",
  verifyToken,
  createAttendanceSession
);

// 🔵 Mark attendance (Student)
router.post(
  "/mark",
  verifyToken,
  markAttendance
);

// 🟣 Get all sessions of lecturer
router.get(
  "/my-sessions",
  verifyToken,
  getMySessions
);

// 🟣 View attendance of a session
router.get(
  "/session/:sessionId",
  verifyToken,
  getSessionAttendance
);

// 📥 Download Excel
router.get(
  "/session/:sessionId/excel",
  verifyToken,
  downloadAttendanceExcel
);

// 🛑 End session
router.post(
  "/session/:sessionId/end",
  verifyToken,
  endAttendanceSession
);

export default router;