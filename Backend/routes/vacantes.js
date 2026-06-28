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
  aplicarAVacante,
  actualizarVistas,
  actualizarAplicaciones,
} from "../controllers/vacantes.js";
import { upload } from "../middleware/uploadMiddleware.js";
import validateSchema from "../middleware/validateSchema.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
//Rutas publicas
router.get("/disponibles", listarAllVacantes);
router.post("/:id/vistas", actualizarVistas);
router.post("/:id/aplicaciones", actualizarAplicaciones);

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

//Rutas libres
router.post("/:vacanteId/aplicar", upload.single("cv"), aplicarAVacante);
export default router;
