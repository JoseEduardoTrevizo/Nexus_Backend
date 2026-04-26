import express from "express";
import {
  obtenerTipoCambioUSD,
  obtenerHistorico,
} from "../controllers/divisas.js";
import { obtenerClima } from "../controllers/weather.js";
const router = express.Router();

router.get("/tipo-cambio-usd", obtenerTipoCambioUSD);
router.get("/tipo-cambio-historico", obtenerHistorico);
router.get("/clima", obtenerClima);

export default router;
