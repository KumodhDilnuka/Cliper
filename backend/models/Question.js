import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
      maxlength: 300,
    },
    body: {
      type: String,
      required: [true, "Question body is required"],
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
    answerCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      trim: true,
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
    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
