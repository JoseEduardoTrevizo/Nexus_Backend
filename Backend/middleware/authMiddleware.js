import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Acceso denegado: no se proporcionó token" });
  }

  const token = authHeader.split(" ")[1];
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

function optionalToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
}
export { verifyToken, optionalToken };
