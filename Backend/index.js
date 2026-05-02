import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "./config/database.js"; // Importa para probar conexión al iniciar
import registroRoutes from "./routes/registro.js";
import authRoutes from "./routes/auth.js";
import editProfileRoutes from "./routes/editProfile.js";
import empresasRoutes from "./routes/empresas.js";
import directorio from "./routes/directorio.js";
import divisarRouter from "./routes/home.js";

// Carga variables de entorno
dotenv.config();

const app = express();

// Configura Rate Limiting: máximo 100 solicitudes por IP cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana
  message: {
    error: "Demasiadas solicitudes desde esta IP, por favor intenta más tarde.",
  },
  standardHeaders: true, // Retorna rate limit info en los headers `RateLimit-*`
  legacyHeaders: false, // Desactiva los headers `X-RateLimit-*`
});

// Configura Rate Limiting estricto para autenticación: máximo 5 intentos por IP cada 15 minutos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === "production" ? 5 : 100, // límite estricto de 5 solicitudes para login/registro
  skip: (req) => req.method === "OPTIONS",
  message: {
    error:
      "Demasiados intentos de autenticación desde esta IP, por favor intenta más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configura CORS para permitir solicitudes desde el frontend
app.use(cors({ origin: process.env.FRONTEND_URL.split(",") }));
app.use(express.json());
// Configura Helmet para headers de seguridad
app.use(helmet());
// Aplica rate limiting general a todas las rutas
app.use(limiter);
// Aplica rate limiting estricto específicamente a rutas de autenticación
app.use("/auth/login", authLimiter);
app.use("/empresas/registro", authLimiter);
// Rutas
app.use("/empresas", registroRoutes);
app.use("/auth", authRoutes);
app.use("/private", editProfileRoutes);
app.use("/public", empresasRoutes);
app.use("/directorio", directorio);
app.use("/divisas", divisarRouter);
app.use("/weather", divisarRouter);

process.on("uncaughtException", (error) => {
  console.error("CRASH uncaughtException:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("CRASH unhandledRejection:", reason);
});

// Inicia el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
