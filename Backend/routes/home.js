import express from "express";
import {
  obtenerTipoCambioUSD,
  obtenerHistorico,
} from "../controllers/divisas.js";
import { getCarruselInicio } from "../controllers/carrusel.js";
import { obtenerClima } from "../controllers/weather.js";
const router = express.Router();

router.get("/tipo-cambio-usd", obtenerTipoCambioUSD);
router.get("/tipo-cambio-historico", obtenerHistorico);
router.get("/carrusel", getCarruselInicio);
router.get("/clima", obtenerClima);

export default router;
