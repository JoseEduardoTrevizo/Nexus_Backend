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
  industria,
  contraseña,
  planId,
}) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(contraseña, 12);

    const [empresaResult] = await connection.execute(
      `INSERT INTO empresas (nombre, email, industria, password) VALUES (?, ?, ?, ?)`,
      [nombre, email, industria || null, hashedPassword],
    );

    const empresaId = empresaResult.insertId;

    await connection.execute(
      `INSERT INTO suscripciones (empresa_id, plan_id, estado) VALUES (?, ?, 'activa')`,
      [empresaId, planId],
    );

    await connection.commit();
    return { success: true, empresaId };
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("El email ya está registrado");
    }
    throw error;
  } finally {
    connection.release();
  }
};
