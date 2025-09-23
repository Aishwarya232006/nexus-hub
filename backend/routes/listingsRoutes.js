import express from "express";
const router = express.Router();

// Dummy routes for Phase 1
router.get("/", (req, res) => res.json({ message: "Get all listings (dummy)" }));
router.get("/:id", (req, res) => res.json({ message: `Get listing ${req.params.id} (dummy)` }));
router.post("/", (req, res) => res.json({ message: "Add listing (dummy)" }));
router.delete("/:id", (req, res) => res.json({ message: `Delete listing ${req.params.id} (dummy)` }));

export default router;
