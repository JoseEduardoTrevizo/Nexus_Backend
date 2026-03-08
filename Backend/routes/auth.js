import express from "express";
const router = express.Router();
import { login } from "../controllers/auth.js";
import { verifyToken } from "../middleware/authMiddleware.js";

// Ruta pública — no requiere token
// POST /api/auth/login
router.post("/login", login);

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;
