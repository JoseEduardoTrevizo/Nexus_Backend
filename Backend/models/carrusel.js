import pool from "../config/database.js";

export const obtenerEmpresasCarruselInicio = async () => {
  const [rows] = await pool.execute(
    `SELECT 
        sec.id AS sector_id,
        sec.nombre AS sector,
        e.id AS empresa_id,
        e.nombre AS empresa_nombre,
        img.url AS imagen_url,
        p.nombre AS plan
     FROM empresas e
     INNER JOIN subsectores sub ON sub.id = e.subsector_id
     INNER JOIN sectores sec ON sec.id = sub.sector_id
     INNER JOIN imagenes_empresa img ON img.empresa_id = e.id AND img.es_carrusel = 1
     INNER JOIN suscripciones s ON s.empresa_id = e.id AND s.estado = 'activa'
     INNER JOIN planes p ON p.id = s.plan_id AND p.nombre IN ('Plan Pro', 'Plan Premium')
     WHERE sec.activo = 1
     ORDER BY sec.nombre, p.nombre DESC`,
  );
  return rows;
};
