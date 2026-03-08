import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/database.js"; // Importa para probar conexión al iniciar
import registroRoutes from "./routes/registro.js";
import authRoutes from "./routes/auth.js";

// Carga variables de entorno
dotenv.config();

const app = express();
// Configura CORS para permitir solicitudes desde el frontend
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Rutas
app.use("/api/empresas", registroRoutes);
app.use("/api/auth", authRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
