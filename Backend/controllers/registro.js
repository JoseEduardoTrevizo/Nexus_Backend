import { verificarPlan, insertarEmpresa } from "../models/registros.js";

export const registrarEmpresa = async (req, res) => {
  const { nombre, email, industria, contraseña, confirmarContraseña, planId } =
    req.body;

  // --- Validaciones ---
  if (
    !nombre ||
    !email ||
    !industria ||
    !contraseña ||
    !confirmarContraseña ||
    !planId
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (contraseña !== confirmarContraseña) {
    return res.status(400).json({ error: "Las contraseñas no coinciden" });
  }

  if (contraseña.length < 8) {
    return res
      .status(400)
      .json({ error: "La contraseña debe tener al menos 8 caracteres" });
  }

  // --- Lógica de negocio ---
  try {
    const planValido = await verificarPlan(planId);
    if (!planValido) {
      return res
        .status(400)
        .json({ error: "El plan seleccionado no existe o está inactivo" });
    }

    const resultado = await insertarEmpresa({
      nombre,
      email,
      industria,
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
