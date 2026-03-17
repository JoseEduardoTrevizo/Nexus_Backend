import jwt from "jsonwebtoken";

// Este middleware se coloca antes de cualquier ruta que requiera autenticación
// Si el token es válido, agrega req.user con los datos del usuario y llama next()
// Si no, responde con 401 y corta la cadena de middlewares

function verifyToken(req, res, next) {
  // El token viene en el header Authorization: "Bearer eyJhb..."
  const authHeader = req.headers["authorization"];
  console.log("Header recibido:", authHeader);
  // Verificar que el header exista
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Acceso denegado: no se proporcionó token" });
  }

  // El formato es "Bearer TOKEN", separamos para obtener solo el token
  const token = authHeader.split(" ")[1];
  console.log("Token extraído:", token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado: formato de token inválido" });
  }

  try {
    // Verificar y decodificar el token usando la misma clave secreta con la que se firmó
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntamos los datos del usuario al request para usarlos en el controlador
    req.user = decoded;

    // Todo bien, continuar al siguiente middleware o controlador
    next();
  } catch (error) {
    // jwt.verify lanza error si el token expiró o está malformado
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expirado, inicia sesión nuevamente" });
    }
    return res.status(401).json({ message: "Token inválido" });
  }
}

export { verifyToken };
