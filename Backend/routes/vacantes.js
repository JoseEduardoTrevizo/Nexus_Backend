import express from "express";
import {
  schemaCrearVacante,
  listarVacantes,
  listarAllVacantes,
  agregarVacante,
  eliminarVacanteId,
  editarVacante,
  actualizarEstatusVacante,
  activarEstatusVacante,
} from "../controllers/vacantes.js";
import validateSchema from "../middleware/validateSchema.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/disponibles", listarAllVacantes);

// Ruta protegida — requiere token válido
router.post(
  "/:empresaId/nueva-vacante",
  verifyToken,
  validateSchema(schemaCrearVacante),
  agregarVacante,
);
router.post(
  "/actualizar/:vacanteId",
  verifyToken,
  validateSchema(schemaCrearVacante),
  editarVacante,
);
router.post(
  "/pausar-vacante/:vacanteId",
  verifyToken,
  actualizarEstatusVacante,
);
router.post("/activar-vacante/:vacanteId", verifyToken, activarEstatusVacante);
router.get("/:empresaId", listarVacantes);
router.delete(
  "/eliminar/:vacanteId",
  verifyToken,
  validateSchema(schemaCrearVacante),
  eliminarVacanteId,
);
export default router;
