import express from "express";
const router = express.Router();

// Dummy routes for Phase 1
router.get("/", (req, res) => res.json({ message: "Get all users (dummy)" }));
router.post("/signup", (req, res) => res.json({ message: "Signup (dummy)" }));
router.post("/login", (req, res) => res.json({ message: "Login (dummy)" }));

export default router;
