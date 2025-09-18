import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Importar rutas
import tournamentRoutes from "./routes/tournamentRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import standingsRoutes from "./routes/standingsRoutes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

// ============================
// Middlewares
// ============================
app.use(cors({ origin: process.env.CLIENT_URL?.split(",") || "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// ============================
// Conexión a MongoDB
// ============================
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const MONGO_DB = process.env.MONGO_DB || "tournaments2";

mongoose
  .connect(MONGO_URI, { dbName: MONGO_DB })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error de conexión MongoDB:", err));

// ============================
// Rutas de la API
// ============================
app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/standings", standingsRoutes);

// Ruta de prueba para verificar backend
app.get("/ping", (_req, res) => res.send("API funcionando 🚀"));

// ============================
// Servir frontend (después de API)
// ============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ============================
// Levantar servidor
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en Puerto:${PORT}`);
});
