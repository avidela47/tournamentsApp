import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Importar rutas
import tournamentRoutes from "./routes/tournamentRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import standingsRoutes from "./routes/standingsRoutes.js";

dotenv.config();
const app = express();

// ============================
// Middlewares
// ============================
app.use(cors());
app.use(express.json());

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
// Rutas
// ============================
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/standings", standingsRoutes);

// Ruta de prueba
app.get("/", (_req, res) => res.send("API funcionando correctamente 🚀"));

// ============================
// Levantar servidor
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔥 Servidor corriendo en Puerto:${PORT}`)
);
