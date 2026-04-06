import Joi from "joi";
import validator from "validator";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import { actualizarPerfil, editarHeaderPerfil } from "../models/editProfile.js";

export const schemaEditarPerfil = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional(),
  telefono: Joi.string().max(30).optional(),
  website: Joi.string().uri().optional(),
  industria: Joi.string().max(150).optional(),
  tamano_empresa: Joi.string().max(100).optional(),
  horario: Joi.string().max(100).optional(),
  direccion: Joi.string().max(255).optional(),
  ubicacion: Joi.string().max(150).optional(),
  nombre: Joi.string().max(150).optional(),
  eslogan: Joi.string().max(255).optional(),
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
    ...(req.body.industria && {
      industria: validator.escape(req.body.industria).trim(),
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
  };

  try {
    const result = await actualizarPerfil(id, datos);

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
        email: usuario.email,
        nombre: usuario.nombre,
        industria: usuario.industria,
        telefono: usuario.telefono,
        web_site: usuario.website,
        tamano_empresa: usuario.tamano_empresa,
        horario_atencion: usuario.horario,
        ubicacion: usuario.ubicacion,
        direccion: usuario.direccion,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
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
      { expiresIn: "7d" },
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
