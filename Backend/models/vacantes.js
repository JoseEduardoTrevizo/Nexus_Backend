import pool from "../config/database.js";

export const obtenerVacantes = async (empresaId) => {
  try {
    const [vacantes] = await pool.execute(
      "SELECT * FROM vacantes WHERE idEmpresa = ?",
      [empresaId],
    );
    return vacantes;
  } catch (error) {
    throw error;
  }
};
export const obtenerAllVacantes = async () => {
  try {
    const [vacantes] = await pool.execute(
      `SELECT v.*, e.nombre, e.email, e.telefono,
              sub.id AS subsector_id, sub.nombre AS subsector,
              sec.id AS sector_id, sec.nombre AS sector
       FROM vacantes v
       INNER JOIN empresas e ON v.idEmpresa = e.id
       LEFT JOIN subsectores sub ON sub.id = e.subsector_id
       LEFT JOIN sectores sec ON sec.id = sub.sector_id`,
    );
    return vacantes;
  } catch (error) {
    throw error;
  }
};

export const obtenerPlanActivoEmpresa = async (empresaId) => {
  const [rows] = await pool.execute(
    `SELECT p.id, p.nombre, p.limite_vacantes
     FROM suscripciones s
     JOIN planes p ON p.id = s.plan_id
     WHERE s.empresa_id = ?
       AND s.estado = 'activa'
       AND (s.fecha_fin IS NULL OR s.fecha_fin > NOW())
     ORDER BY s.fecha_inicio DESC
     LIMIT 1`,
    [empresaId],
  );
  return rows[0] || null;
};

export const contarVacantesEmpresa = async (empresaId) => {
  const [rows] = await pool.execute(
    "SELECT COUNT(*) AS total FROM vacantes WHERE idEmpresa = ?",
    [empresaId],
  );
  return rows[0].total;
};

export const validarLimiteVacantes = async (empresaId) => {
  const plan = await obtenerPlanActivoEmpresa(empresaId);

  if (!plan) {
    const err = new Error("La empresa no tiene una suscripción activa");
    err.status = 403;
    throw err;
  }

  // NULL en limite_vacantes = ilimitado (Plan Premium)
  if (plan.limite_vacantes === null) return;

  if (plan.limite_vacantes === 0) {
    const err = new Error("Tu plan actual no permite crear vacantes");
    err.status = 403;
    throw err;
  }

  const totalActual = await contarVacantesEmpresa(empresaId);
  if (totalActual >= plan.limite_vacantes) {
    const err = new Error(
      `Alcanzaste el límite de ${plan.limite_vacantes} vacantes para tu plan`,
    );
    err.status = 403;
    throw err;
  }
};

export const crearVacante = async (empresaId, datos) => {
  const {
    puesto,
    ciudad,
    salarioMinimo,
    salarioMaximo,
    descripcion,
    requisitos,
    habilidades,
    beneficios,
  } = datos;
  try {
    const [result] = await pool.execute(
      "INSERT INTO vacantes (idEmpresa, puesto, ciudadTrabajo, salarioMin, salarioMax, descripcion, requisitos, habilidades, beneficios, created_at,update_at) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        empresaId,
        puesto,
        ciudad,
        salarioMinimo,
        salarioMaximo,
        descripcion,
        requisitos,
        habilidades,
        beneficios,
        new Date(),
        new Date(),
      ],
    );
    return result.insertId;
  } catch (error) {
    console.error("Error creando vacante:", error);
    throw error;
  }
};

export const eliminarVacante = async (vacanteId) => {
  try {
    const [result] = await pool.execute("DELETE FROM vacantes WHERE id = ?", [
      vacanteId,
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error eliminando vacante:", error);
    throw error;
  }
};

export const actualizarVacante = async (vacanteId, datos) => {
  const {
    puesto,
    ciudad,
    salarioMinimo,
    salarioMaximo,
    descripcion,
    requisitos,
    habilidades,
    beneficios,
  } = datos;
  try {
    const [result] = await pool.execute(
      `UPDATE vacantes SET 
        puesto = ?, ciudadTrabajo = ?, salarioMin = ?, salarioMax = ?,
        descripcion = ?, requisitos = ?, habilidades = ?, beneficios = ?, update_at = ?
       WHERE id = ?`,
      [
        puesto,
        ciudad,
        salarioMinimo,
        salarioMaximo,
        descripcion,
        requisitos,
        habilidades,
        beneficios,
        new Date(),
        vacanteId,
      ],
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error actualizando vacante:", error);
    throw error;
  }
};

export const actualizarEstadoVacante = async (vacanteId, estado) => {
  try {
    const [result] = await pool.execute(
      "UPDATE vacantes SET estatus = ?, update_at = ? WHERE id = ?",
      [estado, new Date(), vacanteId],
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error actualizando estado de la vacante:", error);
    throw error;
  }
};

export const activarEstadoVacante = async (vacanteId, estado) => {
  try {
    const [result] = await pool.execute(
      "UPDATE vacantes SET estatus = ?, update_at = ? WHERE id = ?",
      [estado, new Date(), vacanteId],
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error activando vacante:", error);
    throw error;
  }
};

export const incrementarVistas = async (idVacante) => {
  try {
    const [[vacante]] = await pool.execute(
      "SELECT id FROM vacantes WHERE id = ?",
      [idVacante],
    );

    if (!vacante) return null;

    await pool.execute("UPDATE vacantes SET vistas = vistas + 1 WHERE id = ?", [
      idVacante,
    ]);

    return true;
  } catch (error) {
    console.error("Error sumando vistas", error);
    throw error;
  }
};
