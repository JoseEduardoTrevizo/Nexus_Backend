import db from "../config/database.js";

export const obtenerEmpresa = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT e.id, e.nombre, e.email, e.telefono, e.picture_perfil, e.website, 
              e.tamano_empresa, e.horario, e.ciudad, e.direccion, e.latitud, e.longitud, e.eslogan, e.about,
              sub.id AS subsector_id, sub.nombre AS subsector,
              sec.id AS sector_id, sec.nombre AS sector,
              p.nombre AS plan
       FROM empresas e
       LEFT JOIN subsectores sub ON sub.id = e.subsector_id
       LEFT JOIN sectores sec ON sec.id = sub.sector_id
       LEFT JOIN suscripciones s ON s.empresa_id = e.id AND s.estado = 'activa'
       LEFT JOIN planes p ON p.id = s.plan_id
       WHERE e.id = ?`,
      [id],
    );
    if (!rows.length) return res.status(404).json({ message: "No encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error en obtenerEmpresa:", error.message);
    res.status(500).json({ message: "Error interno" });
  }
};
