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

  try {
    // 3. Buscar el usuario en la BD por email
    // Usamos tu tabla "registros" según tu modelo registros.js
    const [rows] = await db.query("SELECT *FROM empresas WHERE email = ?", [
      email,
    ]);

    // 4. Verificar que el usuario exista
    if (rows.length === 0) {
      // Usamos el mismo mensaje para no revelar si el email existe o no
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    const user = rows[0];

    // 5. Comparar la contraseña con el hash guardado en la BD
    // bcrypt.compare hace esto de forma segura sin desencriptar
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    //5.1 Obtener el plan activo del usuario (si existe)
    const [suscripcion] = await db.query(
      `SELECT p.nombre as plan_nombre 
   FROM suscripciones s 
   JOIN planes p ON s.plan_id = p.id 
   WHERE s.empresa_id = ? AND s.estado = 'activa' 
   LIMIT 1`,
      [user.id],
    );

    const planNombre =
      suscripcion.length > 0 ? suscripcion[0].plan_nombre : null;

    // 6. Generar el JWT Token
    // El payload son los datos que queremos guardar dentro del token
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

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // Clave secreta del .env
      { expiresIn: "2h" }, // El token expira en 2 horas
    );

    // 7. Responder con el token y datos del usuario (sin la contraseña)
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
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export { login };
