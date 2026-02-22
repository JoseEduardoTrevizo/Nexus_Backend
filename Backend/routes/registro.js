import express from "express";
import { registrarEmpresa } from "../controllers/registro.js";

const router = express.Router();

// Ruta para registrar empresa
router.post("/registro", registrarEmpresa);

export default router;
