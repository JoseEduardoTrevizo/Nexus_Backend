import Joi from "joi";
import validator from "validator";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import {
  actualizarPerfil,
  editarHeaderPerfil,
  editarAboutPerfil,
} from "../models/editProfile.js";
import { verificarSubsectorActivo } from "../models/registros.js";

export const schemaEditarPerfil = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional(),
  telefono: Joi.string().max(30).optional(),
  website: Joi.string().uri().allow("").optional(),
  subsectorId: Joi.number().integer().positive(),
  tamano_empresa: Joi.string().max(100).optional(),
  horario: Joi.string().max(100).optional(),
  direccion: Joi.string().max(255).optional(),
  lat: Joi.number().optional(),
  lng: Joi.number().optional(),
  ubicacion: Joi.string().max(150).optional(),
  nombre: Joi.string().max(150).optional(),
  eslogan: Joi.string().max(255).optional(),
  about: Joi.string().max(255).optional(),
});

export const schemaEditarHeader = Joi.object({
  nombre: Joi.string().max(150).optional(),
  eslogan: Joi.string().max(255).optional(),
});

export const schemaEditarAbout = Joi.object({
  about: Joi.string().max(500).optional(),
});

export const editarPerfil = async (req, res) => {
  const { id } = req.params;
  const datos = {
    ...req.body,
    ...(req.body.email && { email: validator.normalizeEmail(req.body.email) }),
    ...(req.body.telefono && {
      telefono: validator.escape(req.body.telefono).trim(),
    }),
    ...(req.body.website && {
      website: req.body.website.trim(),
    }),
    ...(req.body.subsectorId && {
      subsectorId: parseInt(req.body.subsectorId, 10),
    }),
    ...(req.body.tamano_empresa && {
      tamano_empresa: validator.escape(req.body.tamano_empresa).trim(),
    }),
    ...(req.body.horario && {
      horario: validator.escape(req.body.horario).trim(),
    }),
    ...(req.body.direccion && {
      direccion: validator.escape(req.body.direccion).trim(),
    }),
    ...(req.body.ubicacion && {
      ubicacion: validator.escape(req.body.ubicacion).trim(),
    }),
    ...(req.body.lat && {
      lat: parseFloat(req.body.lat),
    }),
    ...(req.body.lng && {
      lng: parseFloat(req.body.lng),
    }),
  };

  if (req.body.subsectorId && isNaN(datos.subsectorId)) {
    return res.status(400).json({ message: "subsectorId inválido" });
  }

  try {
    const subsectorValido = req.body.subsectorId
      ? await verificarSubsectorActivo(datos.subsectorId)
      : true;

    if (!subsectorValido) {
      return res
        .status(400)
        .json({ message: "El subsector no existe o está inactivo" });
    }

    const result = await actualizarPerfil(id, datos);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    const [rows] = await pool.execute(
      `SELECT e.*, sub.nombre AS subsector, sec.nombre AS sector, sec.id AS sector_id
       FROM empresas e
       LEFT JOIN subsectores sub ON sub.id = e.subsector_id
       LEFT JOIN sectores sec ON sec.id = sub.sector_id
       WHERE e.id = ?`,
      [id],
    );
    const usuario = rows[0];

    const nuevoToken = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        subsectorId: usuario.subsector_id,
        subsector: usuario.subsector,
        sectorId: usuario.sector_id,
        sector: usuario.sector,
        telefono: usuario.telefono,
        web_site: usuario.website,
        tamano_empresa: usuario.tamano_empresa,
        horario_atencion: usuario.horario,
        ubicacion: usuario.ubicacion,
        direccion: usuario.direccion,
        lat: usuario.lat,
        lng: usuario.lng,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Perfil actualizado correctamente",
      token: nuevoToken,
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const actualizarHeaderPerfil = async (req, res) => {
  const { id } = req.params;
  const datos = {
    ...req.body,
    ...(req.body.nombre && {
      nombre: validator.escape(req.body.nombre).trim(),
    }),
    ...(req.body.eslogan && {
      eslogan: validator.escape(req.body.eslogan).trim(),
    }),
  };

  try {
    const result = await editarHeaderPerfil(id, datos);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }
    const [rows] = await pool.execute("SELECT * FROM empresas WHERE id = ?", [
      id,
    ]);
    const usuario = rows[0];

    const nuevoToken = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        eslogan: usuario.eslogan,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.json({
      message: "Encabezado de perfil actualizado correctamente",
      token: nuevoToken,
    });
  } catch (error) {
    console.error("Error al actualizar encabezado de perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const actualizarAboutPerfil = async (req, res) => {
  const { id } = req.params;
  const datos = {
    ...req.body,
    ...(req.body.about && {
      about: validator.escape(req.body.about).trim(),
    }),
  };

  try {
    const result = await editarAboutPerfil(id, datos);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }
    const [rows] = await pool.execute("SELECT * FROM empresas WHERE id = ?", [
      id,
    ]);
    const usuario = rows[0];
    const nuevoToken = jwt.sign(
      {
        id: usuario.id,
        about: usuario.about,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.json({
      message: "Sección 'Acerca de' actualizada correctamente",
      token: nuevoToken,
    });
  } catch (error) {
    console.error("Error al actualizar sección 'Acerca de':", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
