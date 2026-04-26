import express from "express";
import { getEmpresas } from "../controllers/directorio.js";

const router = express.Router();

router.get("/empresas", getEmpresas);

export default router;
