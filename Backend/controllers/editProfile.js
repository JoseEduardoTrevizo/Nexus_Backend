import Joi from "joi";
import validator from "validator";
import { actualizarPerfil } from "../models/editProfile.js";

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
      website: validator.escape(req.body.website).trim(),
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
  };

  try {
    const result = await actualizarPerfil(id, datos);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
