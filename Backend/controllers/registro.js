import Joi from "joi";
import validator from "validator";
import {
  verificarPlan,
  insertarEmpresa,
  obtenerSectoresActivos,
  obtenerSubsectoresPorSector,
} from "../models/registros.js";

export const schemaRegistro = Joi.object({
  nombre: Joi.string().min(3).max(255).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  subsectorId: Joi.number().integer().positive().required(),
  telefono: Joi.string().min(10).max(10).required(),
  direccion: Joi.string().min(5).max(80),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  contraseña: Joi.string().min(8).required(),
  confirmarContraseña: Joi.string().valid(Joi.ref("contraseña")).required(),
  planId: Joi.number().integer().positive().required(),
});

export const registrarEmpresa = async (req, res) => {
  const {
    nombre,
    email,
    direccion,
    telefono,
    subsectorId,
    contraseña,
    planId,
    lat,
    lng,
  } = req.body;

  const safeNombre = validator.escape(nombre).trim();
  const safeEmail = email.toLowerCase().trim();
  const safedireccion = validator.escape(direccion).trim();
  const safetelefono = validator.escape(telefono).trim();

  // --- Validaciones existentes para lógica de negocio ---
  // no hace falta validar aquí la longitud de contraseña o confirmación (joi ya lo hace)

  // --- Lógica de negocio ---
  try {
    const planValido = await verificarPlan(planId);
    if (!planValido) {
      return res
        .status(400)
        .json({ error: "El plan seleccionado no existe o está inactivo" });
    }

    const resultado = await insertarEmpresa({
      nombre: safeNombre,
      email: safeEmail,
      direccion: safedireccion,
      lat,
      lng,
      telefono: safetelefono,
      subsectorId,
      contraseña,
      planId,
    });

    res.status(201).json({
      message: "Empresa registrada exitosamente",
      empresaId: resultado.empresaId,
    });
  } catch (error) {
    if (error.message === "El email ya está registrado") {
      return res.status(409).json({ error: error.message });
    }
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getSectores = async (req, res) => {
  try {
    const sectores = await obtenerSectoresActivos();
    res.status(200).json(sectores);
  } catch (error) {
    console.error("Error al obtener sectores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getSubsectores = async (req, res) => {
  const { sectorId } = req.query;

  if (!sectorId || isNaN(sectorId)) {
    return res
      .status(400)
      .json({ error: "sectorId es requerido y debe ser numérico" });
  }

  try {
    const subsectores = await obtenerSubsectoresPorSector(sectorId);
    res.status(200).json(subsectores);
  } catch (error) {
    console.error("Error al obtener subsectores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
