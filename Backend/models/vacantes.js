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
      `SELECT v.*, e.nombre, e.email, e.industria, e.telefono
       FROM vacantes v
       INNER JOIN empresas e ON v.idEmpresa = e.id`,
    );
    return vacantes;
  } catch (error) {
    throw error;
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
