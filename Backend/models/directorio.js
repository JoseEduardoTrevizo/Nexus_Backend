import pool from "../config/database.js";

export const obtenerEmpresas = async () => {
  try {
    const [empresas] = await pool.execute(
      "SELECT id, nombre, email, industria, telefono, website, tamano_empresa, horario, direccion, ciudad, latitud, longitud, eslogan, about FROM empresas",
    );
    return empresas;
  } catch (error) {
    console.error("Error obteniendo empresas:", error);
    throw error;
  }
};

export default {
  obtenerEmpresas,
};
