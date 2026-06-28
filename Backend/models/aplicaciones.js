import pool from "../config/database.js";

export const crearAplicacion = async (idVacante, emailCandidato) => {
  const [result] = await pool.query(
    `INSERT INTO aplicaciones (idVacante, emailCandidato, createdAt)
     VALUES (?, ?, NOW())`,
    [idVacante, emailCandidato],
  );
  return result.insertId;
};

export const obtenerVacanteConEmpresa = async (idVacante) => {
  const [rows] = await pool.query(
    `SELECT v.id, v.puesto, e.email AS empresaEmail, e.nombre AS empresaNombre
     FROM vacantes v
     JOIN empresas e ON v.idEmpresa = e.id
     WHERE v.id = ?`,
    [idVacante],
  );
  return rows[0] || null;
};

export const incrementarAplicaciones = async (idVacante) => {
  const [[vacante]] = await pool.query("SELECT id FROM vacantes WHERE id = ?", [
    idVacante,
  ]);

  if (!vacante) return null;

  await pool.query(
    "UPDATE vacantes SET aplicaciones = aplicaciones + 1 WHERE id = ?",
    [idVacante],
  );

  return true;
};
