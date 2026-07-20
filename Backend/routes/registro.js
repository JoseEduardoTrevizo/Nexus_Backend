import express from "express";
import validateSchema from "../middleware/validateSchema.js";
import {
  registrarEmpresa,
  schemaRegistro,
  getSectores,
  getSubsectores,
} from "../controllers/registro.js";

const router = express.Router();

// Ruta para registrar empresa
router.post("/registro", validateSchema(schemaRegistro), registrarEmpresa);

// Ruta para obtener sectores activos
router.get("/sectores", getSectores);

// Ruta para obtener subsectores por sector
router.get("/subsectores", getSubsectores);

export default router;
