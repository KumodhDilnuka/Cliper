import mongoose from "mongoose";

const lectureMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      trim: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    senderType: {
      type: String,
      enum: ["student", "lecturer", "admin"],
      default: "student"
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

// TTL index on expiresAt
lectureMessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Query index for fetching messages by room
lectureMessageSchema.index({ roomId: 1, createdAt: 1 });

export default mongoose.model("LectureMessage", lectureMessageSchema);
