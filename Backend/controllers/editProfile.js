import { actualizarPerfil } from "../models/editProfile.js";

export const editarPerfil = async (req, res) => {
  const { id } = req.params;
  const datos = req.body;

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
