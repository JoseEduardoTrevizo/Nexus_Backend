import express from "express";
import validateSchema from "../middleware/validateSchema.js";
import { registrarEmpresa, schemaRegistro } from "../controllers/registro.js";

const router = express.Router();

// Ruta para registrar empresa
router.post("/registro", validateSchema(schemaRegistro), registrarEmpresa);

export default router;
