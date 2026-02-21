import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/database.js"; // Importa para probar conexión al iniciar

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Ruta de prueba
app.get("/api/ping", (req, res) => {
  res.json({ message: "Backend funcionando correctamente" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
