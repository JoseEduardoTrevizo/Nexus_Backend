import express from "express";
import { optionalToken } from "../middleware/authMiddleware.js";
import { obtenerEmpresa } from "../controllers/empresa.js";

const router = express.Router();

router.get("/empresa/:id", optionalToken, obtenerEmpresa);

export default router;
