import express from "express";
import validateSchema from "../middleware/validateSchema.js";
import { login, schemaLogin } from "../controllers/auth.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta pública — no requiere token
// POST /api/auth/login
router.post("/login", validateSchema(schemaLogin), login);

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;
