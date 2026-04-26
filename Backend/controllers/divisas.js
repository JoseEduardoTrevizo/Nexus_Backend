import { parse } from "dotenv";
import exchangeRateService from "../services/exchangeRate.js";
const { tipoCambioUSD, tipoCambioHistorico } = exchangeRateService;

export const obtenerTipoCambioUSD = async (req, res) => {
  try {
    const base = req.query.base || "USD";
    const data = await tipoCambioUSD(base);

    const mxn = data.conversion_rates.MXN;
    const eur = data.conversion_rates.EUR;
    const cad = data.conversion_rates.CAD;
    const usd = data.conversion_rates.USD;

    //euro/mxn
    const eurTomxn = parseFloat((mxn / eur).toFixed(2));
    //cad/mxn
    const cadTomxn = parseFloat((mxn / cad).toFixed(2));
    //usd/mxn
    const usdTomxn = parseFloat((mxn / usd).toFixed(2));

    res.json({
      base: data.base_code,
      fecha: data.time_last_update_utc,
      eur: data.conversion_rates.EUR,
      cad: data.conversion_rates.CAD,
      usd: data.conversion_rates.USD,
      usdTomxn: usdTomxn,
      eurTomxn: eurTomxn,
      cadTomxn: cadTomxn,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerHistorico = async (req, res) => {
  try {
    const base = req.query.base || "USD";
    const dias = parseInt(req.query.dias) || 7; // máx recomendado: 30

    const historial = await tipoCambioHistorico(base, dias);

    // Porcentaje de cambio: primer día vs último día
    const primero = historial[0].mxn;
    const ultimo = historial[historial.length - 1].mxn;
    const cambioPct = parseFloat(
      (((ultimo - primero) / primero) * 100).toFixed(2),
    );
    const diferenciaMxn = parseFloat((ultimo - primero).toFixed(4));

    res.json({
      base,
      cambioPct, // ej: -1.24 (bajó) o 2.31 (subió)
      tendencia: cambioPct >= 0 ? "alza" : "baja",
      tipoCambioInicial: parseFloat(primero.toFixed(4)),
      tipoCambioActual: parseFloat(ultimo.toFixed(4)),
      diferenciaMxn,
      historial, // array de { fecha, mxn, eur, eurToMxn }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
