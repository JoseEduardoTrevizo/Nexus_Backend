import bcrypt from "bcryptjs";
import db from "../config/database.js";

const obtenerPasswordHash = async (usuarioId) => {
  const connection = await db.getConnection();
  try {
    const [[row]] = await connection.query(
      "SELECT password FROM empresas WHERE id = ?",
      [usuarioId],
    );
    return row || null;
  } catch (error) {
    console.error("Error al obtener el hash de la contraseña:", error);
    throw error;
  } finally {
    connection.release();
  }
};

const actualizarPassword = async (usuarioId, nuevaContraseña) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const hash = await bcrypt.hash(nuevaContraseña, 10);

    const [[row]] = await connection.query(
      "SELECT id FROM empresas WHERE id = ?",
      [usuarioId],
    );
    if (!row) {
      throw new Error("Empresa no encontrada");
    }

    const [result] = await connection.query(
      "UPDATE empresas SET password = ? WHERE id = ?",
      [hash, usuarioId],
    );
    await connection.commit();
    return { message: "Contraseña actualizada exitosamente" };
  } catch (error) {
    await connection.rollback();
    console.error("Error al actualizar la contraseña:", error);
    throw error;
  } finally {
    connection.release();
  }
};

export { obtenerPasswordHash, actualizarPassword };
