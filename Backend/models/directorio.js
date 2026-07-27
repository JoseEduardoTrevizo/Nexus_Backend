import pool from "../config/database.js";

export const obtenerEmpresas = async ({ sectorId, subsectorId } = {}) => {
  try {
    let query = `
      SELECT e.id, e.nombre, e.email, e.telefono, e.picture_perfil, e.website, 
             e.tamano_empresa, e.horario, e.direccion, e.ciudad, e.latitud, e.longitud, e.eslogan, e.about,
             sub.id AS subsector_id, sub.nombre AS subsector,
             sec.id AS sector_id, sec.nombre AS sector,
             s.plan_id
      FROM empresas e
      LEFT JOIN subsectores sub ON sub.id = e.subsector_id
      LEFT JOIN sectores sec ON sec.id = sub.sector_id
      LEFT JOIN suscripciones s ON s.empresa_id = e.id AND s.estado = 'activa'
    `;

    const params = [];
    const condiciones = [];

    if (subsectorId) {
      condiciones.push("sub.id = ?");
      params.push(subsectorId);
    } else if (sectorId) {
      condiciones.push("sec.id = ?");
      params.push(sectorId);
    }

    if (condiciones.length) {
      query += ` WHERE ${condiciones.join(" AND ")}`;
    }

    const [empresas] = await pool.execute(query, params);
    return empresas;
  } catch (error) {
    console.error("Error obteniendo empresas:", error);
    throw error;
  }
};

export default {
  obtenerEmpresas,
};
