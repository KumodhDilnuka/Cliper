import express from "express";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import { checkIsEducational } from "../utils/moderation.js";

const router = express.Router();

// GET /api/questions - List all questions (newest first, optional search)
router.get("/", async (req, res) => {
  try {
    const { search, sort } = req.query;
    let filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter = {
        $and: [
          { status: { $ne: "rejected" } },
          { $or: [{ title: regex }, { body: regex }, { tags: regex }] }
        ]
      };
    } else {
      filter = { status: { $ne: "rejected" } };
    }

    let sortOption = { createdAt: -1 }; // default newest first
    if (sort === "popular") {
      sortOption = { upvotes: -1, createdAt: -1 };
      // Exclude unrated questions (zero upvotes) from popular listing
      filter = { ...filter, upvotes: { $gt: 0 } };
    }

    const questions = await Question.find(filter).sort(sortOption);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/questions/:id - Get a single question
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/questions - Create a new question
router.post("/", async (req, res) => {
  try {
    const { title, body, authorName, isAnonymous, tags, imageUrl } = req.body;

    // AI Moderation Check
    const moderation = await checkIsEducational(title, body, imageUrl);
    
    // Prepare the question document
    const question = new Question({
      title,
      body,
      authorName: isAnonymous || !authorName ? "Anonymous" : authorName,
      isAnonymous: isAnonymous !== undefined ? isAnonymous : true,
      tags: tags || [],
      imageUrl,
    });

    if (!moderation.isEducational) {
      // Save for auditing
      question.status = "rejected";
      question.moderationReason = moderation.reason;
      await question.save();

      return res.status(403).json({
        message: "Content rejected by AI moderator",
        reason: moderation.reason,
      });
    }

    const saved = await question.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Validation error", error: error.message });
  }
});

// PUT /api/questions/:id - Update a question
router.put("/:id", async (req, res) => {
  try {
    const { title, body, authorName, isAnonymous, tags, imageUrl } = req.body;
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { title, body, authorName, isAnonymous, tags, imageUrl },
      { new: true, runValidators: true }
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: "Update error", error: error.message });
  }
});

// DELETE /api/questions/:id - Delete a question and its answers
router.delete("/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    // Also delete all answers for this question
    await Answer.deleteMany({ questionId: req.params.id });
    res.json({ message: "Question and its answers deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/questions/:id/upvote - Upvote a question
router.put("/:id/upvote", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
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

// PUT /api/questions/:id/downvote - Downvote a question
router.put("/:id/downvote", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: -1 } },
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

export default router;
