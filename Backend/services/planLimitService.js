import db from "../config/database.js";

async function getLimiteYConteo(empresaId) {
  const [suscripcionRows] = await db.query(
    `SELECT 
       s.plan_id,
       p.nombre AS plan_nombre,
       p.limite_imagenes
     FROM suscripciones s
     INNER JOIN planes p ON p.id = s.plan_id
     WHERE s.empresa_id = ?
       AND s.estado = 'activa'
     LIMIT 1`,
    [empresaId],
  );

  if (suscripcionRows.length === 0) {
    throw new Error("La empresa no tiene una suscripción activa");
  }

  const { limite_imagenes, plan_nombre } = suscripcionRows[0];

  const [conteoRows] = await db.query(
    `SELECT COUNT(*) AS conteo
     FROM imagenes_empresa
     WHERE empresa_id = ?`,
    [empresaId],
  );

  const conteo = conteoRows[0].conteo;

  return {
    limite: limite_imagenes,
    conteo,
    plan_nombre,
  };
}

export { getLimiteYConteo };
