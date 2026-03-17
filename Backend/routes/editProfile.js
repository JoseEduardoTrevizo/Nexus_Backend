import express from "express";
import { editarPerfil } from "../controllers/editProfile.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
// Ruta protegida — requiere token válido
router.put("/edit-profile/:id", verifyToken, editarPerfil);

export default router;
