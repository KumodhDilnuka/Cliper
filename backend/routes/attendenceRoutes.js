import express from "express";
import { checkInAttendance, endAttendanceSession, getAttendanceStats, getSessionByToken, startAttendanceSession } from "../controller/attendenceController.js";
import router from "./userRoutes.js";


router.post("/sessions/start", verifyToken, startAttendanceSession);
router.get("/sessions/:token", getSessionByToken);
router.post("/check-in", checkInAttendance);
router.post("/sessions/end/:sessionId", verifyToken, endAttendanceSession);
router.get("/sessions/:sessionId/stats", verifyToken, getAttendanceStats);

export default router;