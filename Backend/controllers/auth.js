import Joi from "joi";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database.js";

export const schemaLogin = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).required(),
});

// POST /api/auth/login
async function login(req, res) {
  // 1. Extraer y sanitizar datos del body
  const email = validator.normalizeEmail(req.body.email);
  const { password } = req.body;

  let connection;
  try {
    // 3. Buscar el usuario en la BD por email
    console.log(`[Login] Buscando usuario con email: ${email}`);
    const [rows] = await db.query("SELECT * FROM empresas WHERE email = ?", [
      email,
    ]);

    // 4. Verificar que el usuario exista
    if (rows.length === 0) {
      console.log(`[Login] Usuario no encontrado: ${email}`);
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    const user = rows[0];
    console.log(`[Login] Usuario encontrado: ${user.nombre}`);

    // 5. Comparar la contraseña con el hash guardado en la BD
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log(`[Login] Contraseña incorrecta para: ${email}`);
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    //5.1 Obtener el plan activo del usuario (si existe)
    console.log(`[Login] Obteniendo plan activo para usuario ID: ${user.id}`);
    let planNombre = null;
    try {
      const [suscripcion] = await db.query(
        `SELECT p.nombre as plan_nombre 
         FROM suscripciones s 
         JOIN planes p ON s.plan_id = p.id 
         WHERE s.empresa_id = ? AND s.estado = 'activa' 
         LIMIT 1`,
        [user.id],
      );
      planNombre = suscripcion.length > 0 ? suscripcion[0].plan_nombre : null;
    } catch (planError) {
      console.warn(
        `[Login] Error obteniendo plan (continuando sin plan): ${planError.message}`,
      );
    }

    // 6. Generar el JWT Token
    console.log(`[Login] Generando JWT para usuario: ${user.id}`);
    const payload = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      industria: user.industria,
      telefono: user.telefono,
      web_site: user.website,
      tamano_empresa: user.tamano_empresa,
      direccion: user.direccion,
      horario_atencion: user.horario,
      ciudad: user.ciudad,
      eslogan: user.eslogan,
      acerca_de: user.about,
      plan: planNombre,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    console.log(`[Login] Login exitoso para: ${email}`);
    // 7. Responder con el token y datos del usuario
    return res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        industria: user.industria,
        telefono: user.telefono,
        web_site: user.website,
        tamano_empresa: user.tamano_empresa,
        direccion: user.direccion,
        horario_atencion: user.horario,
        ciudad: user.ciudad,
        eslogan: user.eslogan,
        acerca_de: user.about,
        plan: planNombre,
      },
    });
  } catch (error) {
    console.error(
      `[Login] Error crítico en login: ${error.message}`,
      error.stack,
    );
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export { login };
