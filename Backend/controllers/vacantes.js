import Joi from "joi";
import validator from "validator";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import {
  obtenerVacantes,
  crearVacante,
  obtenerAllVacantes,
  eliminarVacante,
  actualizarVacante,
  actualizarEstadoVacante,
  activarEstadoVacante,
} from "../models/vacantes.js";

export const schemaCrearVacante = Joi.object({
  puesto: Joi.string().max(150).required(),
  ciudad: Joi.string().max(150).required(),
  salarioMinimo: Joi.number().positive().optional(),
  salarioMaximo: Joi.number().positive().optional(),
  descripcion: Joi.string().max(1000).optional(),
  requisitos: Joi.string().max(1000).optional(),
  habilidades: Joi.array().max(500).optional(),
  beneficios: Joi.string().max(500).optional(),
});

export const listarVacantes = async (req, res) => {
  const { empresaId } = req.params;

  if (!empresaId) {
    return res.status(400).json({ message: "ID de empresa es requerido" });
  }

  try {
    const vacantes = await obtenerVacantes(empresaId);
    res.json({ vacantes });
  } catch (error) {
    console.error("Error al obtener vacantes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const listarAllVacantes = async (req, res) => {
  try {
    const vacantes = await obtenerAllVacantes();
    res.json({ vacantes });
  } catch (error) {
    console.error("Error al obtener todas las vacantes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const agregarVacante = async (req, res) => {
  const { empresaId } = req.params;
  const datos = {
    ...req.body,
    ...(req.body.puesto && {
      puesto: validator.escape(req.body.puesto).trim(),
    }),
    ...(req.body.ciudad && {
      ciudad: validator.escape(req.body.ciudad).trim(),
    }),
    ...(req.body.descripcion && {
      descripcion: validator.escape(req.body.descripcion).trim(),
    }),
    ...(req.body.requisitos && {
      requisitos: validator.escape(req.body.requisitos).trim(),
    }),
    ...(Array.isArray(req.body.habilidades) && {
      habilidades: JSON.stringify(
        req.body.habilidades.map((h) => validator.escape(String(h).trim())),
      ),
    }),
    ...(req.body.beneficios && {
      beneficios: validator.escape(req.body.beneficios).trim(),
    }),
  };

  try {
    const insertId = await crearVacante(empresaId, datos);
    res.status(201).json({
      message: "Vacante creada correctamente",
      id: insertId,
    });
  } catch (error) {
    console.error("Error al crear vacante:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const eliminarVacanteId = async (req, res) => {
  const { vacanteId } = req.params;

  if (!vacanteId) {
    return res.status(400).json({ message: "ID de vacante es requerido" });
  }
  try {
    const exito = await eliminarVacante(vacanteId);
    if (exito) {
      res.json({ message: "Vacante eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Vacante no encontrada" });
    }
  } catch (error) {
    console.error("Error al eliminar vacante:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const editarVacante = async (req, res) => {
  const { vacanteId } = req.params;
  const datos = {
    ...req.body,
    ...(req.body.puesto && {
      puesto: validator.escape(req.body.puesto).trim(),
    }),
    ...(req.body.salarioMinimo && {
      salarioMinimo: Number(req.body.salarioMinimo),
    }),
    ...(req.body.salarioMaximo && {
      salarioMaximo: Number(req.body.salarioMaximo),
    }),
    ...(req.body.ciudad && {
      ciudad: validator.escape(req.body.ciudad).trim(),
    }),
    ...(req.body.descripcion && {
      descripcion: validator.escape(req.body.descripcion).trim(),
    }),
    ...(req.body.requisitos && {
      requisitos: validator.escape(req.body.requisitos).trim(),
    }),
    ...(Array.isArray(req.body.habilidades) && {
      habilidades: JSON.stringify(
        req.body.habilidades.map((h) => validator.escape(String(h).trim())),
      ),
    }),
    ...(req.body.beneficios && {
      beneficios: validator.escape(req.body.beneficios).trim(),
    }),
  };

  try {
    const exito = await actualizarVacante(vacanteId, datos);
    if (exito) {
      res.json({ message: "Vacante actualizada correctamente" });
    } else {
      res.status(404).json({ message: "Vacante no encontrada" });
    }
  } catch (error) {
    console.error("Error al actualizar vacante:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const actualizarEstatusVacante = async (req, res) => {
  const { vacanteId } = req.params;
  const { estatus } = req.body;
  if (typeof estatus !== "string" || !["Activa", "Pausada"].includes(estatus)) {
    return res.status(400).json({ message: "Estatus inválido" });
  }
  try {
    const exito = await actualizarEstadoVacante(vacanteId, estatus);
    if (exito) {
      res.json({ message: "Estatus de vacante actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Vacante no encontrada" });
    }
  } catch (error) {
    console.error("Error al actualizar estatus de vacante:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const activarEstatusVacante = async (req, res) => {
  const { vacanteId } = req.params;
  const { estatus } = req.body;
  if (typeof estatus !== "string" || !["Activa", "Pausada"].includes(estatus)) {
    return res.status(400).json({ message: "Estatus inválido" });
  }
  try {
    const exito = await activarEstadoVacante(vacanteId, estatus);
    if (exito) {
      res.json({ message: "Estatus de vacante actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Vacante no encontrada" });
    }
  } catch (error) {
    console.error("Error al actualizar estatus de vacante:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
