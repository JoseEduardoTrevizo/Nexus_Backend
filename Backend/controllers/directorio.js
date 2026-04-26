import { obtenerEmpresas } from "../models/directorio.js";

export const getEmpresas = async (req, res) => {
  try {
    const empresas = await obtenerEmpresas();

    if (!empresas || empresas.length === 0) {
      return res.status(404).json({ message: "No se encontraron empresas" });
    }
    res.status(200).json(empresas);
  } catch (error) {
    console.error("Error obteniendo empresas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default {
  getEmpresas,
};
