import Joi from "joi";
import validator from "validator";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import { Resend } from "resend";
import {
  crearAplicacion,
  obtenerVacanteConEmpresa,
  incrementarAplicaciones,
} from "../models/aplicaciones.js";
import {
  obtenerVacantes,
  crearVacante,
  validarLimiteVacantes,
  obtenerAllVacantes,
  eliminarVacante,
  actualizarVacante,
  actualizarEstadoVacante,
  activarEstadoVacante,
  incrementarVistas,
} from "../models/vacantes.js";
import aplicacionTemplate from "../services/email/aplicacionTemplate.js";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export const schemaAplicacion = Joi.object({
  nombre: Joi.string().max(100).required(),
  apellido: Joi.string().max(100).allow("").optional(),
  edad: Joi.string().max(10).allow("").optional(),
  domicilio: Joi.string().max(255).allow("").optional(),
  telefono: Joi.string().max(20).required(),
  sexo: Joi.string().max(20).allow("").optional(),
  fechaNacimiento: Joi.string().max(20).allow("").optional(),
  estadoCivil: Joi.string().max(50).allow("").optional(),
  email: Joi.string().email().required(),
  escolaridad: Joi.string().max(100).allow("").optional(),
  tituloRecibido: Joi.string().max(100).allow("").optional(),
  idiomas: Joi.string().max(255).allow("").optional(),
  software: Joi.string().max(255).allow("").optional(),
  maquinas: Joi.string().max(255).allow("").optional(),
  otroTrabajos: Joi.string().max(255).allow("").optional(),
  empresa: Joi.string().max(150).allow("").optional(),
  puesto: Joi.string().max(150).allow("").optional(),
  descripcion: Joi.string().max(1000).allow("").optional(),
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
    await validarLimiteVacantes(empresaId);
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

export const aplicarAVacante = async (req, res) => {
  const { vacanteId } = req.params;

  const { error: validationError, value: datos } = schemaAplicacion.validate(
    req.body,
  );

  if (validationError) {
    return res
      .status(400)
      .json({ message: validationError.details[0].message });
  }

  // Escapar todos los campos de texto
  const candidato = Object.fromEntries(
    Object.entries(datos).map(([key, val]) => [
      key,
      typeof val === "string" && val ? validator.escape(val).trim() : val,
    ]),
  );

  try {
    const vacante = await obtenerVacanteConEmpresa(vacanteId);

    if (!vacante) {
      return res.status(404).json({ message: "Vacante no encontrada" });
    }

    if (!vacante.empresaEmail) {
      return res
        .status(422)
        .json({ message: "La empresa no tiene correo registrado" });
    }

    const cvBuffer = req.file?.buffer || null;
    const cvNombre = req.file?.originalname || null;

    const attachments = cvBuffer
      ? [
          {
            filename: cvNombre || `CV_${candidato.nombre}.pdf`,
            content: cvBuffer,
          },
        ]
      : [];

    const { error } = await resend.emails.send({
      from: `Enlace Local <${process.env.EMAIL_FROM}>`,
      to: vacante.empresaEmail,
      subject: `Nueva aplicación para: ${vacante.puesto}`,
      html: aplicacionTemplate({
        vacanteTitulo: vacante.puesto,
        empresaNombre: vacante.empresaNombre,
        candidato: { ...candidato, tieneCv: !!cvBuffer },
      }),
      attachments,
    });

    if (error) {
      console.error("Error al enviar correo:", error);
      return res
        .status(502)
        .json({ message: "No se pudo enviar la aplicación" });
    }

    await crearAplicacion(vacanteId, candidato.email);

    res
      .status(200)
      .json({ message: "Tu aplicación fue enviada correctamente" });
  } catch (error) {
    console.error("Error al aplicar a vacante:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const actualizarVistas = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await incrementarVistas(id);

    if (!resultado) {
      return res.status(404).json({
        success: false,
        message: "Vacante no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Vistas actualizadas correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar vistas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const actualizarAplicaciones = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await incrementarAplicaciones(id);

    if (!resultado) {
      return res.status(404).json({
        success: false,
        message: "Vacante no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Aplicaciones actualizadas correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar aplicaciones:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
