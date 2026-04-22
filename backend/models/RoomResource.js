import mongoose from "mongoose";

const roomResourceSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,   // "pdf" | "image" | "link" | "doc" | "other"
      default: "other",
    },
    filePath: {
      type: String,   // relative path on disk  (null for links)
      default: null,
    },
    fileUrl: {
      type: String,   // external URL for "link" type resources
      default: null,
    },
    fileSize: {
      type: Number,   // bytes
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RoomResource", roomResourceSchema);
