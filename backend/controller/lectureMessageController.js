import LectureMessage from "../models/lectureMessage.js";

/* =========================
   SEND MESSAGE
========================= */
export const sendMessage = async (req, res) => {
  try {
    const { roomId, message } = req.body;

    if (!roomId || !message) {
      return res.status(400).json({
        success: false,
        message: "roomId and message are required"
      });
    }

    // Message expires 24 hours from now (TTL index handles deletion)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newMessage = new LectureMessage({
      roomId,
      senderId: req.user._id,
      senderName: `${req.user.firstName} ${req.user.lastName}`,
      senderType: req.user.type,
      message,
      expiresAt
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage
    });

  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message"
    });
  }
};


/* =========================
   GET ALL MESSAGES FOR A ROOM
========================= */
export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await LectureMessage.find({ roomId })
      .sort({ createdAt: 1 }); // oldest first

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });

  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages"
    });
  }
};


/* =========================
   DELETE A MESSAGE (owner or lecturer)
========================= */
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const msg = await LectureMessage.findById(messageId);

    if (!msg) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    // Only the sender or a lecturer/admin can delete
    const isOwner = msg.senderId.toString() === req.user._id.toString();
    const isPrivileged = req.user.type === "lecturer" || req.user.type === "admin";

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this message"
      });
    }

    await LectureMessage.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully"
    });

  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message"
    });
  }
};


/* =========================
   DELETE ALL MESSAGES IN A ROOM (lecturer/admin only)
========================= */
export const clearRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (req.user.type !== "lecturer" && req.user.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only lecturers or admins can clear a room"
      });
    }

    await LectureMessage.deleteMany({ roomId });

    res.status(200).json({
      success: true,
      message: `All messages in room ${roomId} cleared`
    });

  } catch (error) {
    console.error("Clear messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear messages"
    });
  }
};
