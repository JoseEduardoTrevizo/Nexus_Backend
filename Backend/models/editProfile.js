import pool from "../config/database.js";

export const actualizarPerfil = async (id, datos) => {
  const {
    email,
    telefono,
    website,
    industria,
    tamano_empresa,
    horario,
    direccion,
  } = datos;
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      `UPDATE empresas SET email = ?, telefono = ?, website = ?, industria = ?, tamano_empresa = ?, horario = ?, direccion = ? WHERE id = ?`,
      [
        email,
        telefono,
        website,
        industria,
        tamano_empresa,
        horario,
        direccion,
        id,
      ],
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    throw error;
  }
};

export default { actualizarPerfil };
