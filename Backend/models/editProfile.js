import pool from "../config/database.js";

export const actualizarPerfil = async (id, datos) => {
  const {
    email,
    telefono,
    website,
    subsectorId,
    tamano_empresa,
    horario,
    direccion,
    ubicacion,
    lat,
    lng,
  } = datos;
  try {
    const [result] = await pool.execute(
      `UPDATE empresas SET email = ?, telefono = ?, website = ?, subsector_id = ?, tamano_empresa = ?, horario = ?,ciudad = ?, direccion = ?,latitud = ?, longitud = ? WHERE id = ?`,
      [
        email,
        telefono,
        website,
        subsectorId,
        tamano_empresa,
        horario,
        ubicacion,
        direccion,
        lat,
        lng,
        id,
      ],
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    throw error;
  }
};

export const editarHeaderPerfil = async (id, datos) => {
  const { nombre, eslogan } = datos;

  try {
    const [result] = await pool.execute(
      `UPDATE empresas SET nombre = ?, eslogan = ? WHERE id = ?`,
      [nombre, eslogan, id],
    );
    return result;
  } catch (error) {
    console.error("Error actualizando encabezado de perfil:", error);
    throw error;
  }
};

export const editarAboutPerfil = async (id, datos) => {
  const { about } = datos;

  try {
    const [result] = await pool.execute(
      `UPDATE empresas SET about = ? WHERE id = ?`,
      [about, id],
    );
    return result;
  } catch (error) {
    console.error("Error actualizando sección 'Acerca de':", error);
    throw error;
  }
};

export default {
  actualizarPerfil,
  editarHeaderPerfil,
  editarAboutPerfil,
};
