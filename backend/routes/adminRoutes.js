import express from "express";
import jwt from "jsonwebtoken";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

const router = express.Router();

// Admin credentials (in a real app, use a database)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// POST /api/admin/login - Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email, role: "admin" },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      admin: {
        email,
        role: "admin",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/admin/stats - Get dashboard statistics
router.get("/stats", verifyAdmin, async (req, res) => {
  try {
    const [totalQuestions, totalAnswers, flaggedContent] = await Promise.all([
      Question.countDocuments(),
      Answer.countDocuments(),
      Question.countDocuments({ isFlagged: true }),
    ]);

    res.json({
      totalQuestions,
      totalAnswers,
      flaggedContent,
      activeUsers: Math.floor(Math.random() * 100) + 50, // Placeholder
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/admin/questions - Get all questions for admin
router.get("/questions", verifyAdmin, async (req, res) => {
  try {
    const questions = await Question.find({}).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/admin/questions/:id/approve - Approve a question
router.put("/questions/:id/approve", verifyAdmin, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/admin/questions/:id/reject - Reject a question
router.put("/questions/:id/reject", verifyAdmin, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/admin/questions/:id - Delete a question
router.delete("/questions/:id", verifyAdmin, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/admin/questions/:id/answers - Get answers for a question (admin)
router.get("/questions/:id/answers", verifyAdmin, async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.id }).sort({ upvotes: -1, createdAt: -1 });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/admin/answers/:id - Delete an answer (admin)
router.delete("/answers/:id", verifyAdmin, async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Decrement answer count on the question
    await Question.findByIdAndUpdate(answer.questionId, { $inc: { answerCount: -1 } });

    res.json({ message: "Answer deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
