import pool from "../config/database.js";
import bcrypt from "bcryptjs";

// Verifica si el plan existe y está activo
export const verificarPlan = async (planId) => {
  const connection = await pool.getConnection();
  const [result] = await connection.execute(
    "SELECT id FROM planes WHERE id = ? AND activo = TRUE LIMIT 1",
    [planId],
  );
  connection.release();
  return result.length > 0;
};

// Inserta empresa y suscripción en una transacción
export const insertarEmpresa = async ({
  nombre,
  email,
  telefono,
  direccion,
  cp,
  subsectorId,
  contraseña,
  planId,
  lat,
  lng,
}) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(contraseña, 12);

    const [empresaResult] = await connection.execute(
      `INSERT INTO empresas (nombre, email, subsector_id, password, telefono, direccion, latitud, longitud) VALUES (?,?,?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        email,
        subsectorId,
        hashedPassword,
        telefono,
        direccion,
        lat,
        lng,
      ],
    );

    const empresaId = empresaResult.insertId;

    await connection.execute(
      `INSERT INTO suscripciones (empresa_id, plan_id, estado) VALUES (?, ?, 'activa')`,
      [empresaId, planId],
    );

    await connection.commit();
    return { success: true, empresaId };
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Error en rollback:", rollbackError);
    }
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("El email ya está registrado");
    }
    throw error;
  } finally {
    connection.release();
  }
};
export const obtenerSectoresActivos = async () => {
  const [rows] = await pool.query(
    `SELECT id, nombre FROM sectores WHERE activo = 1 ORDER BY nombre ASC`,
  );
  return rows;
};

export const obtenerSubsectoresPorSector = async (sectorId) => {
  const [rows] = await pool.query(
    `SELECT id, nombre FROM subsectores WHERE sector_id = ? AND activo = 1 ORDER BY nombre ASC`,
    [sectorId],
  );
  return rows;
};

export const verificarSubsectorActivo = async (subsectorId) => {
  const [rows] = await pool.query(
    `SELECT id FROM subsectores WHERE id = ? AND activo = 1 LIMIT 1`,
    [subsectorId],
  );
  return rows.length > 0;
};
