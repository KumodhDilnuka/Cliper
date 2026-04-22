import VirRoom from "../models/virRoom.js";
import { v4 as uuidv4 } from "uuid";


/* =========================
   CREATE ROOM
========================= */
export const createRoom = async (req, res) => {
  try {
    const {
      courseName,
      hall,
      sessionPin,
      answeringMode,
      description,
      scheduledFor,
      durationMinutes
    } = req.body;

    const now = new Date();
    const parsedSchedule = scheduledFor ? new Date(scheduledFor) : null;
    const parsedDuration = Number(durationMinutes) || 60;

    if (parsedSchedule && Number.isNaN(parsedSchedule.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheduled date and time"
      });
    }

    const isScheduled = parsedSchedule && parsedSchedule > now;
    const roomStart = isScheduled ? parsedSchedule : now;
    const roomExpiry = new Date(roomStart.getTime() + parsedDuration * 60 * 1000);

    // generate sequential room id like ROOM-001
    const lastRoom = await VirRoom.findOne().sort({ createdAt: -1 });

    const lastIdNumber = lastRoom
      ? parseInt(lastRoom.roomId.split("-")[1])
      : 0;

    const newIdNumber = (lastIdNumber + 1)
      .toString()
      .padStart(3, "0");

    const roomId = `ROOM-${newIdNumber}`;

    const room = new VirRoom({
      roomId,
      courseName,
      hall,
      sessionPin,
      answeringMode,
      description: description || "",
      scheduledFor: parsedSchedule || null,
      durationMinutes: parsedDuration,
      status: isScheduled ? "scheduled" : "active",
      isActive: !isScheduled,
      expiresAt: roomExpiry,
      createdBy: req.user._id   // from auth middleware
    });

    await room.save();

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room
    });

  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create room"
    });
  }
};



/* =========================
   GET ACTIVE ROOMS
========================= */
export const getActiveRooms = async (req, res) => {
  try {
    await VirRoom.updateMany(
      {
        status: "scheduled",
        scheduledFor: { $lte: new Date() }
      },
      {
        $set: {
          status: "active",
          isActive: true
        }
      }
    );

    const rooms = await VirRoom.find({
      status: "active",
      isActive: true
    })
    .populate("createdBy", "firstName lastName")
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms
    });

  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rooms"
    });
  }
};



/* =========================
   JOIN ROOM (PIN CHECK)
========================= */
export const joinRoom = async (req, res) => {
  try {
    const { roomId, sessionPin } = req.body;

    const room = await VirRoom.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    if (room.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Room has ended"
      });
    }

    if (room.sessionPin !== sessionPin) {
      return res.status(401).json({
        success: false,
        message: "Invalid session pin"
      });
    }

    res.status(200).json({
      success: true,
      message: "Joined successfully",
      room
    });

  } catch (error) {
    console.error("Join room error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to join room"
    });
  }
};



/* =========================
   END ROOM (LECTURER)
========================= */
export const endRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await VirRoom.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    room.status = "ended";
    room.isActive = false;

    await room.save();

    res.status(200).json({
      success: true,
      message: "Room ended successfully"
    });

  } catch (error) {
    console.error("End room error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to end room"
    });
  }
};



/* =========================
   GET SINGLE ROOM BY ROOM ID
========================= */
export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await VirRoom.findOne({ roomId })
      .populate("createdBy", "firstName lastName");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    res.status(200).json({
      success: true,
      room
    });

  } catch (error) {
    console.error("Get room by id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch room"
    });
  }
};



/* =========================
   GET ROOMS BY LECTURER
========================= */
export const getMyRooms = async (req, res) => {
  try {
    await VirRoom.updateMany(
      {
        createdBy: req.user._id,
        status: "scheduled",
        scheduledFor: { $lte: new Date() }
      },
      {
        $set: {
          status: "active",
          isActive: true
        }
      }
    );

    const rooms = await VirRoom.find({
      createdBy: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      rooms
    });

  } catch (error) {
    console.error("Get lecturer rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rooms"
    });
  }
};
