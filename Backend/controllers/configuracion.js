import Joi from "joi";
import bcrypt from "bcryptjs";
import {
  obtenerPasswordHash,
  actualizarPassword,
} from "../models/configuracion.js";

const schemaActualizarPassword = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .required()
    .invalid(Joi.ref("currentPassword"))
    .messages({
      "any.invalid": "La nueva contraseña no puede ser igual a la actual",
    }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Las contraseñas no coinciden",
    }),
});

const actualizarPasswordUser = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const usuarioId = req.user.id; // Asegúrate de que el ID del usuario esté disponible en req.usuario
  console.log("Usuario ID:", usuarioId);
  console.log("Contraseña Actual:", currentPassword);
  console.log("Contraseña Nueva:", newPassword);
  if (!usuarioId) {
    return res.status(400).json({ error: "ID de usuario no proporcionado" });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const passwordHash = await obtenerPasswordHash(usuarioId);
    if (!passwordHash) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      passwordHash.password,
    );
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "La contraseña actual es incorrecta" });
    }

    await actualizarPassword(usuarioId, newPassword);
    return res
      .status(200)
      .json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export { actualizarPasswordUser, schemaActualizarPassword };

export default {
  actualizarPasswordUser,
  schemaActualizarPassword,
};
