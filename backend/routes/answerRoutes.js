import express from "express";
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import { checkIsEducational } from "../utils/moderation.js";

const router = express.Router();

// GET /api/questions/:questionId/answers - List answers for a question
router.get("/questions/:questionId/answers", async (req, res) => {
  try {
    const answers = await Answer.find({
      questionId: req.params.questionId,
      status: { $ne: "rejected" }
    }).sort({ upvotes: -1, createdAt: -1 });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/questions/:questionId/answers - Create an answer
router.post("/questions/:questionId/answers", async (req, res) => {
  try {
    const { body, authorName, isAnonymous } = req.body;

    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = new Answer({
      questionId: req.params.questionId,
      body,
      authorName: isAnonymous || !authorName ? "Anonymous" : authorName,
      isAnonymous: isAnonymous !== undefined ? isAnonymous : true,
    });

    const saved = await answer.save();

    // Increment answer count on the question
    await Question.findByIdAndUpdate(req.params.questionId, {
      $inc: { answerCount: 1 },
    });

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Validation error", error: error.message });
  }
});

// PUT /api/answers/:id - Update an answer
router.put("/answers/:id", async (req, res) => {
  try {
    const { body, authorName, isAnonymous } = req.body;
    const answer = await Answer.findByIdAndUpdate(
      req.params.id,
      { body, authorName, isAnonymous },
      { new: true, runValidators: true }
    );
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.json(answer);
  } catch (error) {
    res.status(400).json({ message: "Update error", error: error.message });
  }
});

// DELETE /api/answers/:id - Delete an answer
router.delete("/answers/:id", async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    // Decrement answer count on the question
    await Question.findByIdAndUpdate(answer.questionId, {
      $inc: { answerCount: -1 },
    });
    res.json({ message: "Answer deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/answers/:id/upvote - Upvote an answer
router.put("/answers/:id/upvote", async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/answers/:id/downvote - Downvote an answer
router.put("/answers/:id/downvote", async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: -1 } },
      { new: true }
    );
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
