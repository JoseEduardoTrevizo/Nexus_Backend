import db from "../config/database.js";
import { obtenerEmpresasCarruselInicio } from "../models/carrusel.js";

export const getCarruselInicio = async (req, res) => {
  try {
    const rows = await obtenerEmpresasCarruselInicio();

    const agrupado = {};
    for (const row of rows) {
      if (!agrupado[row.sector_id]) {
        agrupado[row.sector_id] = {
          sectorId: row.sector_id,
          sector: row.sector,
          empresas: [],
        };
      }
      agrupado[row.sector_id].empresas.push({
        empresaId: row.empresa_id,
        nombre: row.empresa_nombre,
        imagenUrl: row.imagen_url,
        plan: row.plan,
      });

      agrupado[row.sector_id].empresas.sort((a, b) => {
        if (a.plan === b.plan) return 0;
        return a.plan === "Plan Premium" ? -1 : 1;
      });
    }

    // Solo sectores con al menos una empresa (el INNER JOIN ya filtra esto,
    // pero lo dejamos explícito por si el query cambia en el futuro)
    const resultado = Object.values(agrupado).filter(
      (s) => s.empresas.length > 0,
    );

    res.json(resultado);
  } catch (error) {
    console.error("Error en getCarruselInicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
