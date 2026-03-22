import express from "express";
import validateSchema from "../middleware/validateSchema.js";
import {
  editarPerfil,
  schemaEditarPerfil,
} from "../controllers/editProfile.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
// Ruta protegida — requiere token válido
router.put(
  "/edit-profile/:id",
  verifyToken,
  validateSchema(schemaEditarPerfil),
  editarPerfil,
);

export default router;
