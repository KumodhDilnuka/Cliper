import express from "express";
import { createUser, deleteUser, getUser, getUserByEmail, loginUser } from "../controller/userController.js";

const router = express.Router();


// Get all users
router.get("/", getUser);

// Get user by email
router.get("/:email", getUserByEmail);

// Create user
router.post("/", createUser);

// Login user
router.post("/login", loginUser);

// Delete user by email
router.delete("/:email", deleteUser);

export default router;