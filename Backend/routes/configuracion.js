import express from "express";
import validateSchema from "../middleware/validateSchema.js";
import {
  actualizarPasswordUser,
  schemaActualizarPassword,
} from "../controllers/configuracion.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta protegida — requiere token válido
router.put(
  "/actualizar-password",
  verifyToken,
  validateSchema(schemaActualizarPassword),
  actualizarPasswordUser,
);
export default router;
