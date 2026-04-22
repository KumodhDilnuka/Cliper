import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "Question ID is required"],
    },
    body: {
      type: String,
      required: [true, "Answer body is required"],
      trim: true,
    },
    authorName: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    moderationReason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;
