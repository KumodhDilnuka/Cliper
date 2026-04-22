import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/userRoutes.js";
import virRoomRouter from "./routes/virRoomRoutes.js";
import lectureMessageRouter from "./routes/lectureMessageRoutes.js";
import questionRouter from "./routes/questionRoutes.js";
import answerRouter from "./routes/answerRoutes.js";
import adminQARouter from "./routes/adminRoutes.js";
import roomResourceRouter from "./routes/roomResourceRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import moduleRouter from "./routes/moduleRoutes.js";
import materialRouter from "./routes/materialRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files as static assets
// e.g. GET /uploads/resources/1234567890-abc.pdf
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/users", userRouter);
app.use("/api/rooms", virRoomRouter);
app.use("/api/messages", lectureMessageRouter);
app.use("/api/questions", questionRouter);
app.use("/api", answerRouter);
app.use("/api/admin", adminQARouter);
app.use("/api/resources", roomResourceRouter);
app.use("/api/courses", courseRouter);
app.use("/api/modules", moduleRouter);
app.use("/api/materials", materialRouter);

app.get("/", (req, res) => {
  res.send("Cliper Backend is Running & DB Connected! 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`📒 Server running on port ${PORT}`);
});